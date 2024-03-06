'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		return queryInterface.createTable('module_types', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},

			type: {
				type: Sequelize.STRING,
				allowNull: false
			},

			deleteStatus: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: 0
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
