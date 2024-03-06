'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        'user_addresses',
        'address',
        {
          type: Sequelize.TEXT,
          allowNull: false
        }
      ),
      queryInterface.addColumn(
        'user_addresses',
        'addressHeading',
        {
          type: Sequelize.STRING,
        }
      ),
      queryInterface.addColumn(
        'user_addresses',
        'floor',
        {
          type: Sequelize.STRING,
        }
      ),
      queryInterface.addColumn(
        'user_addresses',
        'optional',
        {
          type: Sequelize.TEXT,
        }
      )
    ]);
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
