// Libraries
const Sequelize = require('sequelize');

const ServiceCategory = require('./ServiceCategory');

// Custom Libraries
const { sequelize_conn } = require('../../../config/database');


const ServiceSubCategory = sequelize_conn.define('service_sub_categories', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true, autoIncrement: true
  },
  name: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.TEXT },
  serviceCategoryId: { type: Sequelize.INTEGER, allowNull: false },
  isMultiple: { type: Sequelize.BOOLEAN, defaultValue: 1 },
  status: { type: Sequelize.BOOLEAN, defaultValue: 1 },
  image: { type: Sequelize.STRING },
  deleteStatus: { type: Sequelize.BOOLEAN, defaultValue: false }
},
  {
    timestamps: true
  }
)

ServiceSubCategory.belongsTo(ServiceCategory, {
  foreignKey: "serviceCategoryId",
  targetKey: "id"
})

module.exports = ServiceSubCategory;