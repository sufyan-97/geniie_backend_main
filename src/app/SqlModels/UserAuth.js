const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');

const UserAuth = sequelize_conn.define('user_auth_providers', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    userId: { type: Sequelize.INTEGER, allowNull: false },
    username: { type: Sequelize.STRING, allowNull: false },
    oAuthProvider: { type: Sequelize.STRING, allowNull: false },
    accessToken: { type: Sequelize.TEXT, allowNull: false },
    refreshToken: { type: Sequelize.TEXT, allowNull: false },
    // expiryDate: { type: Sequelize.DATE },
    deleteStatus: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
    },
}, {
    timestamps: true,
    // underscored: true
})

module.exports = UserAuth;