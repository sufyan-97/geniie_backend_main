// Libraries
const Sequelize = require('sequelize');

// Custom Libraries
const translation = require('../../lib/translation')

// Configs
const { sequelize_conn } = require('../../../config/database');


const Banner = sequelize_conn.define('banners', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    image: { type: Sequelize.STRING, allowNull: false },
    heading: { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
    headingKey: { type: Sequelize.VIRTUAL },
    subHeading: { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
    subHeadingKey: { type: Sequelize.VIRTUAL },
    detail: { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
    termAndCondition: { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
    appName: {
        type: Sequelize.STRING,
        // values: ['restaurant', 'restaurant_app', 'rider', 'user'],
        // defaultValue: 'user',
        allowNull: false
    },
    deleteStatus: { type: Sequelize.BOOLEAN, defaultValue: 0 },
    isActive: { type: Sequelize.BOOLEAN, defaultValue: 1 },
}, {
    timestamps: true,
    hooks: {
        afterFind: (instance, options) => {
            if (instance && instance.length > 0) {
                instance.map((instanceItem) => {
                    instanceItem.headingKey = instanceItem.heading
                    instanceItem.subHeadingKey = instanceItem.subHeading
                    instanceItem.heading = translation(instanceItem.heading, instanceItem.heading, options.lngCode ? options.lngCode : 'en')
                    instanceItem.subHeading = translation(instanceItem.subHeading, instanceItem.subHeading, options.lngCode ? options.lngCode : 'en')
                })
            } else if (instance && Object.keys(instance).length > 0) {
                instance.headingKey = instance.heading
                instance.subHeadingKey = instance.subHeading
                instance.heading = translation(instance.heading, instance.heading, options.lngCode ? options.lngCode : 'en')
                instance.subHeading = translation(instance.subHeading, instance.subHeading, options.lngCode ? options.lngCode : 'en')
            }
            return instance
		}
    }
})

// Banner.belongsTo(Restaurant)


module.exports = Banner;