const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');

const PromotionCategory = sequelize_conn.define('promotion_categories', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},

	promotionId: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},

	categoryId: {
		type: Sequelize.INTEGER,
		allowNull: false
	}

}, {
    timestamps: true
})


module.exports = PromotionCategory;
