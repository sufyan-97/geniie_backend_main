// Libraries
const Sequelize = require('sequelize');

// Custom Libraries
const { sequelize_conn } = require('../../../config/database');

const User = require('./User');

const RecentSearch = sequelize_conn.define('recentSearches',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true, autoIncrement: true
    },
    key: Sequelize.STRING,
    location: Sequelize.STRING,
    deletedAt: Sequelize.DATE,
  }, {
  timestamps: true,
  defaultScope: {
  },
})

// User Relation
User.hasMany(RecentSearch, {
  foreignKey: 'userId',
  sourceKey: 'id'
});
RecentSearch.belongsTo(User, {
  foreignKey: 'userId',
  targetKey: 'id'
})

module.exports = RecentSearch;