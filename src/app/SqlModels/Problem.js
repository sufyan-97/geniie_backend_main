const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');

const Problem = sequelize_conn.define('problems', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true, autoIncrement: true
    },

    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    detail: {
        type: Sequelize.STRING,
        allowNull: false
    },

    images: {
        type: Sequelize.JSON,
        allowNull: false
    }
}, {
    timestamps: true,
})


module.exports = Problem;