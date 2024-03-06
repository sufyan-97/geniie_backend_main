// Libraries
const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');

// Models
const PromotionCategory = require('./PromotionCategory');
const TermAndCondition = require('./TermAndCondition');
const PromotionTermAndCondition = require('./PromotionTermAndCondition');


const Promotion = sequelize_conn.define('promotions', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},

	title: {
		type: Sequelize.STRING,
		allowNull: false,
	},

	coverImage: {
		type: Sequelize.TEXT,
		allowNull: false
	},

	heading: {
		type: Sequelize.STRING,
		allowNull: false
	},

	serviceId: {
		type: Sequelize.INTEGER,
		allowNull: false
	},

	// categoryType: {
	// 	type: Sequelize.STRING,
	// 	allowNull: false
	// },

	discountType: {
		type: Sequelize.ENUM,
		values: ['flat', 'percentage'],
		defaultValue: 'flat'
	},

	discountValue: {
		type: Sequelize.INTEGER,
		allowNull: false
	},

	startDate: {
		type: Sequelize.DATE,
		allowNull: false
	},

	endDate: {
		type: Sequelize.DATE,
		allowNull: false
	},

	status: {
		type: Sequelize.ENUM,
		values: ['active', 'inactive'],
		defaultValue: 'inactive'
	},

	area: {
		type: Sequelize.ENUM,
		values: ['all', 'specific'],
		defaultValue: 'all'
	},

	allowedRegion: {
		type: Sequelize.JSON,
		defaultValue: null
	},

	deleteStatus: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	},

}, {
	timestamps: true,
})



// Promotion.associate = (models) => {
// 	console.log(models);
// 	Promotion.belongsTo(models.services, {foreignKey: 'serviceId', targetKey: 'id'});
// 	// Promotion.hasMany(models.promotion_categories);
// };
Promotion.hasMany(PromotionCategory);

Promotion.belongsToMany(TermAndCondition, {
    through: 'promotion_term_and_conditions', sourceKey: 'id', targetKey: 'id', foreignKey: 'promotionId'
})
TermAndCondition.belongsToMany(Promotion, {
    through: 'promotion_term_and_conditions', sourceKey: 'id', targetKey: 'id', foreignKey: 'termId'
})

module.exports = Promotion;
