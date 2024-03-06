'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.changeColumn('vehicle_informations', "licenseNumber", {
				type: Sequelize.STRING,
				allowNull: true
			}),
			queryInterface.changeColumn('vehicle_informations', "manufacturer", {
				type: Sequelize.STRING,
				allowNull: true
			}),
			queryInterface.changeColumn('vehicle_informations', "year", {
				type: Sequelize.STRING,
				allowNull: true
			}),
			queryInterface.changeColumn('vehicle_informations', "licensePlate", {
				type: Sequelize.STRING,
				allowNull: true
			}),
			queryInterface.changeColumn('vehicle_informations', "color", {
				type: Sequelize.STRING,
				allowNull: true
			}),
			queryInterface.changeColumn('vehicle_informations', "isValidPHL", {
				type: Sequelize.BOOLEAN,
				defaultValue: false
			}),
			queryInterface.addColumn('vehicle_informations', 'isSelected', {
				type: Sequelize.BOOLEAN,
				defaultValue: false
			})
		])
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
