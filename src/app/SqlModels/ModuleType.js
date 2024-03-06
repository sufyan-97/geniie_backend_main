const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');

const ModuleType = sequelize_conn.define('module_types', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true, autoIncrement: true
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false
    },
    deleteStatus: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
    },
}, {
    timestamps: true,
    defaultScope: {
    }
})


module.exports = ModuleType;