//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

// Libraries
const fs = require('fs');
const path = require('path');
const pug = require('pug');
const pdf = require('html-pdf');
const md5 = require('md5');
const moment = require("moment");
// const fs = require('fs')
// const path = require('path');
// const paypalIpn = require('paypal-ipn');

// Custom Libraries
const { sequelize_conn } = require('../../../config/database');
const paypal = require('../../lib/paypal')
const rpcClient = require("../../lib/rpcClient")

// Modals
// var Model = require('../SqlModels/Language');
const Payment = require('../SqlModels/Payment');
const User = require('../SqlModels/User');
const Currency = require('../SqlModels/Currency');
const FinancialAccountTransaction = require('../SqlModels/FinancialAccountTransaction');
const PaymentMethod = require('../SqlModels/PaymentMethod');
const Invoice = require('../SqlModels/Invoice');


// helpers
const generalHelper = require('../../helpers/general_helper');
const invoiceHelper = require('../../helpers/invoiceHelper');

// Constants
const constants = require('../../../config/constants');
const app_constants = require('../Constants/app.constants')

exports.paypalSuccessPayment = async function (req, res) {
    try {
        // console.log(req.query)

        const paymentId = req.query.paymentId;

        let paymentData = await Payment.findOne({
            where: {
                paymentStatus: 'pending',
                'paymentSummery.id': paymentId
            },
        })

        if (!paymentData) {
            return res.status(400).send({
                status: false,
                message: 'Payment not found'
            })
        }

        const user = await User.findOne({
            where: {
                id: paymentData.userId
            }
        })

        if (!user) {
            return res.status(400).send({
                status: false,
                message: 'Error: user not found'
            })
        }

        const accountBalance = await user.getAccountBalance({
            include: [{
                model: Currency,
                // attributes: ['currencySymbol']
            }]
        })

        if (!accountBalance) {
            return res.status(500).send({
                message: 'Error: Unable to handle this request.',
            });
        }

        /**
             * 3.2 getTransaction
             */
        let transactionData = await FinancialAccountTransaction.findOne({
            where: {
                paymentId: paymentData.id
            }
        })

        if (!transactionData) {
            return res.status(400).send({
                status: false,
                message: 'Error: payment could not be stored for some reason'
            })
        }

        let paymentMethodData = await PaymentMethod.findOne({
            where: {
                id: paymentData.paymentMethod
            }
        })

        if (!paymentMethodData) {
            return res.status(400).send({
                status: false,
                message: 'Error: Payment method not found'
            })
        }

        const payerId = req.query.PayerID;
        const executePaymentData = {
            payer_id: payerId,
            // transactions: [{
            //     amount: {
            //         currency: "USD",
            //         total: "50.00"
            //     }
            // }]
        };

        paypal.payment.execute(paymentId, executePaymentData, async function (error, payment) {
            if (error) {
                console.log(error)
                return respondWithError(req, res, '', null, 500)
            }
            console.log('success payment', payment);


            let currentDate = moment().unix()

            /**
            * 3 - update account balance
            */
            accountBalance.balance = parseFloat(accountBalance.balance) + parseFloat(paymentData.amount)
            await accountBalance.save()
            /**
             * 3 - update payment data
             */

            await paymentData.update({
                paymentStatus: 'completed'
            })

            /**
             * 4 - create invoice
             */

            let folderName = md5(user.id)

            let storagePath = path.join(__dirname, `../../storage/${folderName}`)
            let storagePathExists = fs.existsSync(storagePath)
            if (!storagePathExists) {
                fs.mkdirSync(storagePath);
            }

			let invoiceHtml = pug.renderFile(path.join(__dirname, '../../views/invoice/index.pug'), {

            })
            let invoiceFilename = `invoice-${currentDate}.pdf`

            pdf.create(invoiceHtml, {
                format: "Letter",        // allowed units: A3, A4, A5, Legal, Letter, Tabloid
                orientation: "portrait", // portrait or landscape
                type: "pdf",           // allowed file types: png, jpeg, pdf
                quality: "75",         // only used for types png & jpeg
            }).toFile(path.join(`${storagePath}/${invoiceFilename}`), async function (error, invoiceFileSaved) {
                if (error) {
                    console.log(error)
                    return respondWithError(req, res, '', null, 500)
                }

                console.log(invoiceFileSaved)
                try {
                    let invoiceId = await invoiceHelper.getInvoiceId()

                    let invoiceSummery = {
                        amount: paymentData.amount,
                        user: user,
						transactionOf: app_constants.TRANSACTION_OF.TOP_UP,
                        paymentMethod: paymentMethodData.slug,
                        transactionData: transactionData,
                        paymentData: paymentMethodData
                    }

                    let savedInvoiceData = await Invoice.create({
                        invoiceId: invoiceId,
                        invoiceSummery: invoiceSummery,
                        file: invoiceFilename
                    })

                    if (!savedInvoiceData) {
                        return res.status(400).send({
                            status: false,
                            message: 'Error: invoice data cannot be saved'
                        })
                    }

                    transactionData.invoiceId = savedInvoiceData.id

                    await transactionData.save()

                    // console.log(invoiceSaved)
                    /**
                     * 5 - send email to user
                     */

                    return res.send({
                        message: "Account Has Been topped up successfully.",
                        balanceAmount: accountBalance.balance
                    })
                } catch (error) {
                    console.log(error)
                    return respondWithError(req, res, '', null, 500)
                }
            })
        });
    } catch (error) {
        console.log(error)
        return respondWithError(req, res, '', null, 500)
    }

}

exports.paypalCancelPayment = async function (req, res) {
    console.log(req.body, req.query, req.params)

    return res.send('Cancelled')
}

// exports.ipnPaypal = async function (req, res) {
//     console.log(req.body, req.query, req.params)
//     console.log("-----success_notification-- start---");
//     paypalIpn.verify(req.body, function (error, payment) {
//         if (error) {
//             console.log("-----success_notification-- error---");
//             console.log(error.response);
//             throw error;
//         } else {
//             console.log("-----success_notification- success----");
//         }
//     });
//     return "Data notification received"
// }

exports.paypalOrderSuccess = async function (req, res) {
    try {
        // console.log(req.query)

        const paymentId = req.query.paymentId;
        console.log('paymentId:', paymentId);

        let paymentData = await Payment.findOne({
            where: {
                paymentStatus: 'pending',
                'paymentSummery.payment.id': paymentId
            },
        })

        if (!paymentData) {
            return res.status(400).send({
                status: false,
                message: 'Payment not found'
            })
        }

        const user = await User.findOne({
            where: {
                id: paymentData.userId
            }
        })

        if (!user) {

            return res.status(400).send({
                status: false,
                message: 'user not found'
            })
        }

        let paymentMethodData = await PaymentMethod.findOne({
            where: {
                id: paymentData.paymentMethod
            }
        })

        if (!paymentMethodData) {

            return res.status(400).send({
                status: false,
                message: 'Error: Payment method not found'
            })
        }

        /**
         * 3.2 getTransaction
         */
        let transactionData = await FinancialAccountTransaction.findOne({
            where: {
                paymentId: paymentData.id
            }
        })

        if (!transactionData || !transactionData.orderId) {
            return res.status(400).send({
                status: false,
                message: 'Error: transaction not found'
            })
        }

        // Get Order Here
        rpcClient.OrderRPC.ConfirmOrder({
            id: transactionData.orderId
        }, (error, respConfirmOrder) => {
            if (error) {
                return respondWithError(req, res, '', null, 500)
            }

            if (!respConfirmOrder || !respConfirmOrder.data) {
                return respondWithError(req, res, '', null, 500)
            }

            let respConfirmOrderJson = JSON.parse(respConfirmOrder.data)
            const payerId = req.query.PayerID;
            const executePaymentData = {
                payer_id: payerId,
                // transactions: [{
                //     amount: {
                //         currency: "USD",
                //         total: "50.00"
                //     }
                // }]
            };


            paypal.payment.execute(paymentId, executePaymentData, async function (error, payment) {
                if (error) {
                    return res.status(500).send({
                        status: false,
                        message: `Error: ${error.response.message}`
                    })
                }

                let currentDate = moment().unix()

                /**
                 * 3 - update payment data
                 */

                await paymentData.update({
                    paymentStatus: 'completed'
                })


                /**
                 * 4 - create invoice
                 */

                let folderName = md5(user.id)

                let storagePath = path.join(__dirname, `../../storage/${folderName}`)
                let storagePathExists = fs.existsSync(storagePath)
                if (!storagePathExists) {
                    fs.mkdirSync(storagePath);
                }

				let invoiceHtml = pug.renderFile(path.join(__dirname, '../../views/invoice/index.pug'), {

                })
                let invoiceFilename = `invoice-${currentDate}.pdf`

                pdf.create(invoiceHtml, {
                    format: "Letter",        // allowed units: A3, A4, A5, Legal, Letter, Tabloid
                    orientation: "portrait", // portrait or landscape
                    type: "pdf",           // allowed file types: png, jpeg, pdf
                    quality: "75",         // only used for types png & jpeg
                }).toFile(path.join(`${storagePath}/${invoiceFilename}`), async function (error, invoiceFileSaved) {
                    if (error) {
                        console.log(error)

                        return respondWithError(req, res, '', null, 500)
                    }

                    try {
                        let invoiceId = await invoiceHelper.getInvoiceId()

                        let invoiceSummery = {
                            amount: paymentData.amount,
                            user: user,
							transactionOf: app_constants.TRANSACTION_OF.ORDER,
                            paymentMethod: paymentMethodData.slug,
                            transactionData: transactionData,
                            paymentData: paymentMethodData
                        }

                        let savedInvoiceData = await Invoice.create({
                            invoiceId: invoiceId,
                            invoiceSummery: invoiceSummery,
                            file: invoiceFilename
                        })

                        if (!savedInvoiceData) {
                            return res.status(400).send({
                                status: false,
                                message: 'Error: invoice data cannot be saved'
                            })
                        }

                        transactionData.invoiceId = savedInvoiceData.id

                        await transactionData.save()


                        /**
                         * #Pending
                         * 5 - send email to user
                         */

                         generalHelper.destroyCart(user.id)

                        return res.send({
                            message: "Order has been placed successfully",
                            data: respConfirmOrderJson
                        })
                    } catch (error) {
                        return respondWithError(req, res, '', null, 500)
                    }


                })
            });
        })

    } catch (error) {
        console.log(error)
        return respondWithError(req, res, '', null, 500)
    }
}

exports.paypalBookingSuccess = async function (req, res) {
    try {
        // console.log(req.query)

        const paymentId = req.query.paymentId;
        console.log('paymentId:', paymentId);

        let paymentData = await Payment.findOne({
            where: {
                paymentStatus: 'pending',
                'paymentSummery.payment.id': paymentId
            },
        })

        if (!paymentData) {
            return res.status(400).send({
                status: false,
                message: 'Payment not found'
            })
        }

        const user = await User.findOne({
            where: {
                id: paymentData.userId
            }
        })

        if (!user) {

            return res.status(400).send({
                status: false,
                message: 'user not found'
            })
        }

        let paymentMethodData = await PaymentMethod.findOne({
            where: {
                id: paymentData.paymentMethod
            }
        })

        if (!paymentMethodData) {

            return res.status(400).send({
                status: false,
                message: 'Error: Payment method not found'
            })
        }

        /**
         * 3.2 getTransaction
         */
        let transactionData = await FinancialAccountTransaction.findOne({
            where: {
                paymentId: paymentData.id
            }
        })

        if (!transactionData || !transactionData.orderId) {
            return res.status(400).send({
                status: false,
                message: 'Error: transaction not found'
            })
        }

        // Get Order Here
        rpcClient.OrderRPC.ConfirmOrder({
            id: transactionData.orderId,
            type: 'booking'
        }, (error, respConfirmOrder) => {
            if (error) {
                return respondWithError(req, res, '', null, 500)
            }

            if (!respConfirmOrder || !respConfirmOrder.data) {
                return respondWithError(req, res, '', null, 500)
            }

            let respConfirmOrderJson = JSON.parse(respConfirmOrder.data)
            const payerId = req.query.PayerID;
            const executePaymentData = {
                payer_id: payerId,
            };


            paypal.payment.execute(paymentId, executePaymentData, async function (error, payment) {
                if (error) {
                    return res.status(500).send({
                        status: false,
                        message: `Error: ${error.response.message}`
                    })
                }

                let currentDate = moment().unix()

                /**
                 * 3 - update payment data
                 */

                await paymentData.update({
                    paymentStatus: 'completed'
                })


                /**
                 * 4 - create invoice
                 */

                let folderName = md5(user.id)

                let storagePath = path.join(__dirname, `../../storage/${folderName}`)
                let storagePathExists = fs.existsSync(storagePath)
                if (!storagePathExists) {
                    fs.mkdirSync(storagePath);
                }

				let invoiceHtml = pug.renderFile(path.join(__dirname, '../../views/invoice/index.pug'), {

                })
                let invoiceFilename = `invoice-${currentDate}.pdf`

                pdf.create(invoiceHtml, {
                    format: "Letter",        // allowed units: A3, A4, A5, Legal, Letter, Tabloid
                    orientation: "portrait", // portrait or landscape
                    type: "pdf",           // allowed file types: png, jpeg, pdf
                    quality: "75",         // only used for types png & jpeg
                }).toFile(path.join(`${storagePath}/${invoiceFilename}`), async function (error, invoiceFileSaved) {
                    if (error) {
                        console.log(error)

                        return respondWithError(req, res, '', null, 500)
                    }

                    try {
                        let invoiceId = await invoiceHelper.getInvoiceId()

                        let invoiceSummery = {
                            amount: paymentData.amount,
                            user: user,
							transactionOf: app_constants.TRANSACTION_OF.BOOKING,
                            paymentMethod: paymentMethodData.slug,
                            transactionData: transactionData,
                            paymentData: paymentMethodData
                        }

                        let savedInvoiceData = await Invoice.create({
                            invoiceId: invoiceId,
                            invoiceSummery: invoiceSummery,
                            file: invoiceFilename
                        })

                        if (!savedInvoiceData) {
                            return res.status(400).send({
                                status: false,
                                message: 'Error: invoice data cannot be saved'
                            })
                        }

                        transactionData.invoiceId = savedInvoiceData.id

                        await transactionData.save()


                        /**
                         * #Pending
                         * 5 - send email to user
                         */

                        generalHelper.destroyCart(user.id)
                        return res.send({
                            message: "Booking has been added successfully",
                            data: respConfirmOrderJson
                        })
                    } catch (error) {
                        return respondWithError(req, res, '', null, 500)
                    }


                })
            });
        })

    } catch (error) {
        console.log(error)
        return respondWithError(req, res, '', null, 500)
    }
}

exports.paypalOrderCancel = async function (req, res) {

}