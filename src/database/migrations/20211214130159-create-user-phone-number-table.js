'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.createTable('otp_phone_number', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},

			userId: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},

			phoneNumber: {
				type: Sequelize.STRING,
				allowNull: false
			},

			verifyPhoneNumber: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: 0
			},

			otpCode: {
				type: Sequelize.TEXT,
				allowNull: false,
			},

			attempts: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 1
			},

			duration: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 1
			},
			
			lastAttempt: {
				type: 'TIMESTAMP',
				// defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},

			ipAddress: {
				type: Sequelize.TEXT,
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

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
	}
};
