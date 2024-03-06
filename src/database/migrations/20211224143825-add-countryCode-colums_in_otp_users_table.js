'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.addColumn(
				'otp_phone_number',
				'countryCode',
				{
					type: Sequelize.STRING,
				}
			),
			queryInterface.addColumn(
				'otp_phone_number',
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
