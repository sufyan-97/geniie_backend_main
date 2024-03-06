const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');
const RejectionReason = require('./RejectionReason');
const ModuleType = require('./ModuleType');

const ReasonModule = sequelize_conn.define('reason_modules', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true, autoIncrement: true
    },
    moduleTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    reasonId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
}, {
    timestamps: true,
    defaultScope: {
    }
})

module.exports = ReasonModule;