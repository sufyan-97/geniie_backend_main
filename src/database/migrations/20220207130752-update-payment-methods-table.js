'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.addColumn(
				'payment_methods',
				'image',
				{
					type: Sequelize.TEXT,
					allowNull: false
				}
			),

			queryInterface.addColumn(
				'payment_methods',
				'slug',
				{
					type: Sequelize.TEXT,
					allowNull: false
				}
			),

			queryInterface.addColumn(
				'payment_methods',
				'isActive',
				{
					type: Sequelize.BOOLEAN,
					allowNull: false,
					defaultValue: 1
				}
			),

			queryInterface.addColumn(
				'payment_methods',
				'deleteStatus',
				{
					type: Sequelize.BOOLEAN,
					allowNull: false,
					defaultValue: 0
				}
			),


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
