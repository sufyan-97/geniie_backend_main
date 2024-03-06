const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');
const Notification = require('./Notification');
const User = require('./User');


const UserNotification = sequelize_conn.define('user_notifications', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    status: { type: Sequelize.ENUM, values: ['read', 'unread'], defaultValue: 'unread', allowNull: false },

    deleteStatus: { type: Sequelize.BOOLEAN, defaultValue: 0 },
}, {
    timestamps: true,
})

UserNotification.belongsTo(Notification)
Notification.hasMany(UserNotification)
UserNotification.belongsTo(User)


module.exports = UserNotification;