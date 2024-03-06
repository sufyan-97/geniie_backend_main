'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.addColumn(
			'payment_methods',
			'isTopup',
			{
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false
			}
		)
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
