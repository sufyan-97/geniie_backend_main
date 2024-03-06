'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // return queryInterface.addColumn(
    //   'banners',
    //   'appName',
    //   {
    //     type: Sequelize.ENUM,
    //     values: ['restaurant', 'restaurant_app', 'rider', 'user'],
    //     defaultValue: 'user',
    //     allowNull: false
    //   }
    // )
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
