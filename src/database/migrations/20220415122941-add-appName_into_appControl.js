'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'app_controls',
      'appName',
      {
        type: Sequelize.ENUM,
        values: ['restaurant', 'rider', 'user'],
        defaultValue: 'user',
        allowNull: false
      }
    )
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
