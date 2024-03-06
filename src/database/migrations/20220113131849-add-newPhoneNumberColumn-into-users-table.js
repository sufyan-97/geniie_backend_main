'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return Promise.all([
			// queryInterface.addColumn(
			// 	'users',
			// 	'newPhoneNumber',
			// 	{
			// 		type: Sequelize.STRING,
			// 		allowNull: true
			// 	}
			// ),
			queryInterface.addColumn(
				'users',
				'verifyNewPhoneNumber',
				{
					type: Sequelize.BOOLEAN,
					// allowNull: false,
					defaultValue: false
				}
			),
			// queryInterface.addColumn(
			// 	'users',
			// 	'newNumber',
			// 	{
			// 		type: Sequelize.BOOLEAN,
			// 		// allowNull: false,
			// 		defaultValue: false
			// 	}),
			// queryInterface.addColumn(
			// 	'users',
			// 	'newCountryCode',
			// 	{
			// 		type: Sequelize.BOOLEAN,
			// 		// allowNull: false,
			// 		defaultValue: false
			// 	})
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
