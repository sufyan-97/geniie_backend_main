'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.addColumn(
				'users',
				'phoneNumber',
				{
					type: Sequelize.STRING,
				}
			),
			queryInterface.addColumn(
				'users',
				'verifyPhoneNumber',
				{
					type: Sequelize.BOOLEAN,
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
