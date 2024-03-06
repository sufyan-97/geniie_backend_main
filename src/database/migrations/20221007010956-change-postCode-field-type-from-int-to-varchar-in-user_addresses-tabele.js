'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('user_addresses', 'postCode', {
			type: Sequelize.STRING
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
