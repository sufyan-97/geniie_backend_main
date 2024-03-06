const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');

const RestaurantRider = sequelize_conn.define('restaurant_riders', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},

	restaurantUserId: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},

	riderId: {
		type: Sequelize.INTEGER,
		allowNull: false
	}

}, {
    timestamps: true
})


module.exports = RestaurantRider;
