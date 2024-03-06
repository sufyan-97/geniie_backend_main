// Libraries
const Sequelize = require('sequelize');

// Custom Libraries
const { sequelize_conn } = require('../../../config/database');

// Models
const Currency = require('./Currency');


const UserAccountBalance = sequelize_conn.define('user_account_balances', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},

	userId: {
		type: Sequelize.INTEGER,
		allowNull: false
	},

	countryId: {
		type: Sequelize.INTEGER,
		// allowNull: false
	},

	currencyId: {
		type: Sequelize.INTEGER,
		// allowNull: false
	},

	balance: {
		type: Sequelize.DECIMAL(15, 2),
		defaultValue: 0,
		allowNull: false
	},

	balanceLimit: {
		type: Sequelize.DECIMAL(15, 2),
		defaultValue: 0
	},

	cashInHand: {
		type: Sequelize.DECIMAL(15, 2),
		defaultValue: 0
	},

    deleteStatus: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	},

	rewardPoints: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
	},
}, {
	timestamps: true,
	defaultScope: {
	}
})


UserAccountBalance.belongsTo(Currency)
Currency.hasMany(UserAccountBalance);

module.exports = UserAccountBalance;