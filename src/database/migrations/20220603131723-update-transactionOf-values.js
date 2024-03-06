'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.changeColumn(
				'financial_account_transactions', 'transactionOf', {
				type: Sequelize.ENUM,
				values: ['', 'order', 'topUp', 'refund', 'booking'],
				defaultValue: '',
				allowNull: false
			})
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
