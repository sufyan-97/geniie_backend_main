// Libraries
const Sequelize = require('sequelize');

// Custom Libraries
const translation = require('../../lib/translation')

// Configs
const { sequelize_conn } = require('../../../config/database');


const UserGeneralInformation = sequelize_conn.define('user_general_informations', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: Sequelize.STRING, allowNull: false },
    key: { type: Sequelize.STRING, allowNull: false },
    value: { type: Sequelize.STRING, allowNull: false },
}, {
    timestamps: true,
})

module.exports = UserGeneralInformation;