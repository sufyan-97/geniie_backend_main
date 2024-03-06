const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');

const UserRiderPrice = sequelize_conn.define('user_rider_prices', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},

	userId: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},

	currencyCode: {
		type: Sequelize.STRING,
		allowNull: false,
		defaultValue: 'GBP'
	},

	price: {
		type: Sequelize.DECIMAL(10, 3),
		allowNull: false
	},

}, {
    timestamps: true
})


module.exports = UserRiderPrice;
