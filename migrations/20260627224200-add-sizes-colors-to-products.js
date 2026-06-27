'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('products');
    if (!tableInfo.sizes) {
      await queryInterface.addColumn('products', 'sizes', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    if (!tableInfo.colors) {
      await queryInterface.addColumn('products', 'colors', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('products');
    if (tableInfo.sizes) {
      await queryInterface.removeColumn('products', 'sizes');
    }
    if (tableInfo.colors) {
      await queryInterface.removeColumn('products', 'colors');
    }
  }
};
