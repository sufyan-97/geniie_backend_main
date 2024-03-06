'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		return queryInterface.addColumn('users', 'stripeAccountId', {
			type: Sequelize.TEXT
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
