'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('user_services', "rejectedFields", {
			type: Sequelize.TEXT,
      allowNull: true

		});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
