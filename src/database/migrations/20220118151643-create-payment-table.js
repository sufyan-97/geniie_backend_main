'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.createTable('payments', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			userId: {
				type: Sequelize.INTEGER,
				allowNull: false
			},

			paymentMethod: {
				type: Sequelize.STRING,
				allowNull: false
			},

			paymentStatus: {
				type: Sequelize.ENUM,
				values: ['pending', 'rejected', 'completed'],
				allowNull: false
			},

			amount: {
				type: Sequelize.DECIMAL(15, 2),
				allowNull: false,
			},

			paymentSummery: {
				type: Sequelize.TEXT,
				allowNull: false
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
