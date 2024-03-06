// Libraries
const { sequelize_conn } = require('../../../config/database');

// Configs
const Sequelize = require('sequelize');

const SentMail = sequelize_conn.define('sent_mails', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},

	email: {
		type: Sequelize.STRING,
		allowNull: false,
	},

	subject: {
		type: Sequelize.STRING,
		allowNull: false,
	},

	htmlData: {
		type: Sequelize.TEXT,
		allowNull: false,
	},
}, {
	timestamps: true,

})


module.exports = SentMail;