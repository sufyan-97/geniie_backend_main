'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
			queryInterface.changeColumn(
				'user_services', 'businessName', {
				type: Sequelize.STRING,
				allowNull: true
			}),
		])
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
