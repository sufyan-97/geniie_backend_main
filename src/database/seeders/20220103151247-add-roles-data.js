'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('roles', [
			{
				roleName: 'admin'
			},
			{
				roleName: 'user'
			},
			{
				roleName: 'guest'
			},
			{
				roleName: 'provider'
			},
			{
				roleName: 'restaurant'
			},
			{
				roleName: 'rider'
			}
		])
	},

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
	}
};
