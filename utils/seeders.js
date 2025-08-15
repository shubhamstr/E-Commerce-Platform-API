const { Users } = require("../models/index")
const bcrypt = require("bcryptjs")

const createDefaultAdmin = async () => {
  try {
    const obj = {
      userType: "admin",
      firstName: "Shubham",
      lastName: "Sutar",
      email: "admin@ecom.com",
      password: "Admin@123",
    }

    // Check if user exists
    const existingUser = await Users.findOne({ where: { userType: "admin" } })
    if (existingUser) {
      console.log("createDefaultAdmin: Admin user already exists")
      return false
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(obj.password, 10)

    const userResp = await Users.create({
      userType: obj.userType,
      firstName: obj.firstName,
      lastName: obj.lastName,
      email: obj.email,
      password: hashedPassword,
    })
    console.log("createDefaultAdmin: Admin created:", userResp.toJSON())
  } catch (error) {
    console.error("createDefaultAdmin: ", error)
  }
}

module.exports = {
  createDefaultAdmin,
}
