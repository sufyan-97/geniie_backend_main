// Libraries
const fs = require("fs");
// const jwt = require('jsonwebtoken');

// Models
const Invoice = require('../app/SqlModels/Invoice')

// Custom Libraries
const { sendEmail, sendEmailV2 } = require("../lib/email");
// const { sql } = require("../config/database");


// Constants
const appConstants = require("../../config/constants");

const constants = require("../app/Constants/app.constants");
// const { sendEmail } = require("../lib/email");

module.exports = {
    getInvoiceId: function () {
        return new Promise((resolve, reject) => {
            let invoiceId = ""
            var max = "000000"
            Invoice.findOne({
                attributes: ['id'],
                order: [
                    ['id', 'DESC']
                ]
            }).then((lastInvoice) => {
                if (!lastInvoice) {
                    invoiceId = '000001'
                } else {

                    invoiceId = (lastInvoice.id + 1).toString()
                    invoiceId = max.substring(0, max.length - invoiceId.length) + invoiceId
                }

                resolve(`PI${invoiceId}`)
            }).catch(error => {
                reject(error)
            })
        })
    },
    getInvoiceIdWithConnection: async function (sequelizeTransaction) {
        return new Promise((resolve, reject) => {
            let invoiceId = ""
            var max = "000000"
            Invoice.findOne({
                attributes: ['id'],
                order: [
                    ['id', 'DESC']
                ]
            }, {
                transaction: sequelizeTransaction
            }).then((lastInvoice) => {
                if (!lastInvoice) {
                    invoiceId = '000001'
                } else {

                    invoiceId = (lastInvoice.id + 1).toString()
                    invoiceId = max.substring(0, max.length - invoiceId.length) + invoiceId

                }

                resolve(`PI${invoiceId}`)
            }).catch(error => {
                reject(error)
            })
        })
    },
}

