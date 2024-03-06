'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('subscribers', 'deleteStatus', {
			type: Sequelize.BOOLEAN,
			allowNull: false,
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
