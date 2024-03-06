'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('devices', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      userId: { type: Sequelize.INTEGER, allowNull: true },

      systemAppId: { type: Sequelize.INTEGER, allowNull: true },

      uuid: { type: Sequelize.STRING, allowNull: false },

      serial: { type: Sequelize.STRING },

      mac: { type: Sequelize.STRING },

      fireBaseDeviceToken: { type: Sequelize.TEXT, allowNull: false },

      deleteStatus: { type: Sequelize.BOOLEAN, defaultValue: 0 },

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
