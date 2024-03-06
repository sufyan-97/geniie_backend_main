const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');
const User = require('./User');
const Business = require('./UserService');

const ServiceAddress = sequelize_conn.define('service_addresses', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    address: { type: Sequelize.STRING, allowNull: false },
    cityId:{type:Sequelize.INTEGER, allowNull:false},
    countryId:{type:Sequelize.INTEGER, allowNull:false},
    longitude: { type: Sequelize.DECIMAL },
    latitude: { type: Sequelize.DECIMAL},
    activeAddress: { type: Sequelize.BOOLEAN, defaultValue: 0 },
    deleteStatus: { type: Sequelize.BOOLEAN, defaultValue: 0 },
    userServiceId: { type: Sequelize.INTEGER, defaultValue: null },
}, {
    timestamps: true,
    // underscored: true

    tableName: 'service_addresses',
})

ServiceAddress.belongsTo(User)
ServiceAddress.belongsTo(Business)

module.exports = ServiceAddress;