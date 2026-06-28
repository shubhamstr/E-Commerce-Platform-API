const Users = require("./Users")
const Addresses = require("./Addresses")
const Categories = require("./Categories")
const Products = require("./Products")
const Wishlists = require("./Wishlists")
const Carts = require("./Carts")
const Orders = require("./Orders")
const OrderItems = require("./OrderItems")
const Contacts = require("./Contacts")
const Reviews = require("./Reviews")
const Notifications = require("./Notifications")

// Users <-> Addresses
Users.hasMany(Addresses, {
  foreignKey: "userId",
  as: "addresses",
})
Addresses.belongsTo(Users, {
  foreignKey: "userId",
  as: "user",
})

// Categories <-> Products
Categories.hasMany(Products, {
  foreignKey: "categoryId",
  as: "products",
})
Products.belongsTo(Categories, {
  foreignKey: "categoryId",
  as: "category",
})

// Users <-> Wishlists
Users.hasMany(Wishlists, {
  foreignKey: "userId",
  as: "wishlistItems",
})
Wishlists.belongsTo(Users, {
  foreignKey: "userId",
  as: "user",
})

// Products <-> Wishlists
Products.hasMany(Wishlists, {
  foreignKey: "productId",
  as: "wishlistItems",
})
Wishlists.belongsTo(Products, {
  foreignKey: "productId",
  as: "product",
})

// Users <-> Carts
Users.hasMany(Carts, {
  foreignKey: "userId",
  as: "cartItems",
})
Carts.belongsTo(Users, {
  foreignKey: "userId",
  as: "user",
})

// Products <-> Carts
Products.hasMany(Carts, {
  foreignKey: "productId",
  as: "cartItems",
})
Carts.belongsTo(Products, {
  foreignKey: "productId",
  as: "product",
})

// Users <-> Orders
Users.hasMany(Orders, {
  foreignKey: "userId",
  as: "orders",
})
Orders.belongsTo(Users, {
  foreignKey: "userId",
  as: "user",
})

// Addresses <-> Orders
Addresses.hasMany(Orders, {
  foreignKey: "addressId",
  as: "orders",
})
Orders.belongsTo(Addresses, {
  foreignKey: "addressId",
  as: "address",
})

// Orders <-> OrderItems
Orders.hasMany(OrderItems, {
  foreignKey: "orderId",
  as: "items",
})
OrderItems.belongsTo(Orders, {
  foreignKey: "orderId",
  as: "order",
})

// Products <-> OrderItems
Products.hasMany(OrderItems, {
  foreignKey: "productId",
  as: "orderItems",
})
OrderItems.belongsTo(Products, {
  foreignKey: "productId",
  as: "product",
})

// Users <-> Reviews
Users.hasMany(Reviews, {
  foreignKey: "userId",
  as: "reviews",
})
Reviews.belongsTo(Users, {
  foreignKey: "userId",
  as: "user",
})

// Products <-> Reviews
Products.hasMany(Reviews, {
  foreignKey: "productId",
  as: "reviews",
})
Reviews.belongsTo(Products, {
  foreignKey: "productId",
  as: "product",
})

// Orders <-> Reviews
Orders.hasMany(Reviews, {
  foreignKey: "orderId",
  as: "reviews",
})
Reviews.belongsTo(Orders, {
  foreignKey: "orderId",
  as: "order",
})

// Users <-> Notifications
Users.hasMany(Notifications, {
  foreignKey: "userId",
  as: "notifications",
})
Notifications.belongsTo(Users, {
  foreignKey: "userId",
  as: "user",
})

module.exports = {
  Users,
  Addresses,
  Categories,
  Products,
  Wishlists,
  Carts,
  Orders,
  OrderItems,
  Contacts,
  Reviews,
  Notifications,
}


