const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');

const Subscriber = sequelize_conn.define('subscribers', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true, autoIncrement: true
	},

	email: {
		type: Sequelize.STRING,
		allowNull: false,
	},

	deleteStatus: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: 0,
	},

}, {
	timestamps: true,
})

module.exports = Subscriber;