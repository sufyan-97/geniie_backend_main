'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {

		queryInterface.addColumn('users', "status", {
			type: Sequelize.ENUM,
			values: ["active", "suspended", "pending", "rejected"],
			defaultValue: "pending"
		});
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
