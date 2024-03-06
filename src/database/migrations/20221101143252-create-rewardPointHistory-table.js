'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		return queryInterface.createTable('reward_point_history', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},

			userId: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},

			relevantId: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},

			type: {
				type: Sequelize.STRING,
				allowNull: false,
			},

			points: {
				type: Sequelize.INTEGER,
				allowNull: false,
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

	async down(queryInterface, Sequelize) {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
	}
};
