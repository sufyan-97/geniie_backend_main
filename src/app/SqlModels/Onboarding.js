// Libraries
const Sequelize = require('sequelize');

// Custom Libraries
const translation = require('../../lib/translation')

// Configs
const { sequelize_conn } = require('../../../config/database');

const Onboarding = sequelize_conn.define('onboardings', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    heading: { type: Sequelize.STRING, allowNull: false },
    headingKey: { type: Sequelize.VIRTUAL },
    details: { type: Sequelize.STRING, allowNull: false },
    image: { type: Sequelize.STRING, allowNull: false },
    appName: { type: Sequelize.STRING, allowNull: false },
    deleteStatus: { type: Sequelize.BOOLEAN, defaultValue: 0 },
}, {
    timestamps: true,
    hooks: {
        afterFind: (instance, options) => {
            if (instance && instance.length > 0) {
                instance.map((instanceItem) => {
                    instanceItem.headingKey = instanceItem.heading
                    instanceItem.heading = translation(instanceItem.heading, instanceItem.heading, options.lngCode? options.lngCode: 'en')
                })
            } else if (instance && Object.keys(instance).length > 0) {
                instance.headingKey = instance.heading
                instance.heading = translation(instance.heading, instance.heading, options.lngCode ? options.lngCode : 'en')
            }
            return instance
        }
    }
})


module.exports = Onboarding;