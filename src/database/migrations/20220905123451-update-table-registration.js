'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.addColumn('registrations', "rejectedFields", {
				type: Sequelize.TEXT,
				allowNull: true

			}),
			queryInterface.changeColumn('registrations', "status", {
				type: Sequelize.ENUM,
				values: ["", "pending", "waiting for approval", "approved", "active"],
				defaultValue: "pending",
				allowNull: false,

			})])
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
