const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');
const UserLanguage = require('./UserLanguage')


const Language = sequelize_conn.define('languages', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true, autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    languageCode: {
        type: Sequelize.STRING,
        allowNull: false
	},
	flag: {
		type: Sequelize.TEXT,
		allowNull: true
	},
    isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 1
    },
    isDefault: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    deleteStatus: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
    },
}, {
    timestamps: true,
})

Language.hasOne(UserLanguage, { foreignKey: 'languageId' });
UserLanguage.belongsTo(Language, { foreignKey: 'languageId' })

module.exports = Language;