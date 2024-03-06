const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');

const PostcodeAddresses = sequelize_conn.define('postcode_addresses', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},

	postcode: {
		type: Sequelize.TEXT,
		allowNull: true,
	},

	postcodeAddress: {
		type: Sequelize.TEXT,
		allowNull: true,
	},
	addressDetails: {
		type: Sequelize.TEXT,
		allowNull: true,
	},

	latitude: {
		type: Sequelize.TEXT,
		allowNull: true,
	},
	longitude: {
		type: Sequelize.TEXT,
		allowNull: true,
	},
	city: {
		type: Sequelize.TEXT,
		allowNull: true,
	},
	street: {
		type: Sequelize.TEXT,
		allowNull: true,
	},
	completePostcodeDetails: {
		type: Sequelize.TEXT,
		allowNull: true,
	},
}, {
	timestamps: true,
})

module.exports = PostcodeAddresses;