'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		return queryInterface.createTable('web_messages', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},

			fullName: {
				type: Sequelize.STRING,
				allowNull: false,
			},

			email: {
				type: Sequelize.STRING,
				allowNull: false,
			},

			message: {
				type: Sequelize.TEXT,
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
