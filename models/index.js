
const Users = require("./Users")
const Addresses = require("./Addresses")


Users.hasMany(Addresses, {
  foreignKey: 'userId',   // foreign key in Post table
  as: 'addresses'             // alias for relation
});
Addresses.belongsTo(Users, {
  foreignKey: 'userId',
  as: 'user'
});