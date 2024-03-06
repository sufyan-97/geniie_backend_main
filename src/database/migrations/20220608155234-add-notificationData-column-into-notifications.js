'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    queryInterface.addColumn(
      "notifications",
      'notificationData',
      {
        type: Sequelize.TEXT
      }
    )
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
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
