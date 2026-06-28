/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
var express = require("express")
var router = express.Router()
const { Op } = require("sequelize")
const sequelize = require("../utils/db")
const { Categories, Products, Users } = require("../models/index")
const sendResponse = require("../utils/response")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const { logAudit } = require("../utils/auditLogger")


// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../public/uploads")
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/
    const mimetype = filetypes.test(file.mimetype)
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    if (mimetype && extname) {
      return cb(null, true)
    }
    cb(new Error("Only images are allowed (jpeg, jpg, png, gif, webp)"))
  }
})

/* POST upload category image. */
router.post("/upload", upload.single("image"), function (req, res, next) {
  try {
    if (!req.file) {
      return sendResponse(
        res,
        {
          success: false,
          message: "No file uploaded.",
        },
        400
      )
    }
    const imageUrl = `/uploads/${req.file.filename}`
    return sendResponse(
      res,
      {
        success: true,
        message: "Image uploaded successfully.",
        imageUrl: imageUrl,
      },
      200
    )
  } catch (error) {
    console.error(error)
    return sendResponse(
      res,
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      500
    )
  }
})

/* GET categories listing. */
router.get("/get", async function (req, res, next) {
  try {
    let { page = 1, limit = 10, sortField, sortOrder, filters, isFeatured } = req.query
    page = parseInt(page)
    limit = parseInt(limit)
    const offset = (page - 1) * limit

    let where = {}
    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured === 'true' || isFeatured === true;
    }
    if (filters) {
      const parsed = JSON.parse(filters)
      for (const field in parsed) {
        const value = parsed[field]?.value
        if (value !== undefined && value !== null) {
          where[field] = {
            [Op.like]: `%${value}%`,
          }
        }
      }
    }

    let order = []
    if (sortField) {
      order.push([sortField, sortOrder == -1 ? "DESC" : "ASC"])
    } else {
      order.push(["createdAt", "DESC"])
    }

    const count = await Categories.count({ where })
    const records = await Categories.findAll({
      where,
      limit,
      offset,
      order,
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM products AS product
              WHERE product.categoryId = categories.id
            )`),
            "productCount"
          ]
        ]
      }
    })

    return sendResponse(
      res,
      {
        success: true,
        message: "Categories fetched successfully.",
        data: {
          records,
          total: count,
        },
      },
      200
    )
  } catch (error) {
    console.error(error)
    return sendResponse(
      res,
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      500
    )
  }
})

/* GET category single. */
router.get("/get/:id", async function (req, res, next) {
  try {
    const { id } = req.params
    const category = await Categories.findOne({
      where: { id },
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM products AS product
              WHERE product.categoryId = categories.id
            )`),
            "productCount"
          ]
        ]
      }
    })
    if (category) {
      return sendResponse(
        res,
        {
          success: true,
          message: "Category fetched successfully.",
          data: category,
        },
        200
      )
    }
    return sendResponse(
      res,
      {
        success: false,
        message: "No category found",
      },
      404
    )
  } catch (error) {
    console.error(error)
    return sendResponse(
      res,
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      500
    )
  }
})

/* POST category add. */
router.post("/add", async function (req, res, next) {
  try {
    const user = await Users.findByPk(req.user.userId)
    if (!user || (user.userType !== "admin" && user.userType !== "seller")) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Unauthorized. Only admin or seller can perform this action.",
        },
        403
      )
    }

    const { name, description, imageUrl, isFeatured } = req.body

    if (!name) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Category name is required.",
        },
        200
      )
    }

    // Check if duplicate name exists
    const exists = await Categories.findOne({ where: { name } })
    if (exists) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Category name already exists.",
        },
        200
      )
    }

    if (isFeatured === true || isFeatured === 'true') {
      const featuredCount = await Categories.count({ where: { isFeatured: true } })
      if (featuredCount >= 4) {
        return sendResponse(
          res,
          {
            success: false,
            message: "Cannot feature more than 4 categories.",
          },
          200
        )
      }
    }

    const category = await Categories.create({
      name,
      description,
      imageUrl,
      isFeatured: isFeatured === true || isFeatured === 'true',
    })

    await logAudit(req, {
      action: "CREATE_CATEGORY",
      entityType: "Category",
      entityId: category.id,
      description: `Category "${category.name}" created by ${user.email}`,
      changes: category.toJSON(),
      status: "success"
    })

    return sendResponse(
      res,
      {
        success: true,
        message: "Category created successfully.",
        data: category,
      },
      200
    )
  } catch (error) {
    console.error(error)
    return sendResponse(
      res,
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      500
    )
  }
})

/* POST category update. */
router.post("/update/:id", async function (req, res, next) {
  try {
    const user = await Users.findByPk(req.user.userId)
    if (!user || (user.userType !== "admin" && user.userType !== "seller")) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Unauthorized. Only admin or seller can perform this action.",
        },
        403
      )
    }

    const { id } = req.params
    const { name, description, imageUrl, isFeatured } = req.body

    // Check if category exists
    const category = await Categories.findOne({ where: { id } })
    if (!category) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Category not found.",
        },
        404
      )
    }

    // Check if another category has the same name
    if (name && name !== category.name) {
      const exists = await Categories.findOne({ where: { name } })
      if (exists) {
        return sendResponse(
          res,
          {
            success: false,
            message: "Category name already exists.",
          },
          200
        )
      }
    }

    if (isFeatured === true || isFeatured === 'true') {
      const featuredCount = await Categories.count({
        where: {
          isFeatured: true,
          id: { [Op.ne]: id }
        }
      })
      if (featuredCount >= 4) {
        return sendResponse(
          res,
          {
            success: false,
            message: "Cannot feature more than 4 categories.",
          },
          200
        )
      }
    }

    const updateData = { name, description, imageUrl }
    if (isFeatured !== undefined) {
      updateData.isFeatured = isFeatured === true || isFeatured === 'true'
    }

    await Categories.update(
      updateData,
      { where: { id } }
    )

    const updatedCategory = await Categories.findOne({ where: { id } })

    await logAudit(req, {
      action: "UPDATE_CATEGORY",
      entityType: "Category",
      entityId: id,
      description: `Category "${updatedCategory.name}" updated by ${user.email}`,
      changes: {
        before: { name: category.name, description: category.description, imageUrl: category.imageUrl, isFeatured: category.isFeatured },
        after: { name: updatedCategory.name, description: updatedCategory.description, imageUrl: updatedCategory.imageUrl, isFeatured: updatedCategory.isFeatured }
      },
      status: "success"
    })

    return sendResponse(
      res,
      {
        success: true,
        message: "Category updated successfully.",
        data: updatedCategory,
      },
      200
    )
  } catch (error) {
    console.error(error)
    return sendResponse(
      res,
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      500
    )
  }
})

/* DELETE category delete. */
router.delete("/delete/:id", async function (req, res, next) {
  try {
    const { id } = req.params

    const category = await Categories.findOne({ where: { id } })
    if (!category) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Category not found.",
        },
        404
      )
    }

    // Check if there are associated products
    const productCount = await Products.count({ where: { categoryId: id } })
    if (productCount > 0) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Cannot delete category with associated products.",
        },
        200
      )
    }

    await Categories.destroy({ where: { id } })

    // Delete associated image file if it exists locally
    if (category.imageUrl && category.imageUrl.startsWith("/uploads/")) {
      const filePath = path.join(__dirname, "../public", category.imageUrl)
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting category image file:", err)
      })
    }

    const user = await Users.findByPk(req.user.userId)
    await logAudit(req, {
      action: "DELETE_CATEGORY",
      entityType: "Category",
      entityId: id,
      description: `Category "${category.name}" deleted by ${user?.email || 'Unknown'}`,
      changes: category.toJSON(),
      status: "success"
    })

    return sendResponse(
      res,
      {
        success: true,
        message: "Category deleted successfully.",
      },
      200
    )
  } catch (error) {
    console.error(error)
    return sendResponse(
      res,
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      500
    )
  }
})

/* POST category delete for compatibility if needed */
router.post("/delete/:id", async function (req, res, next) {
  try {
    const { id } = req.params

    const category = await Categories.findOne({ where: { id } })
    if (!category) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Category not found.",
        },
        404
      )
    }

    const productCount = await Products.count({ where: { categoryId: id } })
    if (productCount > 0) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Cannot delete category with associated products.",
        },
        200
      )
    }

    await Categories.destroy({ where: { id } })

    // Delete associated image file if it exists locally
    if (category.imageUrl && category.imageUrl.startsWith("/uploads/")) {
      const filePath = path.join(__dirname, "../public", category.imageUrl)
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting category image file:", err)
      })
    }

    const user = await Users.findByPk(req.user.userId)
    await logAudit(req, {
      action: "DELETE_CATEGORY",
      entityType: "Category",
      entityId: id,
      description: `Category "${category.name}" deleted by ${user?.email || 'Unknown'}`,
      changes: category.toJSON(),
      status: "success"
    })

    return sendResponse(
      res,
      {
        success: true,
        message: "Category deleted successfully.",
      },
      200
    )
  } catch (error) {
    console.error(error)
    return sendResponse(
      res,
      {
        success: false,
        message: "Internal Server Error",
        error: error.message,
      },
      500
    )
  }
})

module.exports = router
