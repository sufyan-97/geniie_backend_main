// Libraries
const Sequelize = require('sequelize');

// Custom Libraries
const { sequelize_conn } = require('../../../config/database');

// Models


const Invoice = sequelize_conn.define('invoices', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    invoiceId: {
        type: Sequelize.STRING,
        allowNull: false
    },

    invoiceSummery: {
        type: Sequelize.JSON,
        allowNull: false
    },

    file: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: true,
})




module.exports = Invoice;