// Libraries
const Sequelize = require('sequelize');

// Custom Libraries
const { sequelize_conn } = require('../../../config/database');
const Currency = require('./Currency');
const State = require('./State');

// Models
// const Role = require('./Role');

const Country = sequelize_conn.define('countries', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    currencyId: {
        type: Sequelize.INTEGER,
        // allowNull: false
    },
    countryName: {
        type: Sequelize.STRING,
        allowNull: false,
    },

    countryCode: {
        type: Sequelize.STRING,
        allowNull: false
    },

    dialCode: {
        type: Sequelize.NUMBER,
        allowNull: false
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

// User.addScope('')
// Country.belongsToMany(Role, {
//     through: 'user_roles'
// })

Country.belongsTo(Currency)
Country.hasMany(State)

module.exports = Country;