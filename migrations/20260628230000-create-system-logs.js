'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('system_logs', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      level: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'info'
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      source: {
        type: Sequelize.STRING,
        allowNull: true
      },
      meta: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('system_logs');
  }
};
