'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_addresses', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      address: {
        type: Sequelize.STRING,
        allowNull: false
      },

      longitude: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },

      latitude: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      activeAddress: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0
      },

      deleteStatus: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0
      },

      createdAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      }
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
