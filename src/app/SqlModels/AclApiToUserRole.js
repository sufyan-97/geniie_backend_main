const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');
const Role = require('./Role');

const AclApiToUserRole = sequelize_conn.define('acl_api_to_user_roles', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
}, {
    timestamps: true
})

AclApiToUserRole.belongsTo(Role)

module.exports = AclApiToUserRole;