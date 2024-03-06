const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');

// Custom Libraries
const translation = require('../../lib/translation')

const Filter = sequelize_conn.define('filters', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING, allowNull: false, defaultValue: null },
    nameKey: { type: Sequelize.VIRTUAL },
    slug: { type: Sequelize.STRING, allowNull: false, defaultValue: null },
    appName: { type: Sequelize.STRING, defaultValue: null },
    isActive: { type: Sequelize.BOOLEAN, defaultValue: 0 },
}, {
    timestamps: true,
    hooks: {
        afterFind: (instance, options) => {
            if (instance && instance.length > 0) {
                instance.map((instanceItem) => {
                    instanceItem.nameKey = instanceItem.name
                    instanceItem.name = translation(instanceItem.name, instanceItem.name, options.lngCode ? options.lngCode : 'en')
                })
            } else if (instance && Object.keys(instance).length > 0) {
                instance.nameKey = instance.name
                instance.name = translation(instance.name, instance.name, options.lngCode ? options.lngCode : 'en')
            }
            return instance
        }
    }
})

module.exports = Filter;