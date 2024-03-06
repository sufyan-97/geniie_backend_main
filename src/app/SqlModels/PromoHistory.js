const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');

const PromoHistory = sequelize_conn.define('promo_histories', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    promoCodeId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    orderId: {
        type: Sequelize.INTEGER
    }
}, {
    timestamps: true,
})



module.exports = PromoHistory;