// Libraries
const Sequelize = require('sequelize');

// Custom Libraries
const translation = require('../../lib/translation')

// Configs
const { sequelize_conn } = require('../../../config/database');


const MainMenuItem = sequelize_conn.define('main_menu_items', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING, allowNull: false },
    nameKey: { type: Sequelize.VIRTUAL },
    image: { type: Sequelize.STRING },
    slug: { type: Sequelize.TEXT },
    isWebView: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: 0 },
    login_required: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: 1 },
    isActive: { type: Sequelize.BOOLEAN, defaultValue: 1 },
    sortOrder: { type: Sequelize.DECIMAL(10, 6), defaultValue: 0 },
    appName: { type: Sequelize.STRING, allowNull: false },
    deleteStatus: { type: Sequelize.BOOLEAN, defaultValue: 0 },
}, {
    timestamps: true,
    hooks: {
        // beforeCreate: async function (item, options) {
        //     let slug = item.name.replace(/\s/g, `-`);
        //     item.slug = slug;
        //     console.log('item=>', item);

        //     let value = await MainMenuItem.findOne({
        //         where: { slug: slug },
        //         attributes: ['id']
        //     })

        //     if (value) {
        //         let key = Date.now()
        //         item.slug = `${slug}-${key}`;
        //     }

        // },

        afterFind: (instance, options) => {
            if (instance && instance.length > 0) {
                instance.map((instanceItem) => {
                    instanceItem.nameKey = instanceItem.name
                    instanceItem.name = translation(instanceItem.name, instanceItem.name, options.lngCode? options.lngCode: 'en')
                })
            } else if (instance && Object.keys(instance).length > 0) {
                instance.nameKey = instance.name
                instance.name = translation(instance.name, instance.name, options.lngCode ? options.lngCode : 'en')
            }
            return instance
        }
    }
})

module.exports = MainMenuItem;