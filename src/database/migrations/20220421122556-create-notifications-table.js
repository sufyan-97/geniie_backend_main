'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('notifications', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      subject: { type: Sequelize.STRING, allowNull: false },

      description: { type: Sequelize.STRING, allowNull: false },

      appName: {
        type: Sequelize.ENUM,
        values: ['restaurant', 'rider', 'user'],
        defaultValue: 'restaurant',
        allowNull: false
      },

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
