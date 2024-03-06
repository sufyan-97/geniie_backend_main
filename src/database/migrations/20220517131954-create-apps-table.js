'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('system_apps', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      name: { type: Sequelize.STRING, allowNull: false },

      slug: { type: Sequelize.STRING, allowNull: false },

      packageName: { type: Sequelize.STRING, allowNull: false },

      image: { type: Sequelize.STRING, allowNull: false },

      fireBaseToken: { type: Sequelize.TEXT, allowNull: false },

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
