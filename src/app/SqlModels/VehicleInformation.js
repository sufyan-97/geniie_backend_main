// Libraries
const Sequelize = require('sequelize');

// Custom Libraries
const translation = require('../../lib/translation')

// Configs
const { sequelize_conn } = require('../../../config/database');


const VehicleInformation = sequelize_conn.define('vehicle_informations', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	userId: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
	type: {
		type: Sequelize.STRING,
		allowNull: false
	},
	licenseNumber: {
		type: Sequelize.STRING,
		allowNull: true
	},
	manufacturer: {
		type: Sequelize.STRING,
		allowNull: true
	},
	year: {
		type: Sequelize.STRING,
		allowNull: true
	},
	licensePlate: {
		type: Sequelize.STRING,
		allowNull: true
	},
	color: {
		type: Sequelize.STRING,
		allowNull: true
	},

	isValidPHL: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	},
	isSelected: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	}
}, {
    timestamps: true,
})

module.exports = VehicleInformation;