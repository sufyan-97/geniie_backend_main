'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'user_addresses',
        'addressLabelId',
        {
          type: Sequelize.INTEGER,
        }
      ),
      queryInterface.addColumn(
        'user_addresses',
        'addressLabelName',
        {
          type: Sequelize.STRING,
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
