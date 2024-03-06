// Libraries
const Sequelize = require('sequelize');

// Custom Libraries
const { sequelize_conn } = require('../../../config/database');

// Models
const SuperAdminRoutePermission = require('./SuperAdminRoutePermission')
const SuperAdminActionPermission = require('./SuperAdminActionPermission')

const Role = sequelize_conn.define('roles', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    roleName: { type: Sequelize.STRING, allowNull: false },
    isActive: { type: Sequelize.BOOLEAN, defaultValue: 1 },
    isAgent: { type: Sequelize.BOOLEAN, defaultValue: 0 },
}, {
    timestamps: true,
})

Role.hasMany(SuperAdminRoutePermission)
Role.hasMany(SuperAdminActionPermission)

module.exports = Role;