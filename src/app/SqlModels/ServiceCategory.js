// Libraries
const Sequelize = require('sequelize');

const Service = require('./Service');

// Custom Libraries
const { sequelize_conn } = require('../../../config/database');


const ServiceCategory = sequelize_conn.define('service_categories', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true, autoIncrement: true
  },
  name: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.TEXT },
  isMultiple: { type: Sequelize.BOOLEAN, defaultValue: 1 },
  status: { type: Sequelize.BOOLEAN, defaultValue: 1 },
  deleteStatus: { type: Sequelize.BOOLEAN, defaultValue: false },
  // isSystem:{type:Sequelize.BOOLEAN, defaultValue:0}
},
  {
    timestamps: true
  }
)

ServiceCategory.belongsTo(Service, {
  foreignKey: "serviceId",
  targetKey: "id"
})


module.exports = ServiceCategory;