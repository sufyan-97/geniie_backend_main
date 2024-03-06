// Libraries
const { sequelize_conn } = require('../../../config/database');

// Custom Libraries
const translation = require('../../lib/translation')

// Configs
const Sequelize = require('sequelize');

const EmailTemplate = sequelize_conn.define('email_templates', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},

	templateName: {
		type: Sequelize.STRING,
		allowNull: false,
	},

	templateData: {
		type: Sequelize.JSON,
		allowNull: false,
	},
}, {
	timestamps: true,

})


module.exports = EmailTemplate;