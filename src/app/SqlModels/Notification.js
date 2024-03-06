const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');
const SystemApp = require('./SystemApp');

const Notification = sequelize_conn.define('notifications', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    subject: { type: Sequelize.STRING, allowNull: false },
    description: { type: Sequelize.STRING },
    image: { type: Sequelize.STRING },
    type: {
        type: Sequelize.ENUM,
        values: ['general', 'user'],
        defaultValue: 'general',
        allowNull: false
    },
    appName: {
        type: Sequelize.ENUM,
        values: ['asaap', 'asaap-restaurant', 'rider','super_admin'],
        defaultValue: 'asaap-restaurant',
        allowNull: false
    },
    category: {
        type: Sequelize.ENUM,
        values: ['system', 'super_admin'],
        defaultValue: 'system',
        allowNull: false
    },
    notificationData: {
        type: Sequelize.JSON
    },

    deleteStatus: { type: Sequelize.BOOLEAN, defaultValue: 0 },
}, {
    timestamps: true,
    hooks: {
        afterFind: async function (notification, options) {
            if (notification && notification.length > 0) {
                notification.map(item => {
                    try {
                        item.notificationData = JSON.parse(item.notificationData)
                    } catch (error) {
                        console.log(error);
                    }
                })
            } else if (notification && Object.keys(notification).length > 0) {
                try {
                    notification.notificationData = JSON.parse(notification.notificationData)
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }
})

Notification.belongsTo(SystemApp)

module.exports = Notification;
