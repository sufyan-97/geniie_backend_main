'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('states', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      countryId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      countryCode: {
        type: Sequelize.STRING,
        allowNull: false
      },

      stateCode: {
        type: Sequelize.STRING,
        allowNull: false
      },

      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0
      },

      longitude: {
        type: Sequelize.DECIMAL(10, 6),
        allowNull: false
      },

      latitude: {
        type: Sequelize.DECIMAL(10, 6),
        allowNull: false
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
