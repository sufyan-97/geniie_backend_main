'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.createTable('currencies', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			currencyType: {
				type: Sequelize.ENUM,
				values: ['forex', 'crypto'],
				allowNull: false,
				defaultValue: 'forex'
			},
			status: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
				allowNull: false
			},
			currencyName: {
				type: Sequelize.STRING,
				allowNull: false
			},
			currencyCode: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
				charset: 'utf8',
				collate: 'utf8_unicode_ci',
			},
			currencySymbol: {
				type: Sequelize.STRING,
				// dialactOptions: {
				// 	charset: 'utf8',
				// 	collate: 'utf8_unicode_ci',
				// },
				charset: 'utf8',
				collate: 'utf8_unicode_ci',
			},
			currencyUnicode: {
				type: Sequelize.STRING,
			},
			currencyHexcode: {
				type: Sequelize.STRING,
			},
			currencyHtmlSymbol: {
				type: Sequelize.STRING,
			},
			createdAt: {
				type: 'TIMESTAMP',
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
			createdAt: {
				type: 'TIMESTAMP',
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
			}
		},)
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
