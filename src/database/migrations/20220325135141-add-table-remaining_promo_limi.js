'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('promo_codes', 'remainingLimit', {
			type: Sequelize.INTEGER,
			defaultValue: 0,
			allowNull: false
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

