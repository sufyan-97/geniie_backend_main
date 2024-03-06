'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.changeColumn(
				'user_auth_providers', 'accessToken', {
				type: Sequelize.TEXT,
				allowNull: false
			}),
			queryInterface.changeColumn(
				'user_auth_providers', 'refreshToken', {
				type: Sequelize.TEXT,
				allowNull: false
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
