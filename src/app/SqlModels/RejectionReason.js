// Libraries
const Sequelize = require('sequelize');

// Custom Libraries
const translation = require('../../lib/translation')

// Configs
const { sequelize_conn } = require('../../../config/database');

// const ReasonModule = require('./ReasonModule');
const ModuleType = require('./ModuleType');

const RejectionReason = sequelize_conn.define('rejection_reasons', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: Sequelize.STRING, allowNull: false },
    textKey: { type: Sequelize.VIRTUAL },
    // slug: { type: Sequelize.STRING },
    // module: { type: Sequelize.STRING },
    deletedAt: { type: Sequelize.DATE, defaultValue: null, }
}, {
    timestamps: true,
    hooks: {
        afterFind: (instance, options) => {
            if (instance && instance.length > 0) {
                instance.map((instanceItem) => {
                    instanceItem.textKey = instanceItem.text
                    instanceItem.text = translation(instanceItem.text, instanceItem.text, options.lngCode? options.lngCode: 'en')
                })
            } else if (instance && Object.keys(instance).length > 0) {
                instance.textKey = instance.text
                instance.text = translation(instance.text, instance.text, options.lngCode ? options.lngCode : 'en')
            }
            return instance
        }
    }
})

RejectionReason.belongsToMany(ModuleType, {
    through: 'reason_modules', sourceKey: 'id', targetKey: 'id', foreignKey: 'reasonId'
})
ModuleType.belongsToMany(RejectionReason, {
    through: 'reason_modules', sourceKey: 'id', targetKey: 'id', foreignKey: 'moduleTypeId'
})

module.exports = RejectionReason;