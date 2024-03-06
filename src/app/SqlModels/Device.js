// Libraries
const Sequelize = require('sequelize');

// Custom Libraries
const { sequelize_conn } = require('../../../config/database');

// Models

const User = require('./User')
const SystemApp = require('./SystemApp')

const Device = sequelize_conn.define('devices', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},

	uuid: { type: Sequelize.STRING, allowNull: false },

	serial: { type: Sequelize.STRING },

	mac: { type: Sequelize.STRING },

	isIos: { type: Sequelize.BOOLEAN, defaultValue: false },

	fireBaseDeviceToken: { type: Sequelize.STRING, allowNull: false },
}, {
	timestamps: true,
})

Device.belongsTo(User)
Device.belongsTo(SystemApp)


module.exports = Device;