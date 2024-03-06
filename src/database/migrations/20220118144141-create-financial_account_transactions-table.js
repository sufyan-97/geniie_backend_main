'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.createTable('financial_account_transactions', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},

			userId: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			
			paymentId: {
				type: Sequelize.INTEGER,
			},

			orderId: {
				type: Sequelize.INTEGER,
			},

			businessId: {
				type: Sequelize.INTEGER,
			},

			invoiceId: {
				type: Sequelize.INTEGER,
				allowNull: false
			},

			transactionType: {
				type: Sequelize.ENUM,
				values: ['debit', 'credit'],
				allowNull: false
			},

			transactionOf: {
				type: Sequelize.ENUM,
				values: ['order', 'topUp', 'refund'],
				allowNull: false
			},

			amount: {
				type: Sequelize.DECIMAL(15, 2),
				allowNull: false,
			},


			createdAt: {
				type: 'TIMESTAMP',
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
			createdAt: {
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
