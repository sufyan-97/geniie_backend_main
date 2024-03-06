'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.removeColumn(
			'users',
			'gender');
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
