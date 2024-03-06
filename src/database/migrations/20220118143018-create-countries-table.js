'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.createTable('countries', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},

			currencyId: {
				type: Sequelize.INTEGER,
				// allowNull: false
			},

			countryCode: {
				type: Sequelize.STRING,
				// unique: true,
			},
			
			countryName: {
				type: Sequelize.STRING,
				allowNull: false,
			},

			dialCode: {
				type: Sequelize.STRING,
			},

			status: {
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
