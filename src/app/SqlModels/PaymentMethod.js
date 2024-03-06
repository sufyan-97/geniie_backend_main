const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');

const PaymentMethod = sequelize_conn.define('payment_methods', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    image: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    slug: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: 1
    },
    deleteStatus: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
    },
    isTopup: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    isService: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    },
    paymentFunction: {
        type: Sequelize.STRING,
    },
    instantPayment: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },

    /**
     * [
     *   {
     *     name: 'string',
     *     isRequired: boolean,
     *     type: 'string'
     *   }
     * ]
     */
    validParams: {
        type: Sequelize.JSON,
        defaultValue: null
    }
}, {
    timestamps: true,
    defaultScope: {
        attributes: { exclude: ['paymentFunction', 'instantPayment', 'validParams'] },
    }
})

module.exports = PaymentMethod;