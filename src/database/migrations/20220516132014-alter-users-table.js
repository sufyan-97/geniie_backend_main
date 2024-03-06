'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn("users", "firstName", {
      type: Sequelize.STRING,
    });
    queryInterface.addColumn("users", "lastName", {
      type: Sequelize.STRING
    });
    queryInterface.addColumn("users","isOnline", {
      type: Sequelize.BOOLEAN, defaultValue: false
    });
    queryInterface.addColumn("users","parentId",{
      type: Sequelize.INTEGER
    });
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
