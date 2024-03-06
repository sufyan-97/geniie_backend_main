'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.addColumn('user_medias', 'status', {
				type: Sequelize.ENUM,
				values: ["pending", "active", 'rejected'],
				defaultValue: "pending"
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
