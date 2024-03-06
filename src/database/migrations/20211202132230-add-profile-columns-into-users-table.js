'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.addColumn(
				'users',
				'profileImage',
				{
					type: Sequelize.STRING,
				}
			),
			queryInterface.addColumn(
				'users',
				'profileImageByte',
				{
					type: Sequelize.INTEGER,
				}
			),
			queryInterface.addColumn(
				'users',
				'profileImageSize',
				{
					type: Sequelize.STRING,
				}
			),
			queryInterface.addColumn(
				'users',
				'fullName',
				{
					type: Sequelize.STRING
				}
			),
			queryInterface.addColumn(
				'users',
				'dob',
				{
					type: 'date',
				}
			),
			queryInterface.addColumn(
				'users',
				'gender',
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
