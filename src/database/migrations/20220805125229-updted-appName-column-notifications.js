'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.changeColumn(
				'notifications', 'appName', {
				type: Sequelize.ENUM,
				values: ['','asaap', 'asaap-restaurant', 'asaap-rider', 'super_admin'],
				defaultValue: 'asaap-restaurant',
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
