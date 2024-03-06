'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.createTable('services', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},

			name: { type: Sequelize.STRING, allowNull: false },

			image: { type: Sequelize.TEXT, allowNull: false },

			slug: { type: Sequelize.TEXT, allowNull: false },

			isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: 1 },

			isFeatured: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: 0 },

			deleteStatus: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: 0 },

			createdAt: {
				type: 'TIMESTAMP',
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},

			updatedAt: {
				type: 'TIMESTAMP',
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
			},
		})
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
