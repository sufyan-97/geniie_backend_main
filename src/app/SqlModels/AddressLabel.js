const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');
const translation = require('../../lib/translation');

const AddressLabel = sequelize_conn.define('address_labels', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING, allowNull: false },
    nameKey: { type: Sequelize.VIRTUAL },
    image: { type: Sequelize.TEXT, allowNull: false },
    selectedImage: { type: Sequelize.TEXT, allowNull: false },
    slug: { type: Sequelize.STRING },
    deleteStatus: { type: Sequelize.BOOLEAN, defaultValue: 0 }
}, {
    timestamps: true,
    // underscored: true,
    hooks: {
        beforeCreate: async function (address, options) {
            let slug = address.name.replace(/\s/g, `-`);
            address.slug = slug;

            // function(value, next) {
            let value = await AddressLabel.findOne({
                where: { slug: slug },
                attributes: ['id']
            });
            if (value) {
                let key = Date.now()
                address.slug = `${slug}-${key}`;
            }

		},
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

module.exports = AddressLabel;