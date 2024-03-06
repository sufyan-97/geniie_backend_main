const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');
const User = require('./User');
const Service = require('./Service');

const UserService = sequelize_conn.define('user_services', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    businessName: {
        type: Sequelize.STRING,
        allowNull: true
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: true
    },
    serviceDetails: {
        type: Sequelize.JSON
    },
    rejectedFields: {
        type: Sequelize.JSON
    },
    deleteStatus: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
    },
    serviceId: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    userId: {
        type: Sequelize.INTEGER
    },
    status: {
        type: Sequelize.ENUM,
        values: ['pending', 'request_for_approval', 'approved', 'rejected', 'active'],
        defaultValue: 'pending',
        allowNull: false
    },
}, {
    timestamps: true,
    // underscored: true
    tableName: 'user_services',
})
UserService.belongsTo(User)
UserService.belongsTo(Service)

module.exports = UserService;