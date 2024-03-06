const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');

const PromoCodeRegion = sequelize_conn.define('promo_codes_regions', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    type: {
        type: Sequelize.ENUM,
        values: ['country', 'state', 'city'],
        defaultValue: 'country',
        allowNull: false
    },

    countryId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    stateId: {
        type: Sequelize.INTEGER
    },

    cityId: {
        type: Sequelize.INTEGER
    },


}, {
    timestamps: true,
})



module.exports = PromoCodeRegion;