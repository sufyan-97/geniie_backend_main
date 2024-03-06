'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'filters',
        'appName',
        {
          type: Sequelize.TEXT,
          defaultValue: null,
        }
      ),
      queryInterface.addColumn(
        'sort_options',
        'appName',
        {
          type: Sequelize.TEXT,
          defaultValue: null,
        }
      ),
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
