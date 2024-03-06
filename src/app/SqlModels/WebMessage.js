const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');

const WebMessage = sequelize_conn.define('web_messages', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true, autoIncrement: true
	},

	fullName: {
		type: Sequelize.STRING,
		allowNull: false,
	},

	email: {
		type: Sequelize.STRING,
		allowNull: false,
	},

	message: {
		type: Sequelize.TEXT,
		allowNull: false,
	},
	subject: {
		type: Sequelize.TEXT,
		allowNull: false,
	}
}, {
	timestamps: true,
})

module.exports = WebMessage;