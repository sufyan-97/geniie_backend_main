'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.addColumn('waiting_list', 'clientAgent', {
				type: Sequelize.TEXT,
			}),
			queryInterface.changeColumn('waiting_list', 'showUpdates', {
				type: Sequelize.BOOLEAN,
				allowNull: true,
			}),

		]);
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
