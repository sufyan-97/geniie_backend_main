'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.createTable('user_account_balances', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},

			userId: {
				type: Sequelize.INTEGER,
				allowNull: false
			},

			countryId: {
				type: Sequelize.INTEGER,
				// allowNull: false
			},

			currencyId: {
				type: Sequelize.INTEGER,
				// allowNull: false
			},

			balance: {
				type: Sequelize.DECIMAL(15, 2),
				defaultValue: 0,
				allowNull: false
			},
			
			
			deleteStatus: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false
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
