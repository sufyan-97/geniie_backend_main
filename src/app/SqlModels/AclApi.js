const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');
const AclApiToUserRole = require('./AclApiToUserRole');

const AclApi = sequelize_conn.define('acl_apis', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    endPoint: { type: Sequelize.STRING, allowNull: false },
    request_method: { type: Sequelize.STRING, allowNull: false },
    login_required: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
    },
}, {
    timestamps: true
})

AclApi.hasMany(AclApiToUserRole, { foreignKey: 'apiId' })

module.exports = AclApi;