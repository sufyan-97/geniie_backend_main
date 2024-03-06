// Libraries
const { sequelize_conn } = require('../../../config/database');

// Custom Libraries
const translation = require('../../lib/translation')

// Configs
const Sequelize = require('sequelize');

const Gender = sequelize_conn.define('genders', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true, autoIncrement: true
    },
    gender: {
        type: Sequelize.STRING,
        allowNull: false
    },
    genderKey: { type: Sequelize.VIRTUAL },
    deleteStatus: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
    }
}, {
    timestamps: true,
    hooks: {
        afterFind: (instance, options) => {
            if (instance && instance.length > 0) {
                instance.map((instanceItem) => {
                    instanceItem.genderKey = instanceItem.gender
                    instanceItem.gender = translation(instanceItem.gender, instanceItem.gender, options.lngCode ? options.lngCode : 'en')
                })
            } else if (instance && Object.keys(instance).length > 0) {
                instance.genderKey = instance.gender
                instance.gender = translation(instance.gender, instance.gender, options.lngCode ? options.lngCode : 'en')
            }
            return instance
        }
    }
})


module.exports = Gender;