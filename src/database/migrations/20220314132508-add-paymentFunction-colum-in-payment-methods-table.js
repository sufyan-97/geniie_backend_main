'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.addColumn(
				'payment_methods',
				'paymentFunction',
				{
					type: Sequelize.STRING,
				}
			),
			queryInterface.addColumn(
				'payment_methods',
				'instantPayment',
				{
					type: Sequelize.BOOLEAN,
					defaultValue: false
				}
			),
			queryInterface.addColumn(
				'payment_methods',
				'validParams',
				{
					type: Sequelize.TEXT,
					defaultValue: null
				}
			)
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
