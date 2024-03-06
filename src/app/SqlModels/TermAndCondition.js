// Libraries
const Sequelize = require('sequelize');

// Custom Libraries
const translation = require('../../lib/translation')

// Configs
const { sequelize_conn } = require('../../../config/database');

const TermAndCondition = sequelize_conn.define('term_and_conditions', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    detail: { type: Sequelize.STRING, allowNull: false },
    detailKey: { type: Sequelize.VIRTUAL },
    deleteStatus: { type: Sequelize.BOOLEAN, defaultValue: 0 },
}, {
    timestamps: true,
    hooks: {
        afterFind: (instance, options) => {
            if (instance && instance.length > 0) {
                instance.map((instanceItem) => {
                    instanceItem.detailKey = instanceItem.detail
                    instanceItem.detail = translation(instanceItem.detail, instanceItem.detail, options.lngCode? options.lngCode: 'en')
                })
            } else if (instance && Object.keys(instance).length > 0) {
                instance.detailKey = instance.detail
                instance.detail = translation(instance.detail, instance.detail, options.lngCode ? options.lngCode : 'en')
            }
            return instance
        }
    }
})


module.exports = TermAndCondition;