'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
		return queryInterface.addColumn('user_account_balances', 'cashInHand', {
			type: Sequelize.DECIMAL(15, 2),
			defaultValue: 0
		});
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
