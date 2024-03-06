// Libraries
const Sequelize = require('sequelize');

// Custom Libraries
const { sequelize_conn } = require('../../../config/database');

// Models
// const Role = require('./Role');

const City = sequelize_conn.define('cities', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    stateId: {
        type: Sequelize.INTEGER,
        // allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    countryCode: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    stateCode: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    },

    longitude: {
        type: Sequelize.DECIMAL(10, 6),
        allowNull: false
    },

    latitude: {
        type: Sequelize.DECIMAL(10, 6),
        allowNull: false
    },
}, {
    timestamps: true,
    defaultScope: {
    }
})


module.exports = City;