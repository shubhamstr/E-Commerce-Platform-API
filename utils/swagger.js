const swaggerUi = require("swagger-ui-express")

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "E-Commerce Platform API",
    version: "1.0.0",
    description: "API Documentation for the E-Commerce Platform Backend Server.",
  },
  servers: [
    {
      url: "/api",
      description: "API Base Path",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "integer" },
          userType: { type: "string", example: "user" },
          firstName: { type: "string", example: "John" },
          lastName: { type: "string", example: "Doe" },
          mobileNumber: { type: "string", example: "1234567890" },
          email: { type: "string", example: "john.doe@example.com" },
          isActive: { type: "boolean", example: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Product: {
        type: "object",
        properties: {
          id: { type: "integer" },
          categoryId: { type: "integer", nullable: true },
          createdById: { type: "integer", nullable: true },
          name: { type: "string", example: "Wireless Mouse" },
          description: { type: "string", example: "Ergonomic wireless mouse" },
          price: { type: "number", format: "float", example: 29.99 },
          stock: { type: "integer", example: 100 },
          imageUrl: { type: "string", nullable: true, example: "/uploads/image.jpg" },
          sizes: { type: "string", nullable: true, example: "M,L" },
          colors: { type: "string", nullable: true, example: "Black,Red" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Category: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string", example: "Electronics" },
          description: { type: "string", example: "Devices and gadgets" },
          imageUrl: { type: "string", nullable: true, example: "/uploads/cat.jpg" },
          isFeatured: { type: "boolean", example: false },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Address: {
        type: "object",
        properties: {
          id: { type: "integer" },
          userId: { type: "integer" },
          addressLine1: { type: "string", example: "123 Main St" },
          addressLine2: { type: "string", nullable: true, example: "Apt 4B" },
          city: { type: "string", example: "New York" },
          state: { type: "string", example: "NY" },
          postalCode: { type: "string", example: "10001" },
          country: { type: "string", example: "USA" },
          isDefault: { type: "boolean", example: false },
        },
      },
      CartItem: {
        type: "object",
        properties: {
          id: { type: "integer" },
          userId: { type: "integer" },
          productId: { type: "integer" },
          quantity: { type: "integer", example: 1 },
          product: { $ref: "#/components/schemas/Product" },
        },
      },
      Order: {
        type: "object",
        properties: {
          id: { type: "integer" },
          userId: { type: "integer", nullable: true },
          totalAmount: { type: "number", format: "float", example: 59.98 },
          status: { type: "string", example: "pending" },
          paymentStatus: { type: "string", example: "pending" },
          shippingAddress: { type: "string", example: "123 Main St, New York, NY" },
          email: { type: "string", example: "guest@example.com" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
  paths: {
    "/": {
      get: {
        tags: ["General"],
        summary: "Check server status",
        responses: {
          200: {
            description: "Server is running status",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Server is running..." },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/user/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new customer",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["firstName", "lastName", "email", "password"],
                properties: {
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string" },
                  mobileNumber: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "User registered successfully" },
          400: { description: "Validation error" },
        },
      },
    },
    "/user/register-seller": {
      post: {
        tags: ["Auth"],
        summary: "Register a new seller",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["firstName", "lastName", "email", "password"],
                properties: {
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string" },
                  mobileNumber: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Seller registered successfully" },
          400: { description: "Validation error" },
        },
      },
    },
    "/user/login": {
      post: {
        tags: ["Auth"],
        summary: "Login",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Success login",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    token: { type: "string" },
                    user: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/user/forgot-password": {
      post: {
        tags: ["Auth"],
        summary: "Initiate forgot password flow",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: { type: "string" },
                  userType: { type: "string", description: "customer or admin" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Email sent" },
        },
      },
    },
    "/user/reset-password": {
      post: {
        tags: ["Auth"],
        summary: "Reset password with token",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["token", "password"],
                properties: {
                  token: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Password reset successfully" },
        },
      },
    },
    "/user/dashboard-stats": {
      get: {
        tags: ["Users"],
        summary: "Get dashboard statistics",
        responses: {
          200: { description: "Statistics data" },
        },
      },
    },
    "/user/get": {
      get: {
        tags: ["Users"],
        summary: "Get users list (Admin only)",
        responses: {
          200: {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/User" },
                },
              },
            },
          },
        },
      },
    },
    "/user/get/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get user details by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
        },
      },
    },
    "/user/update/{id}": {
      post: {
        tags: ["Users"],
        summary: "Update user profile details",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  mobileNumber: { type: "string" },
                  email: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Updated successfully" },
        },
      },
    },
    "/user/update-password/{id}": {
      post: {
        tags: ["Users"],
        summary: "Update user password",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["oldPassword", "newPassword"],
                properties: {
                  oldPassword: { type: "string" },
                  newPassword: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Password updated successfully" },
        },
      },
    },
    "/user/exists/{id}": {
      post: {
        tags: ["Users"],
        summary: "Check user exists",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Exists check result" },
        },
      },
    },
    "/user/delete/{id}": {
      delete: {
        tags: ["Users"],
        summary: "Delete a user account",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Deleted successfully" },
        },
      },
    },
    "/user/seller-profile": {
      get: {
        tags: ["Users"],
        summary: "Get seller profile and analytics details",
        security: [],
        parameters: [
          {
            name: "sellerId",
            in: "query",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Seller profile details" },
        },
      },
    },
    "/category/get": {
      get: {
        tags: ["Categories"],
        summary: "List all categories",
        security: [],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Category" },
                },
              },
            },
          },
        },
      },
    },
    "/category/get/{id}": {
      get: {
        tags: ["Categories"],
        summary: "Get category detail",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Category" },
              },
            },
          },
        },
      },
    },
    "/category/add": {
      post: {
        tags: ["Categories"],
        summary: "Add a category",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name"],
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  imageUrl: { type: "string" },
                  isFeatured: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Category created" },
        },
      },
    },
    "/category/update/{id}": {
      post: {
        tags: ["Categories"],
        summary: "Update category details",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  imageUrl: { type: "string" },
                  isFeatured: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Updated successfully" },
        },
      },
    },
    "/category/delete/{id}": {
      delete: {
        tags: ["Categories"],
        summary: "Delete category",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Deleted successfully" },
        },
      },
    },
    "/category/upload": {
      post: {
        tags: ["Categories"],
        summary: "Upload category image file",
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  image: {
                    type: "string",
                    format: "binary",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "File uploaded successfully" },
        },
      },
    },
    "/product/get": {
      get: {
        tags: ["Products"],
        summary: "List and filter products",
        security: [],
        parameters: [
          { name: "categoryId", in: "query", schema: { type: "integer" } },
          { name: "createdById", in: "query", schema: { type: "integer" } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "sort", in: "query", schema: { type: "string" }, description: "latest, popular, most_purchased, most_rated" },
          { name: "limit", in: "query", schema: { type: "integer" } },
          { name: "cursor", in: "query", schema: { type: "integer" }, description: "For infinite scroll / cursor pagination" },
        ],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    products: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Product" },
                    },
                    nextCursor: { type: "integer", nullable: true },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/product/get/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get product details",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" },
              },
            },
          },
        },
      },
    },
    "/product/add": {
      post: {
        tags: ["Products"],
        summary: "Add a new product",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "price", "stock"],
                properties: {
                  categoryId: { type: "integer" },
                  name: { type: "string" },
                  description: { type: "string" },
                  price: { type: "number" },
                  stock: { type: "integer" },
                  imageUrl: { type: "string" },
                  sizes: { type: "string" },
                  colors: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Product added successfully" },
        },
      },
    },
    "/product/update/{id}": {
      post: {
        tags: ["Products"],
        summary: "Update existing product details",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  categoryId: { type: "integer" },
                  name: { type: "string" },
                  description: { type: "string" },
                  price: { type: "number" },
                  stock: { type: "integer" },
                  imageUrl: { type: "string" },
                  sizes: { type: "string" },
                  colors: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Updated successfully" },
        },
      },
    },
    "/product/delete/{id}": {
      delete: {
        tags: ["Products"],
        summary: "Delete product",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Deleted successfully" },
        },
      },
      post: {
        tags: ["Products"],
        summary: "Delete product alternative (POST method)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Deleted successfully" },
        },
      },
    },
    "/product/bulk-import": {
      post: {
        tags: ["Products"],
        summary: "Bulk import products",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["products"],
                properties: {
                  products: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["name", "price", "stock", "categoryName"],
                      properties: {
                        name: { type: "string" },
                        description: { type: "string" },
                        price: { type: "number" },
                        stock: { type: "integer" },
                        imageUrl: { type: "string" },
                        categoryName: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Import completed" },
        },
      },
    },
    "/product/upload": {
      post: {
        tags: ["Products"],
        summary: "Upload product image file",
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  image: {
                    type: "string",
                    format: "binary",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "File uploaded successfully" },
        },
      },
    },
    "/address": {
      get: {
        tags: ["Addresses"],
        summary: "Get address list of current user",
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Address" },
                },
              },
            },
          },
        },
      },
    },
    "/address/get/{id}": {
      get: {
        tags: ["Addresses"],
        summary: "Get specific address details by ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Address" },
              },
            },
          },
        },
      },
    },
    "/address/add": {
      post: {
        tags: ["Addresses"],
        summary: "Add a new shipping address",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["addressLine1", "city", "state", "postalCode", "country"],
                properties: {
                  addressLine1: { type: "string" },
                  addressLine2: { type: "string" },
                  city: { type: "string" },
                  state: { type: "string" },
                  postalCode: { type: "string" },
                  country: { type: "string" },
                  isDefault: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Address added successfully" },
        },
      },
    },
    "/address/update/{id}": {
      post: {
        tags: ["Addresses"],
        summary: "Update existing shipping address details",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  addressLine1: { type: "string" },
                  addressLine2: { type: "string" },
                  city: { type: "string" },
                  state: { type: "string" },
                  postalCode: { type: "string" },
                  country: { type: "string" },
                  isDefault: { type: "boolean" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Address updated successfully" },
        },
      },
    },
    "/address/delete/{id}": {
      post: {
        tags: ["Addresses"],
        summary: "Delete shipping address",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Address deleted successfully" },
        },
      },
    },
    "/address/get/user/{id}": {
      get: {
        tags: ["Addresses"],
        summary: "Get all addresses for a specific user ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Address" },
                },
              },
            },
          },
        },
      },
    },
    "/address/update/default/{id}/{userId}": {
      post: {
        tags: ["Addresses"],
        summary: "Set a specific address as default for a user",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Default status updated" },
        },
      },
    },
    "/cart": {
      get: {
        tags: ["Carts"],
        summary: "Get current user's cart content",
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/CartItem" },
                },
              },
            },
          },
        },
      },
    },
    "/cart/add": {
      post: {
        tags: ["Carts"],
        summary: "Add product item to cart",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["productId", "quantity"],
                properties: {
                  productId: { type: "integer" },
                  quantity: { type: "integer", example: 1 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Added to cart" },
        },
      },
    },
    "/cart/update": {
      put: {
        tags: ["Carts"],
        summary: "Update quantity of a cart product item",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["productId", "quantity"],
                properties: {
                  productId: { type: "integer" },
                  quantity: { type: "integer" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Cart updated" },
        },
      },
    },
    "/cart/remove/{productId}": {
      delete: {
        tags: ["Carts"],
        summary: "Remove product from cart",
        parameters: [
          {
            name: "productId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Removed from cart" },
        },
      },
    },
    "/cart/clear": {
      delete: {
        tags: ["Carts"],
        summary: "Empty the entire cart",
        responses: {
          200: { description: "Cart cleared" },
        },
      },
    },
    "/order/checkout": {
      post: {
        tags: ["Orders"],
        summary: "Place a new order (checkout)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["shippingAddress", "totalAmount"],
                properties: {
                  shippingAddress: { type: "string" },
                  totalAmount: { type: "number" },
                  email: { type: "string", description: "Required for guest checkout" },
                  items: {
                    type: "array",
                    items: {
                      type: "object",
                      required: ["productId", "quantity", "price"],
                      properties: {
                        productId: { type: "integer" },
                        quantity: { type: "integer" },
                        price: { type: "number" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Order created successfully" },
        },
      },
    },
    "/order/my": {
      get: {
        tags: ["Orders"],
        summary: "Get current customer's order history",
        parameters: [
          { name: "cursor", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
        ],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    orders: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Order" },
                    },
                    nextCursor: { type: "integer", nullable: true },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/order": {
      get: {
        tags: ["Orders"],
        summary: "Get all orders list (Admin/Seller)",
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Order" },
                },
              },
            },
          },
        },
      },
    },
    "/order/{id}/status": {
      put: {
        tags: ["Orders"],
        summary: "Update order status",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: { type: "string", example: "shipped" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Status updated successfully" },
        },
      },
    },
    "/order/{id}/cancel": {
      put: {
        tags: ["Orders"],
        summary: "Cancel an order",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Order cancelled successfully" },
        },
      },
    },
    "/order/track": {
      get: {
        tags: ["Orders"],
        summary: "Track guest order details",
        security: [],
        parameters: [
          { name: "orderId", in: "query", required: true, schema: { type: "string" } },
          { name: "email", in: "query", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Order track details" },
        },
      },
    },
    "/wishlist": {
      get: {
        tags: ["Wishlists"],
        summary: "Get current user's wishlist items",
        responses: {
          200: { description: "Wishlist retrieved successfully" },
        },
      },
    },
    "/wishlist/add": {
      post: {
        tags: ["Wishlists"],
        summary: "Add item to wishlist",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["productId"],
                properties: {
                  productId: { type: "integer" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Added to wishlist" },
        },
      },
    },
    "/wishlist/toggle": {
      post: {
        tags: ["Wishlists"],
        summary: "Toggle product item in wishlist",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["productId"],
                properties: {
                  productId: { type: "integer" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Wishlist item toggled" },
        },
      },
    },
    "/wishlist/remove/{productId}": {
      delete: {
        tags: ["Wishlists"],
        summary: "Remove product from wishlist",
        parameters: [
          {
            name: "productId",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Removed from wishlist" },
        },
      },
    },
    "/contact/create": {
      post: {
        tags: ["Contacts"],
        summary: "Submit a new contact/query form",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "subject", "message"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  subject: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Contact query received" },
        },
      },
    },
    "/contact/get": {
      get: {
        tags: ["Contacts"],
        summary: "Get contact queries list (Admin only)",
        responses: {
          200: { description: "List of contacts" },
        },
      },
    },
    "/contact/mark-read/{id}": {
      patch: {
        tags: ["Contacts"],
        summary: "Mark query as read (Admin only)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Marked read" },
        },
      },
    },
    "/contact/delete/{id}": {
      delete: {
        tags: ["Contacts"],
        summary: "Delete query (Admin only)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Deleted contact query" },
        },
      },
    },
    "/notification": {
      get: {
        tags: ["Notifications"],
        summary: "Get all notifications for current user",
        responses: {
          200: { description: "List of notifications" },
        },
      },
    },
    "/notification/{id}/read": {
      put: {
        tags: ["Notifications"],
        summary: "Mark notification as read",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Marked read" },
        },
      },
    },
    "/notification/read-all": {
      put: {
        tags: ["Notifications"],
        summary: "Mark all notifications as read",
        responses: {
          200: { description: "All notifications marked read" },
        },
      },
    },
    "/email-log": {
      get: {
        tags: ["Email Logs"],
        summary: "Get email logs (Admin only)",
        responses: {
          200: { description: "Email logs retrieved" },
        },
      },
    },
    "/email-log/resend/{id}": {
      post: {
        tags: ["Email Logs"],
        summary: "Resend failed email (Admin only)",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer" },
          },
        ],
        responses: {
          200: { description: "Resend triggered" },
        },
      },
    },
  },
}

const serve = swaggerUi.serve
const setup = swaggerUi.setup(swaggerDocument)

module.exports = {
  serve,
  setup,
}
