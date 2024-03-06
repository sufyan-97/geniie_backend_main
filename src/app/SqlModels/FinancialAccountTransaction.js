// Libraries
const Sequelize = require('sequelize');

// Custom Libraries
const { sequelize_conn } = require('../../../config/database');

// Models
const Payment = require('./Payment')

const FinancialAccountTransaction = sequelize_conn.define('financial_account_transactions', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},

	userId: {
		type: Sequelize.INTEGER,
		allowNull: false
	},

	paymentId: {
		type: Sequelize.INTEGER,
		// allowNull: false
	},

	orderId: {
		type: Sequelize.INTEGER,
		// allowNull: false
	},

	businessId: {
		type: Sequelize.DECIMAL(15, 2),
		defaultValue: 0,
		allowNull: false
	},

	invoiceId: {
		type: Sequelize.DECIMAL(15, 2),
		defaultValue: 0,
		allowNull: false
	},

	transactionType: {
		type: Sequelize.ENUM,
		// defaultValue: 0,
		values: ['debit', 'credit'],
		allowNull: false
	},

	transactionOf: {
		// type: Sequelize.ENUM,
		type: Sequelize.STRING,
		// values: ['order', 'topUp', 'refund', 'booking'],
		allowNull: false
	},

	amount: {
		type: Sequelize.DECIMAL(15, 2),
		defaultValue: 0,
		allowNull: false
	},

	transactionData: {
		type: Sequelize.JSON
	},

}, {
	timestamps: true,
	// defaultScope: {
	// }
	hooks: {
		afterFind: async function (transaction, options) {
			if (transaction && transaction.length > 0) {
				transaction.map(item => {
					try {
						if (item.transactionData) {
							item.transactionData = JSON.parse(item.transactionData)
						}
					} catch (error) {
						console.log(error);
					}
				})
			} else if (transaction && Object.keys(transaction).length > 0) {
				try {
					if (transaction.transactionData) {
						transaction.transactionData = JSON.parse(transaction.transactionData)
					}
				} catch (error) {
					console.log(error);
				}
			}
		}
	}
})

FinancialAccountTransaction.hasOne(Payment, {
	as: 'payment',
	sourceKey: 'paymentId',
	foreignKey: 'id'
})

Payment.belongsTo(FinancialAccountTransaction, {
	sourceKey: 'paymentId',
	foreignKey: 'id',
	as: 'transaction'
	// sourceKey: 'id',
	// targetKey: 'paymentId'
});


module.exports = FinancialAccountTransaction;