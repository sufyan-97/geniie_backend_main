// Libraries
const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');

// Models
const Role = require('./Role');

const SuperAdminActionPermission = sequelize_conn.define('super_admin_action_permissions', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    route: { type: Sequelize.STRING, allowNull: false },
    permission: { type: Sequelize.STRING, allowNull: true },
    roleId: { type: Sequelize.INTEGER, allowNull: false },
    isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: 1 }
}, {
    timestamps: true
})

module.exports = SuperAdminActionPermission;
