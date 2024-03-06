const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');

const AppControls = sequelize_conn.define('app_controls', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    key: { type: Sequelize.STRING, allowNull: false },
    value: { type: Sequelize.TEXT, allowNull: false },
    appName: {
        type: Sequelize.STRING,
        // values: ['restaurant', 'rider', 'user'],
        // defaultValue: 'user',
        allowNull: false
    },
    deleteStatus: { type: Sequelize.BOOLEAN, defaultValue: 0 },
    isActive: { type: Sequelize.BOOLEAN, defaultValue: 1 },
    description: { type: Sequelize.TEXT, allowNull: true },
}, {
    timestamps: true,
})


module.exports = AppControls;