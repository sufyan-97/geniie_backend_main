// Libraries
const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');

// Custom Libraries
const translation = require('../../lib/translation')

// Models
const Promotion = require('./Promotion')

const Service = sequelize_conn.define('services', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING, allowNull: false },
    nameKey: { type: Sequelize.VIRTUAL },
    image: { type: Sequelize.TEXT, allowNull: false },
    slug: { type: Sequelize.TEXT },
    service_categories: { type: Sequelize.VIRTUAL },
    isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: 1 },
    isFeatured: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: 0 },
    deleteStatus: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: 0 }
}, {
    timestamps: true,
    hooks: {

        beforeCreate: async function (item, options) {
            let slug = item.name.replace(/\s/g, `-`);
            item.slug = slug;

            let value = await Service.findOne({
                where: { slug: slug },
                attributes: ['id']
            })

            if (value) {
                let key = Date.now()
                item.slug = `${slug}-${key}`;
            }

        },

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
    },
    defaultScope: {
        where: {
            deleteStatus: false
        }
    },
})

Service.hasMany(Promotion, { foreignKey: 'serviceId', sourceKey: 'id' });
Promotion.belongsTo(Service, { foreignKey: 'serviceId', targetKey: 'id' })

module.exports = Service;