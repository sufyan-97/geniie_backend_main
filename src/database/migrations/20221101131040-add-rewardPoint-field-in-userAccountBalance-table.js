'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('user_account_balances', 'rewardPoints', {
			type: Sequelize.INTEGER,
			allowNull: true,
			defaultValue: 0,
		});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
