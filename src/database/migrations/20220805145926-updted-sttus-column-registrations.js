'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.changeColumn(
				'registrations', 'status', {
				type: Sequelize.ENUM,
				values: ['','waiting for approval','approved','rejected'],
				defaultValue: 'waiting for approval',
				allowNull: false
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
