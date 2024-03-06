const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');
const User = require('./User');

const ActionHistory = sequelize_conn.define('action_history', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: Sequelize.INTEGER, allowNull: false, },
    action: { type: Sequelize.STRING, allowNull: false },
    actionData: { type: Sequelize.JSON, allowNull: false, },
    ticketId: { type: Sequelize.STRING, allowNull: true },
}, {
    timestamps: true,
    freezeTableName: true,
})
ActionHistory.belongsTo(User)

module.exports = ActionHistory;