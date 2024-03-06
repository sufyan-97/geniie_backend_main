
// Libraries
const { Op } = require('sequelize')
const moment = require("moment");

// Constants
const app_constants = require("../Constants/app.constants");


//Helper
const notificationHelper = require('../../helpers/notification_helper');
const generalHelper = require('../../helpers/general_helper');
const rpcClient = require('../../lib/rpcClient')

// Modals
const Promotion = require('../SqlModels/Promotion');
const UserMedia = require('../SqlModels/UserMedia');
const User = require('../SqlModels/User');
const FinancialAccountTransaction = require('../SqlModels/FinancialAccountTransaction');
const Role = require('../SqlModels/Role');
const UserAccountBalance = require('../SqlModels/UserAccountBalance');
const { createPaymentAndTransaction } = require('../../helpers/paymentHelper');
const { sequelize_conn } = require('../../../config/database');
const { stripe } = require('../../lib/stripe');
const BankAccount = require('../SqlModels/BankAccount');
const UserAddress = require('../SqlModels/UserAddress');
const City = require('../SqlModels/City');
exports.promotionStatusUpdate = async function () {
	try {
		let promotionList = await Promotion.findAll({
			where: {
				deleteStatus: false,
			},
		});
		let currentDate = new Date()
		for (const promotion of promotionList) {
			let startDate = promotion.startDate
			let endDate = promotion.endDate
			currentDate = moment(currentDate).utc().format(app_constants.TIMESTAMP_FORMAT);
			startDate = moment(startDate).utc().format(app_constants.TIMESTAMP_FORMAT);
			endDate = moment(endDate).utc().format(app_constants.TIMESTAMP_FORMAT);
			// console.log(`==========================================================================`);
			// console.log(`========================= ${promotion.heading} promotion ===========================`);
			// console.log('===============current Date promotion loop============', currentDate);
			// console.log('===============start Date promotion loop============', startDate);
			// console.log('===============end Date promotion loop============', endDate);
			currentDate = moment(currentDate, app_constants.TIMESTAMP_FORMAT);
			startDate = moment(startDate, app_constants.TIMESTAMP_FORMAT);
			endDate = moment(endDate, app_constants.TIMESTAMP_FORMAT);
			let promotionUpdateData = null;
			if (startDate.isSameOrBefore(currentDate)) {
				let isNeedToUpdate = true;
				if (endDate.isSameOrBefore(currentDate)) {
					if (promotion.status == 'inactive')
						isNeedToUpdate = false
					promotionUpdateData = {
						status: 'inactive',
						deleteStatus: true,
					}
				} else {
					if (promotion.status == 'active')
						isNeedToUpdate = false
					promotionUpdateData = {
						status: 'active'
					}
				}
				if (isNeedToUpdate) {
					console.log(`=============== ${promotion.heading} promotion ${promotionUpdateData.status}============`);
					promotion.update(promotionUpdateData).then(data => {
						// console.log(`=================promotion ${promotionUpdateData.status}=================`);
					}).catch((err) => {
						console.log(err);
					})
				}
			}
		}
	} catch (error) {
		console.log(error);
	}
};

exports.mediaDocumentExpiry = async function () {
	try {
		// console.log('mediaDocumentExpiry')
		let userMedias = await UserMedia.findAll({
			where: {
				deleteStatus: false,
				status: 'active',
			},
			include: [{
				model: User,
				where: {
					deleteStatus: false,
					[Op.not]: {
						status: 'suspended',
					}
				},
				attributes: app_constants.FIELDS.USER,
				required: true,
				include: [{
					model: Role,
					where: {
						isActive: true,
					},
					attributes: ['id', 'roleName'],
					required: true,
				}]
			}]
		})

		// console.log('userMedias=>', userMedias)
		let currentDate = moment().format(app_constants.DATE_FORMAT);

		let usedIds = []

		userMedias.forEach(async (userMedia) => {

			let userId = usedIds.find(a => a == userMedia.user.id)

			let roleName = userMedia.user.roles[0].roleName
			// console.log('userMedia.user.roles[0].roleName=>', userMedia.user.roles[0].roleName)
			let eventName = ''
			if (roleName === 'rider') {
				eventName = app_constants.SOCKET_EVENTS.BROADCAST_RIDER_NOTIFICATION
			}
			else if (roleName === 'provider') {
				eventName = app_constants.SOCKET_EVENTS.BROADCAST_PROVIDER_NOTIFICATION
			}

			let diff10Day = moment(userMedia?.expiryDate).subtract(10, 'd').format(app_constants.DATE_FORMAT)
			let diff5Day = moment(userMedia?.expiryDate).subtract(5, 'd').format(app_constants.DATE_FORMAT)
			let diff0Day = moment(userMedia?.expiryDate).format(app_constants.DATE_FORMAT)
			if (userMedia.expiryDate && (currentDate === diff10Day || currentDate === diff5Day)) {

				await notificationHelper.saveAndSendNotification('webSocket', eventName, [userMedia.user.id], 'Document Expired!', 'Your document has been expired', 'asaap-restaurant', 'user', userMedia)

			}
			else if (userMedia.expiryDate && currentDate === diff0Day) {
				if (!userId) {
					usedIds.push(userMedia.user.id)

					if (roleName === 'rider') {
						await User.update(
							{
								status: 'suspended',
								suspendedBy: 'system',
								suspendSlug: 'documentExpiry',
								suspendReason: 'account suspended due to document expiry',
							},
							{
								where: {
									id: userMedia.user.id,
								}
							}
						)
					}
					else if (roleName === 'provider') {

						let providerAccountSuspendData = {
							status: 'suspended',
							suspendedBy: 'system',
							suspendSlug: 'documentExpiry',
							suspendReason: 'account suspended due to document expiry',
						}

						let providerReferenceAccountSuspendData = {
							status: 'suspended',
							suspendedBy: 'system',
							suspendSlug: 'providerDocumentExpiry',
							suspendReason: 'account suspended due to provider document expiry',
						}

						await generalHelper.suspendProviderAndAllItsReferences(userMedia.user.id, providerAccountSuspendData, providerReferenceAccountSuspendData)
					}
				}

				// await notificationHelper.saveAndSendNotification('webSocket', eventName, [userMedia.user.id], 'Document Expired!', 'Your document has been expired', 'asaap-restaurant', 'user', userMedia)
			}
		})


		// console.log(userMedias[0].user)
	} catch (error) {
		console.log(error)
	}
}


exports.restaurantBillingCycle = async function () {
	// const accounts = await stripe.accounts.list({
	// 	limit: 25,
	// });
	// console.log(accounts)

	// accounts.data.map(async item => {
	// 	let deleted = await stripe.accounts.del(
	// 		item.id
	// 	);
	// 	console.log(
	// 		deleted
	// 	)
	// })

	// return
	try {

		let endDate = moment()

		User.findAll({
			where: {
				deleteStatus: false
			},
			include: [{
				model: FinancialAccountTransaction,
				where: {
					transactionOf: "payroll"
				},
				required: false
			},
			{
				model: Role,
				where: {
					roleName: "restaurant"
				},
				required: true
			},
			{
				model: UserAccountBalance,
				as: "accountBalance"
			},
			{
				model: BankAccount,
			},
			{
				model: UserAddress,
				include: City,
				required: true
			},
			]
		}).then(users => {
			if (users && users.length) {
				let dataToFetch = {}
				let userDataItems = {}
				users.map(item => {
					let startDate = null
					let lastTransaction = null
					if (item.financial_account_transactions && item.financial_account_transactions.length) {
						lastTransaction = item.financial_account_transactions[0]
						startDate = moment(lastTransaction.createdAt)
					}
					dataToFetch[item.id] = { startDate: startDate, endDate: endDate }
					userDataItems[item.id] = item
				})

				if (Object.keys(dataToFetch).length) {
					rpcClient.OrderRPC.GetRestaurantOrders({
						usersFiltersData: JSON.stringify(dataToFetch)
					}, function (error, restaurantRespData) {
						// console.log(error, dataToFetch)
						if (error) {
							console.log(error);
							return
						}

						if (restaurantRespData.status) {
							if (restaurantRespData.usersOrdersData) {
								let usersOrdersData = JSON.parse(restaurantRespData.usersOrdersData)
								let orderUsers = Object.keys(usersOrdersData)
								// console.log(orderUsers)
								if (orderUsers.length) {
									orderUsers.map(async item => {
										let userOrdersData = usersOrdersData[item]
										// console.log(userOrdersData)
										if (userOrdersData.orders && userOrdersData.orders.length) {
											let restaurantName = ""
											let orders = userOrdersData.orders
											// console.log(orders.length, userDataItems[item].id)
											let totalOrdersPriceToPay = 0
											let cashOnDeliveryAmount = 0
											orders.map(orderData => {
												// console.log(orderData.orderSummary.total)
												restaurantName = orderData.restaurant.name
												if (orderData.orderSummary.paymentMethod.slug === 'cash_payment') {
													cashOnDeliveryAmount += orderData.orderSummary.total
												} else {
													totalOrdersPriceToPay += orderData.orderSummary.total
												}
											})
											let user = userDataItems[item]
											let billingCycle = dataToFetch[item]
											// console.log(orders[0])
											// if()
											// console.log(totalOrdersPriceToPay, user.accountBalance)
											let netBalance = parseFloat(totalOrdersPriceToPay) + parseFloat(user.accountBalance.balance) - parseFloat(cashOnDeliveryAmount) - parseFloat(parseFloat(totalOrdersPriceToPay) * 0.1) - (parseFloat(totalOrdersPriceToPay) * 0.2)
											// console.log(netBalance, user.accountBalance.balance)
											// if (netBalance > 0) {
											let data = {
												ordersData: { noOfOrders: orders.length },
												restaurantName: restaurantName,
												invoiceStatus: "Paid",
												estimatedDateOfPayout: moment().add(3, "days").format("YYYY-MM-DD"),
												accountEndingNumbers: user.bank_account ? user.bank_account.accountNumber ? user.bank_account.accountNumber.substr(user.bank_account.accountNumber.length - 4) : "1234" : "1234",
												cashOnDeliveryAmount: parseFloat(cashOnDeliveryAmount),
												totalOrdersPriceToPay: parseFloat(totalOrdersPriceToPay),
												currentBalance: parseFloat(user.accountBalance.balance),
												genieeFee: parseFloat(totalOrdersPriceToPay) * 0.1,
												vat: parseFloat(totalOrdersPriceToPay) * 0.2,
												netBalance: netBalance,
												billingCycle: billingCycle,
												genieePercentage: "10%",
												vatPercentage: "20%",
											}
											console.log(data)
											let createPaymentData = {
												userId: user.id,
												paymentSummary: data,
												amount: netBalance,
												transactionOf: 'payroll',
												transactionData: data,
												user: user
											}
											// console.log(user)
											let sequelizeTransaction = await sequelize_conn.transaction();

											let response = await createPaymentAndTransaction(sequelizeTransaction, createPaymentData)
											// console.log(netBalance, response)
											if (netBalance > 0) {
												user.accountBalance.balance = 0
												let account = null
												if (!user.stripeAccountId) {
													try {
														var createdDateTimestamp = moment(user.createdAt).unix();
														var check = moment(user.dob, 'YYYY-MM-DD');

														var month = check.format('M');
														var day = check.format('D');
														var year = check.format('YYYY');
														account = await stripe.accounts.create({
															type: 'custom',
															country: 'GB',
															email: user.email,
															capabilities: { card_payments: { requested: true }, transfers: { requested: true } },
															business_type: 'individual',
															business_profile: { url: 'https://genii.uk', mcc: 5812 },
															individual: {
																first_name: "Hamza",
																last_name: "Dawood",
																dob: {
																	day: day,
																	month: month,
																	year: year
																},
																address: {
																	line1: users[0].user_addresses[0].address,
																	postal_code: users[0].user_addresses[0].postCode,
																	city: users[0].user_addresses[0].city.name
																},
																email: user.email,
																phone: user.phoneNumber
															},

															// "representative.first_name": "Hamza",
															// "representative.last_name": "Dawood",
															// "representative.address.city": "Newcastle upon Tyne",
															// "representative.address.line1": "2 St Edmunds Road ",
															// "representative.address.postal_code": "NE8 4AX",
															// "representative.dob.day": "14",
															// "representative.dob.month": "01",
															// "representative.dob.year": "1996",
															// "representative.email": "hamza.dawood007@gmail.com",

															"tos_acceptance": { date: createdDateTimestamp, ip: "13.112.224.240" }
														});

													} catch (error) {
														console.log(error)
													}

													if (account && user.bank_account) {
														user.stripeAccountId = account.id
														try {
															const bankAccount = await stripe.accounts.createExternalAccount(
																account.id,
																{
																	external_account: {
																		"object": "bank_account",
																		"account_holder_name": user.bank_account.holderName,
																		"account_holder_type": "company",
																		// "bank_name": "STRIPE TEST BANK",
																		"country": "GB",
																		"currency": "GBP",
																		"account_number": user.bank_account.accountNumber,
																		"routing_number": user.bank_account.sortCode,
																	}
																}
															);

														} catch (error) {
															console.log(error)
														}
													}
												} else {
													try {
														account = await stripe.accounts.retrieve(
															user.stripeAccountId
														);
													} catch (error) {
														console.log(error)
													}
												}
												if (account) {
													try {
														const transfer = await stripe.transfers.create({
															amount: netBalance * 100,
															currency: 'gbp',
															destination: user.stripeAccountId,
															transfer_group: `STATEMENT_${billingCycle.startDate ? billingCycle.startDate : ''}_${billingCycle.endDate ? billingCycle.endDate : ''}`,
														});
													} catch (error) {
														console.log(error)
													}
												}

											} else {
												user.accountBalance.balance = user.accountBalance.balance + netBalance
											}
											if (response.status) {
												await user.save()
												await user.accountBalance.save()
												await sequelizeTransaction.commit()
											}
										}
									})
								}
							}
						}
					})
				} else {
					return sequelizeTransaction.rollback()
				}
			}
		}).catch(error => {
			console.log(error)
			// return sequelizeTransaction.rollback()
		})



		// `Order.findAll({
		// 	where: {
		// 		createdAt: {
		// 			[Op.or]: [{
		// 				[Op.gte]: startDate
		// 			},
		// 			{
		// 				[Op.lte]: endDate

		// 			}]
		// 		},
		// 	},
		// 	include: [{
		// 		model: OrderStatus,
		// 		where: {
		// 			slug: "completed"
		// 		},
		// 		required: true
		// 	}, {
		// 		model: Restaurant,
		// 		required: true
		// 	}]
		// }).then(items => {
		// 	console.log(items[0])
		// }).catch(error => {
		// 	console.log(error)
		// })`
	} catch (error) {
		console.log(error)
	}
}