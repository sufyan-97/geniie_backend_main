'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn(
        'system_apps', 'image', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.changeColumn(
        'system_apps', 'fireBaseToken', {
        type: Sequelize.TEXT,
        allowNull: true
      }),
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
