// Libraries
const Sequelize = require('sequelize');

// Custom Libraries
const { sequelize_conn } = require('../../../config/database');

// Models
// const UserAccountBalance = require('./UserAccountBalance');

// console.log('test', UserAccountBalance)
const Currency = sequelize_conn.define('currencies', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    currencyType: {
        type: Sequelize.ENUM,
        values: ['forex', 'crypto'],
        allowNull: false,
        defaultValue: 'forex'
    },
    status: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    currencyName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    currencyCode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
    },
    currencySymbol: {
        type: Sequelize.STRING,
        // dialactOptions: {
        // 	charset: 'utf8',
        // 	collate: 'utf8_unicode_ci',
        // },
        // charset: 'utf8',
        // collate: 'utf8_unicode_ci',
    },
    currencyUnicode: {
        type: Sequelize.STRING,
    },
    currencyHexcode: {
        type: Sequelize.STRING,
    },
    currencyHtmlSymbol: {
        type: Sequelize.STRING,
    }
}, {
    timestamps: true,
    defaultScope: {
    }
})




// Role.belongsToMany(Country, {
//     through: 'users_roles'
// })

module.exports = Currency;