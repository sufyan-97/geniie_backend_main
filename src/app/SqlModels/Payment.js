const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');
const PaymentMethod = require('../SqlModels/PaymentMethod');

const Payment = sequelize_conn.define('payments', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true, autoIncrement: true
    },

    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    paymentMethod: {
        type: Sequelize.STRING,
        allowNull: false
    },

    paymentStatus: {
        type: Sequelize.ENUM,
        values: ['pending', 'rejected', 'completed'],
        allowNull: false
    },

    amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
    },

    paymentSummery: {
        type: Sequelize.JSON,
        allowNull: false
    }

}, {
    timestamps: true,
})

Payment.belongsTo(PaymentMethod,{ foreignKey: 'paymentMethod'})

module.exports = Payment;