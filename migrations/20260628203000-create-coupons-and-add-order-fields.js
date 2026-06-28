'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('coupons', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      discountType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      discountValue: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      maxDiscountAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      minOrderAmount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      usageLimit: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      usedCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      expiryDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdById: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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

    await queryInterface.addColumn('orders', 'couponCode', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('orders', 'discountAmount', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    });

    await queryInterface.addColumn('orders', 'subTotal', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('orders', 'couponCode');
    await queryInterface.removeColumn('orders', 'discountAmount');
    await queryInterface.removeColumn('orders', 'subTotal');
    await queryInterface.dropTable('coupons');
  }
};
