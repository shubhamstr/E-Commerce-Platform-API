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

const sequelize = require("../utils/db")

/* GET products listing. */
router.get("/get", async function (req, res, next) {
  try {
    let { page = 1, limit = 10, sortField, sortOrder, filters } = req.query
    page = parseInt(page)
    limit = parseInt(limit)
    const offset = (page - 1) * limit

    let where = {}
    if (req.user && req.user.userType === "seller") {
      where.createdById = req.user.userId
    }
    if (filters) {
      const parsed = JSON.parse(filters)
      for (const field in parsed) {
        const value = parsed[field]?.value
        if (value !== undefined && value !== null) {
          if (field === "categoryId" || field === "createdById") {
            where[field] = value
          } else if (field === "price") {
            if (Array.isArray(value)) {
              where[field] = {
                [Op.between]: [value[0], value[1]],
              }
            } else if (typeof value === "object") {
              where[field] = {
                [Op.between]: [value.min || 0, value.max || 999999],
              }
            } else {
              where[field] = value
            }
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
      } else if (sortField === "popular" || sortField === "most_purchased") {
        order.push([sequelize.literal('orderedCount'), sortOrder == -1 ? "DESC" : "ASC"])
      } else if (sortField === "rated" || sortField === "rating" || sortField === "most_rated") {
        order.push([sequelize.literal('avgRating'), sortOrder == -1 ? "DESC" : "ASC"])
      } else {
        order.push([sortField, sortOrder == -1 ? "DESC" : "ASC"])
      }
    } else {
      order.push(["createdAt", "DESC"])
    }

    const count = await Products.count({ where })
    const records = await Products.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COALESCE(SUM(quantity), 0)
              FROM order_items AS orderItems
              WHERE orderItems.productId = products.id
            )`),
            'orderedCount'
          ],
          [
            sequelize.literal(`(
              SELECT COALESCE(AVG(rating), 0)
              FROM reviews AS reviews
              WHERE reviews.productId = products.id
            )`),
            'avgRating'
          ],
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM reviews AS reviews
              WHERE reviews.productId = products.id
            )`),
            'reviewCount'
          ]
        ]
      },
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
        {
          model: Users,
          as: "creator",
          attributes: ["id", "firstName", "lastName", "email", "mobileNumber", "userType"]
        }
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
    let where = { id }
    if (req.user && req.user.userType === "seller") {
      where.createdById = req.user.userId
    }
    const product = await Products.findOne({
      where,
      include: [
        {
          model: Categories,
          as: "category",
          attributes: ["id", "name"],
        },
        {
          model: Users,
          as: "creator",
          attributes: ["id", "firstName", "lastName", "email", "mobileNumber", "userType"]
        }
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
      createdById: req.user.userId,
    })

    await logAudit(req, {
      action: "CREATE_PRODUCT",
      entityType: "Product",
      entityId: product.id,
      description: `Product "${product.name}" created by ${user.email}`,
      changes: product.toJSON(),
      status: "success"
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

    if (user.userType === "seller" && product.createdById !== user.id) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Unauthorized, permission denied.",
        },
        403
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

    await logAudit(req, {
      action: "UPDATE_PRODUCT",
      entityType: "Product",
      entityId: id,
      description: `Product "${updatedProduct.name}" updated by ${user.email}`,
      changes: {
        before: { name: product.name, description: product.description, price: product.price, stock: product.stock, categoryId: product.categoryId, sizes: product.sizes, colors: product.colors, imageUrl: product.imageUrl },
        after: { name: updatedProduct.name, description: updatedProduct.description, price: updatedProduct.price, stock: updatedProduct.stock, categoryId: updatedProduct.categoryId, sizes: updatedProduct.sizes, colors: updatedProduct.colors, imageUrl: updatedProduct.imageUrl }
      },
      status: "success"
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

    if (user.userType === "seller" && product.createdById !== user.id) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Unauthorized, permission denied.",
        },
        403
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

    await logAudit(req, {
      action: "DELETE_PRODUCT",
      entityType: "Product",
      entityId: id,
      description: `Product "${product.name}" deleted by ${user.email}`,
      changes: product.toJSON(),
      status: "success"
    })

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

    if (user.userType === "seller" && product.createdById !== user.id) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Unauthorized, permission denied.",
        },
        403
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

    await logAudit(req, {
      action: "DELETE_PRODUCT",
      entityType: "Product",
      entityId: id,
      description: `Product "${product.name}" deleted by ${user.email}`,
      changes: product.toJSON(),
      status: "success"
    })

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


/* POST bulk import products. */
router.post("/bulk-import", async function (req, res, next) {
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

    let { count } = req.body
    count = parseInt(count)
    if (isNaN(count) || count <= 0) {
      return sendResponse(
        res,
        {
          success: false,
          message: "Please provide a valid count greater than 0.",
        },
        400
      )
    }

    // Fetch products from DummyJSON
    const response = await fetch("https://dummyjson.com/products?limit=100")
    if (!response.ok) {
      throw new Error(`Failed to fetch from DummyJSON: ${response.statusText}`)
    }
    const result = await response.json()
    const dummyProducts = result.products || []
    console.log("Bulk import requested: count =", count, "Fetched dummyProducts =", dummyProducts.length)

    if (dummyProducts.length === 0) {
      return sendResponse(
        res,
        {
          success: false,
          message: "No dummy products found from DummyJSON API.",
        },
        400
      )
    }

    const defaultDummyImage = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60"
    const defaultPlaceholderPath = "/uploads/default-placeholder.png"
    const defaultPlaceholderFile = path.join(uploadDir, "default-placeholder.png")
    if (!fs.existsSync(defaultPlaceholderFile)) {
      const base64Png = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
      fs.writeFileSync(defaultPlaceholderFile, Buffer.from(base64Png, "base64"))
    }
    
    // Helper function to download and save images locally
    const downloadImage = async (url) => {
      if (!url) return defaultPlaceholderPath
      try {
        const imgRes = await fetch(url)
        if (!imgRes.ok) return defaultPlaceholderPath
        const arrayBuffer = await imgRes.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const filename = `bulk-${Date.now()}-${Math.round(Math.random() * 1e9)}.png`
        const filepath = path.join(uploadDir, filename)
        fs.writeFileSync(filepath, buffer)
        return `/uploads/${filename}`
      } catch (err) {
        console.error("Failed to download image:", url, err.message)
        return defaultPlaceholderPath
      }
    }

    // Fetch all existing product names to avoid duplicates
    const existingProducts = await Products.findAll({ attributes: ["name"], raw: true })
    const existingNamesSet = new Set(existingProducts.map(p => p.name.toLowerCase().trim()))

    // Find or create categories map to avoid redundant DB calls
    const categoryCache = {}
    const productsToCreate = []
    
    for (let i = 0; i < count; i++) {
      const item = dummyProducts[i % dummyProducts.length]
      
      // Category handling
      const categoryName = item.category 
        ? item.category.charAt(0).toUpperCase() + item.category.slice(1)
        : "Uncategorized"
        
      let categoryId = categoryCache[categoryName]
      if (!categoryId) {
        // Download category image from the first product of this category
        let categoryImgUrl = defaultPlaceholderPath
        if (item.images && item.images.length > 0) {
          categoryImgUrl = await downloadImage(item.images[0])
        } else if (item.thumbnail) {
          categoryImgUrl = await downloadImage(item.thumbnail)
        } else {
          categoryImgUrl = await downloadImage(defaultDummyImage)
        }
        
        if (!categoryImgUrl) {
          categoryImgUrl = defaultPlaceholderPath
        }

        const [categoryRecord, created] = await Categories.findOrCreate({
          where: { name: categoryName },
          defaults: {
            description: `Auto-generated category for ${categoryName}`,
            imageUrl: categoryImgUrl,
            isFeatured: false
          }
        })
        
        if (!created && (!categoryRecord.imageUrl || categoryRecord.imageUrl === "")) {
          categoryRecord.imageUrl = categoryImgUrl
          await categoryRecord.save()
        }

        categoryId = categoryRecord.id
        categoryCache[categoryName] = categoryId
      }

      // Validate item presence and name
      if (!item || !item.title || typeof item.title !== "string" || item.title.trim() === "") {
        continue
      }

      // Unique title suffix if we are duplicating beyond the dummy set
      const titleSuffix = i >= dummyProducts.length ? ` #${Math.floor(i / dummyProducts.length) + 1}` : ""
      const productName = `${item.title}${titleSuffix}`

      // Check if product name already exists in database or current import batch
      const lowerName = productName.toLowerCase().trim()
      if (existingNamesSet.has(lowerName)) {
        continue
      }
      existingNamesSet.add(lowerName)

      // Check if item has images
      let rawImgUrl = null
      if (item.images && item.images.length > 0) {
        rawImgUrl = item.images[0]
      } else if (item.thumbnail) {
        rawImgUrl = item.thumbnail
      }

      let imageUrl = null
      if (rawImgUrl) {
        imageUrl = await downloadImage(rawImgUrl)
      }

      if (!imageUrl) {
        imageUrl = defaultPlaceholderPath
      }

      const productDescription = item.description || "No description provided."
      const productPrice = typeof item.price === "number" && item.price >= 0 ? item.price : 9.99
      const productStock = typeof item.stock === "number" && item.stock >= 0 ? item.stock : 50

      productsToCreate.push({
        categoryId: categoryId || null,
        createdById: user.id,
        name: productName,
        description: productDescription,
        price: productPrice,
        stock: productStock,
        imageUrl: imageUrl,
        sizes: "M,L,XL",
        colors: "Black,White"
      })
    }

    console.log("productsToCreate array length:", productsToCreate.length)
    // Bulk create products
    await Products.bulkCreate(productsToCreate)

    return sendResponse(
      res,
      {
        success: true,
        message: `Successfully imported ${count} products and configured their categories.`,
        data: {
          importedCount: count,
          categoriesCreated: Object.keys(categoryCache)
        }
      },
      201
    )
  } catch (error) {
    console.error("Bulk import failed:", error)
    return sendResponse(
      res,
      {
        success: false,
        message: "Internal Server Error during bulk import.",
        error: error.message,
      },
      500
    )
  }
})

module.exports = router
