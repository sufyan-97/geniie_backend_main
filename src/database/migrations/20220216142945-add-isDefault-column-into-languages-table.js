'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.addColumn(
			'languages',
			'isDefault',
			{
				type: Sequelize.BOOLEAN,
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
