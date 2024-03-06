'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.addColumn(
			'payment_methods',
			'isService',
			{
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: true
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
