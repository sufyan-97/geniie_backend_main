// Libraries
const Sequelize = require('sequelize');

// Custom Libraries
const translation = require('../../lib/translation')

// Configs
const { sequelize_conn } = require('../../../config/database');


const SystemConstant = sequelize_conn.define('system_constants', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    key: { type: Sequelize.STRING, allowNull: false },
    value: { type: Sequelize.TEXT, allowNull: false },
    description: { type: Sequelize.TEXT },
    isActive: { type: Sequelize.BOOLEAN, defaultValue: 1 },
    deleteStatus: { type: Sequelize.BOOLEAN, defaultValue: 0 },
}, {
    timestamps: true,
    hooks: {
    }
})

module.exports = SystemConstant;