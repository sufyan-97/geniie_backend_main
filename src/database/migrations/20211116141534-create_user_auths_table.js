'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.createTable('user_auth_providers', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			userId: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			username: {
				type: Sequelize.STRING,
				allowNull: false
			},
			oAuthProvider: {
				type: Sequelize.STRING,
				allowNull: false
			},
			
			accessToken: {
				type: Sequelize.STRING,
				// allowNull: false
			},

			refreshToken: {
				type: Sequelize.STRING,
				// allowNull: false
			},

			deleteStatus: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: 0
			},
			createdAt: {
				type: 'TIMESTAMP',
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
			updatedAt: {
				type: 'TIMESTAMP',
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
			}
		})
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
