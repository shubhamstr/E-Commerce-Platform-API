// List of paths to skip
const excludedPaths = [
  "/api/",
  "/api/user/register",
  "/api/user/login",
  "/api/category/get",
  "/api/product/get",
  "/api/user/register-seller",
  "/api/contact/create",
  "/api/order/track",
  "/api/user/forgot-password",
  "/api/user/reset-password",
  "/api/user/seller-profile",
]

module.exports = {
  excludedPaths,
}
