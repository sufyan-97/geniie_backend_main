'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('registrations', 'status', {
      type: Sequelize.ENUM,
      values: ["", "pending", "waiting for approval", "approved", "active", 'rejected'],
      defaultValue: "pending",
      allowNull: false,
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
