'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.addColumn(
				'users',
				'facebookId',
				{
					type: Sequelize.STRING,
				}
			),
			queryInterface.addColumn(
				'users',
				'googleId',
				{
					type: Sequelize.STRING,
				}
			),
			queryInterface.addColumn(
				'users',
				'twitterId',
				{
					type: Sequelize.STRING,
				}
			),
			queryInterface.addColumn(
				'users',
				'githubId',
				{
					type: Sequelize.STRING,
				}
			),
			queryInterface.addColumn(
				'users',
				'appleId',
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
