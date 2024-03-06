'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'countries',
        'longitude',
        {
          type: Sequelize.DECIMAL(10, 6),
          allowNull: false
        }
      )
      ,
      queryInterface.addColumn(
        'countries',
        'latitude',
        {
          type: Sequelize.DECIMAL(10, 6),
          allowNull: false
        }
      )
    ])
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
