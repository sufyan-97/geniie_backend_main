const Sequelize = require('sequelize');

const { sequelize_conn } = require('../../../config/database');
// const User = require('./User')
const Role = require('./Role')


const UserRole = sequelize_conn.define('user_roles', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: Sequelize.INTEGER, allowNull: false }
}, {
    timestamps: true,
    // underscored: true
})

// UserRole.belongsTo(User)
UserRole.belongsTo(Role)

module.exports = UserRole;