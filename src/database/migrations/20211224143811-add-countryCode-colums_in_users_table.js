'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.addColumn(
				'users',
				'countryCode',
				{
					type: Sequelize.STRING,
				}
			),
			queryInterface.addColumn(
				'users',
				'number',
				{
					type: Sequelize.STRING,
				}
			)
		]);
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
