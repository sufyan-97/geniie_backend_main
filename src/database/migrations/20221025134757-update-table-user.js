'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('users', "geniieCommission", {
        type: Sequelize.INTEGER,
        defaultValue: 10,
        allowNull: false,
      }),
      queryInterface.addColumn('users', "suspendedBy", {
        type: Sequelize.ENUM,
        values: ["", "system", "super_admin", "provider"],
        defaultValue: "",
      }),
      queryInterface.addColumn('users', "suspendSlug", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('users', "suspendReason", {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ])
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
