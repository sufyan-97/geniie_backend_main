const Sequelize = require('sequelize');
const { sequelize_conn } = require('../../../config/database');

//Models
const PromoCode = require('./PromoCode');

const WaitingList = sequelize_conn.define('waiting_list', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	firstName: {
		type: Sequelize.STRING,
		allowNull: false
	},
	lastName: {
		type: Sequelize.STRING,
		allowNull: false
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false
	},
	mobileNumber: {
		type: Sequelize.STRING,
		allowNull: false
	},
	whatsappNumber: {
		type: Sequelize.STRING,
		allowNull: true
	},
	showUpdates: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	},
	promoCodeId: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
	clientAgent: {
		type: Sequelize.TEXT
	},

}, {
	timestamps: true,
	freezeTableName: true
})

WaitingList.belongsTo(PromoCode)

module.exports = WaitingList;
