// Libraries
const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');

// Models
const User = require('./User');
const Role = require('./Role');

const Registration = sequelize_conn.define('registrations', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    status: {
        type: Sequelize.ENUM,
        values: ["pending", "waiting for approval", "approved", "active", "rejected"],
        defaultValue: "pending",
        allowNull: false,
    },

	isProfileUpdated: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	},

    registrationData: {
        type: Sequelize.JSON
    },

    rejectedFields: {
        type: Sequelize.JSON
    },

    isProfileUpdated: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
    },

    deleteStatus: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
    }
}, {
    timestamps: true
})
Registration.belongsTo(User)
Registration.belongsTo(Role)

module.exports = Registration;
