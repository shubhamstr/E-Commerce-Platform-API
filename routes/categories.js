/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
var express = require("express")
var router = express.Router()
const { Op } = require("sequelize")
const { Categories, Products } = require("../models/index")
const sendResponse = require("../utils/response")

/* GET categories listing. */
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
    const { name, description } = req.body

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

    const category = await Categories.create({
      name,
      description,
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
    const { id } = req.params
    const { name, description } = req.body

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

    await Categories.update(
      { name, description },
      { where: { id } }
    )

    const updatedCategory = await Categories.findOne({ where: { id } })

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
