const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');

const UserLanguage = sequelize_conn.define('user_languages', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true, autoIncrement: true
    },
    userId: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 1
    }
}, {
    timestamps: true,
})


module.exports = UserLanguage;