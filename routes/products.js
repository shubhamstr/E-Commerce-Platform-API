/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
var express = require("express")
var router = express.Router()
const { Op } = require("sequelize")
const { Categories, Products, Users } = require("../models/index")
const sendResponse = require("../utils/response")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

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

/* POST upload product image. */
router.post("/upload", upload.single("image"), async function (req, res, next) {
  try {
    const user = await Users.findByPk(req.user.userId)
    if (!user || (user.userType !== "admin" && user.userType !== "seller")) {
      if (req.file) {
        fs.unlinkSync(req.file.path)
      }
      return sendResponse(
        res,
        {
          success: false,
          message: "Unauthorized, permission denied.",
        },
        403
      )
    }
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

/* GET products listing. */
router.get("/get", async function (req, res, next) {
  try {
    let { page = 1, limit = 10, sortField, sortOrder, filters } = req.query
    page = parseInt(page)
    limit = parseInt(limit)
    const offset = (page - 1) * limit

    let where = {}
    if (filters) {
      const parsed = JSON.parse(filters)
      for (const field in parsed) {
        const value = parsed[field]?.value
        if (value !== undefined && value !== null) {
          if (field === "categoryId") {
            where[field] = value
          } else {
            where[field] = {
              [Op.like]: `%${value}%`,
            }
          }
        }
      }
    }

    let order = []
    if (sortField) {
      if (sortField === "category.name") {
        order.push([{ model: Categories, as: "category" }, "name", sortOrder == -1 ? "DESC" : "ASC"])
      } else {
        order.push([sortField, sortOrder == -1 ? "DESC" : "ASC"])
      }
    } else {
      order.push(["createdAt", "DESC"])
    }

    const count = await Products.count({ where })
    const records = await Products.findAll({
      where,
      limit,
      offset,
      order,
      include: [
        {
          model: Categories,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    })

    return sendResponse(
      res,
      {
        success: true,
        message: "Products fetched successfully.",
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

/* GET product single. */
router.get("/get/:id", async function (req, res, next) {
  try {
    const { id } = req.params
    const product = await Products.findOne({
      where: { id },
      include: [
        {
          model: Categories,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    })
    if (product) {
      return sendResponse(
        res,
        {
          success: true,
          message: "Product fetched successfully.",
          data: product,
        },
        200
      )
    }
    return sendResponse(
      res,
      {
        success: false,
        message: "No product found",
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

/* POST product add. */
router.post("/add", async function (req, res, next) {
  try {
    const user = await Users.findByPk(req.user.userId)
    if (!user || (user.userType !== "admin" && user.userType !== "seller")) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Unauthorized, permission denied.",
        },
        403
      )
    }
    const { name, description, price, stock, imageUrl, categoryId, sizes, colors } = req.body

    if (!name) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Product name is required.",
        },
        200
      )
    }
    if (price === undefined || price === null || isNaN(Number(price))) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Valid price is required.",
        },
        200
      )
    }
    if (stock === undefined || stock === null || isNaN(Number(stock))) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Valid stock quantity is required.",
        },
        200
      )
    }

    if (categoryId) {
      const categoryExists = await Categories.findOne({ where: { id: categoryId } })
      if (!categoryExists) {
        return sendResponse(
          res,
          {
            success: false,
            message: "Specified category does not exist.",
          },
          200
        )
      }
    }

    const product = await Products.create({
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      imageUrl,
      categoryId: categoryId || null,
      sizes: sizes || null,
      colors: colors || null,
    })

    return sendResponse(
      res,
      {
        success: true,
        message: "Product created successfully.",
        data: product,
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

/* POST product update. */
router.post("/update/:id", async function (req, res, next) {
  try {
    const user = await Users.findByPk(req.user.userId)
    if (!user || (user.userType !== "admin" && user.userType !== "seller")) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Unauthorized, permission denied.",
        },
        403
      )
    }
    const { id } = req.params
    const { name, description, price, stock, imageUrl, categoryId, sizes, colors } = req.body

    const product = await Products.findOne({ where: { id } })
    if (!product) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Product not found.",
        },
        404
      )
    }

    if (name === "") {
      return sendResponse(
        res,
        {
          success: false,
          message: "Product name cannot be empty.",
        },
        200
      )
    }

    if (price !== undefined && (price === null || isNaN(Number(price)))) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Valid price is required.",
        },
        200
      )
    }

    if (stock !== undefined && (stock === null || isNaN(Number(stock)))) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Valid stock quantity is required.",
        },
        200
      )
    }

    if (categoryId) {
      const categoryExists = await Categories.findOne({ where: { id: categoryId } })
      if (!categoryExists) {
        return sendResponse(
          res,
          {
            success: false,
            message: "Specified category does not exist.",
          },
          200
        )
      }
    }

    await Products.update(
      {
        name: name !== undefined ? name : product.name,
        description: description !== undefined ? description : product.description,
        price: price !== undefined ? Number(price) : product.price,
        stock: stock !== undefined ? Number(stock) : product.stock,
        imageUrl: imageUrl !== undefined ? imageUrl : product.imageUrl,
        categoryId: categoryId !== undefined ? (categoryId || null) : product.categoryId,
        sizes: sizes !== undefined ? sizes : product.sizes,
        colors: colors !== undefined ? colors : product.colors,
      },
      { where: { id } }
    )

    const updatedProduct = await Products.findOne({
      where: { id },
      include: [
        {
          model: Categories,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    })

    return sendResponse(
      res,
      {
        success: true,
        message: "Product updated successfully.",
        data: updatedProduct,
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

/* DELETE product delete. */
router.delete("/delete/:id", async function (req, res, next) {
  try {
    const user = await Users.findByPk(req.user.userId)
    if (!user || (user.userType !== "admin" && user.userType !== "seller")) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Unauthorized, permission denied.",
        },
        403
      )
    }
    const { id } = req.params

    const product = await Products.findOne({ where: { id } })
    if (!product) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Product not found.",
        },
        404
      )
    }

    await Products.destroy({ where: { id } })

    // Delete associated image file if it exists locally
    if (product.imageUrl && product.imageUrl.startsWith("/uploads/")) {
      const filePath = path.join(__dirname, "../public", product.imageUrl)
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting product image file:", err)
      })
    }

    return sendResponse(
      res,
      {
        success: true,
        message: "Product deleted successfully.",
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

/* POST product delete for compatibility. */
router.post("/delete/:id", async function (req, res, next) {
  try {
    const user = await Users.findByPk(req.user.userId)
    if (!user || (user.userType !== "admin" && user.userType !== "seller")) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Unauthorized, permission denied.",
        },
        403
      )
    }
    const { id } = req.params

    const product = await Products.findOne({ where: { id } })
    if (!product) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Product not found.",
        },
        404
      )
    }

    await Products.destroy({ where: { id } })

    // Delete associated image file if it exists locally
    if (product.imageUrl && product.imageUrl.startsWith("/uploads/")) {
      const filePath = path.join(__dirname, "../public", product.imageUrl)
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting product image file:", err)
      })
    }

    return sendResponse(
      res,
      {
        success: true,
        message: "Product deleted successfully.",
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
