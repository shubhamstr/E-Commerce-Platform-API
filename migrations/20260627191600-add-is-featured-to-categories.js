'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('categories');
    if (!tableInfo.isFeatured) {
      await queryInterface.addColumn('categories', 'isFeatured', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('categories');
    if (tableInfo.isFeatured) {
      await queryInterface.removeColumn('categories', 'isFeatured');
    }
  }
};
