'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.changeColumn('registrations', 'status', {
				type: Sequelize.ENUM,
				values: ["pending", "waiting for approval", "approved", "active", 'rejected'],
				defaultValue: "pending",
				allowNull: false,
			}),
			queryInterface.addColumn('registrations','isProfileUpdated', {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
			})
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
