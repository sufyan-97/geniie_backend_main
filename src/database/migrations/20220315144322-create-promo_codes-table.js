'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('promo_codes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false
      },

      discount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      promoCode: {
        type: Sequelize.STRING,
        allowNull: false
      },

      type: {
        type: Sequelize.ENUM,
        values: ['flat', 'percentage'],
        defaultValue: 'flat',
        allowNull: false
      },

      maxUseLimit: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      userMaxUseLimit: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      minOrderLimit: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },

      maxDiscount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },

      status: {
        type: Sequelize.ENUM,
        values: ['active', 'expired', 'suspended'],
        defaultValue: 'active',
        allowNull: false
      },

      expiryDate: {
        type: 'TIMESTAMP'
      },

      allowedRegion: {
        type: Sequelize.TEXT
      },

      deleteStatus: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
      },

      createdAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updatedAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
