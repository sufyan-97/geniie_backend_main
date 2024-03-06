const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');
const PromoCodeRegion = require('./PromoCodeRegion');
const PromoHistory = require('./PromoHistory');

const PromoCode = sequelize_conn.define('promo_codes', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: Sequelize.STRING,
        allowNull: false
    },

    discount: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    promoCode: {
        type: Sequelize.STRING,
        allowNull: false
    },

    type: {
        type: Sequelize.ENUM,
        values: ['flat', 'percentage'],
        defaultValue: 'flat',
        allowNull: false
    },

    maxUseLimit: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    remainingLimit: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    userMaxUseLimit: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    minOrderLimit: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    },

    maxDiscount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    },

    status: {
        type: Sequelize.ENUM,
        values: ['active', 'expired', 'suspended'],
        defaultValue: 'active',
        allowNull: false
    },

    expiryDate: {
        type: 'TIMESTAMP'
    },

    allowedRegion: {
        type: Sequelize.JSON
    },

    deleteStatus: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
    },

    promoType: {
        type: Sequelize.ENUM,
        values: ['area', 'user'],
        defaultValue: 'area',
        allowNull: false
    },

}, {
    timestamps: true,
})

PromoCode.hasMany(PromoCodeRegion)
PromoCode.hasMany(PromoHistory)


module.exports = PromoCode;