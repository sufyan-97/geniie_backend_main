'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.createTable('promotions', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},

			title: {
				type: Sequelize.STRING,
				allowNull: false,
			},

			coverImage: {
				type: Sequelize.TEXT,
				allowNull: false
			},

			heading: {
				type: Sequelize.STRING,
				allowNull: false
			},

			serviceId: {
				type: Sequelize.INTEGER,
				allowNull: false
			},

			discountType: {
				type: Sequelize.ENUM,
				values: ['flat', 'percentage'],
				defaultValue: 'flat'
			},

			discountValue: {
				type: Sequelize.INTEGER,
				allowNull: false
			},

			startDate: {
				type: Sequelize.DATE,
				allowNull: false
			},

			endDate: {
				type: Sequelize.DATE,
				allowNull: false
			},

			status: {
				type: Sequelize.ENUM,
				values: ['active', 'inactive'],
				defaultValue: 'inactive'
			},

			area: {
				type: Sequelize.ENUM,
				values: ['all', 'specific'],
				defaultValue: 'all'
			},

			allowedRegion: {
				type: Sequelize.TEXT,
				defaultValue: null
			},

			deleteStatus: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false
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

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
	}
};
