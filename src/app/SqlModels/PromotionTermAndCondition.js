const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');

const PromotionTermAndCondition = sequelize_conn.define('promotion_term_and_conditions', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},

	promotionId: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},

	termId: {
		type: Sequelize.INTEGER,
		allowNull: false
	}

}, {
    timestamps: true
})


module.exports = PromotionTermAndCondition;
