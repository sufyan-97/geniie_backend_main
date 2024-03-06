// Libraries
const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');

// Models
const Role = require('./Role');

const SuperAdminRoutePermission = sequelize_conn.define('super_admin_route_permissions', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING, allowNull: false, },
    route: { type: Sequelize.STRING, allowNull: false },
    icon: { type: Sequelize.STRING, allowNull: false },
    hasChild: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: 0 },
    parentRoute: { type: Sequelize.STRING, allowNull: true },
    roleId: { type: Sequelize.INTEGER, allowNull: false },
    isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: 1 }
}, {
    timestamps: true
})

module.exports = SuperAdminRoutePermission;
