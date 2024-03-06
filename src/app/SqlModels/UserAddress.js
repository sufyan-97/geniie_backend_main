const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');
const User = require('./User');
const Role = require('./Role');
const AddressLabel = require('./AddressLabel');
const translation = require('../../lib/translation');
const City = require('./City');

const UserAddress = sequelize_conn.define('user_addresses', {
	id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	addressHeading: { type: Sequelize.STRING },
	address: { type: Sequelize.STRING, allowNull: false },
	cityId: { type: Sequelize.INTEGER },
	countryId: { type: Sequelize.INTEGER },
	postCode: { type: Sequelize.STRING },
	floor: { type: Sequelize.STRING },
	optional: { type: Sequelize.STRING },
	longitude: { type: Sequelize.DECIMAL(10, 6), allowNull: false },
	latitude: { type: Sequelize.DECIMAL(10, 6), allowNull: false },
	activeAddress: { type: Sequelize.BOOLEAN, defaultValue: 0 },
	addressLabelName: { type: Sequelize.STRING },
	deleteStatus: { type: Sequelize.BOOLEAN, defaultValue: 0 },
	roleId: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 }
}, {
	timestamps: true,
	hooks: {
		afterFind: (instance, options) => {
			// console.log(instance.address_label)
			if (instance && instance.length > 0) {
				instance.map((instanceItem) => {

					if (instanceItem.address_label) {
						// if (instanceItem.address_label && instanceItem.address_label.length > 0) {
						// 	instanceItem.address_label.map((address_label) => {
						// 		address_label.name = translation(address_label.name, address_label.name, options.lngCode ? options.lngCode : 'en')
						// 	})
						// } else
						if (instanceItem.address_label && Object.keys(instanceItem.address_label).length > 0) {
							instanceItem.address_label.name = translation(instanceItem.address_label.name, instanceItem.address_label.name, options.lngCode ? options.lngCode : 'en')
						}
					}

					instanceItem.addressLabelName = translation(instanceItem.addressLabelName, instanceItem.addressLabelName, options.lngCode ? options.lngCode : 'en')
				})
			} else if (instance && Object.keys(instance).length > 0) {
				if (instance.address_label) {
					// if (instance.address_label && instance.address_label.length > 0) {
					// 	instance.address_label.map((address_label) => {
					// 		address_label.name = translation(address_label.name, address_label.name, options.lngCode ? options.lngCode : 'en')
					// 	})
					// } else
					if (instance.address_label && Object.keys(instance.address_label).length > 0) {
						instance.address_label.name = translation(instance.address_label.name, instance.address_label.name, options.lngCode ? options.lngCode : 'en')
					}
				}

				instance.addressLabelName = translation(instance.addressLabelName, instance.addressLabelName, options.lngCode ? options.lngCode : 'en')
			}
			return instance
		}

	}
	// underscored: true
})
User.hasMany(UserAddress, { foreignKey: 'userId' });
UserAddress.belongsTo(City);
UserAddress.belongsTo(User)
UserAddress.belongsTo(Role)
UserAddress.belongsTo(AddressLabel)

module.exports = UserAddress;