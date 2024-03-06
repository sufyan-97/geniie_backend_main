const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');

const NextOpeningTime = sequelize_conn.define('next_opening_times', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    openingTime: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    openingTimeType: {
        type: Sequelize.ENUM,
        values: ['minutes', 'hours', 'days', 'weeks', 'rest_of_the_day', 'indefinitely', 'other']
    },
}, {
    timestamps: true
})

module.exports = NextOpeningTime;