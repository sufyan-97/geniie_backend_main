//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

// Libraries
const { Op } = require('sequelize')
const moment = require("moment");

// Custom Libraries
const rpcClient = require('../../lib/rpcClient')
const emailQueue = require('../../lib/emailWorker');


// Helpers
const general_helper = require('../../helpers/general_helper');


// Modals
const Promotion = require('../SqlModels/Promotion');
const Service = require('../SqlModels/Service');
const PromotionCategory = require('../SqlModels/PromotionCategory');
const TermAndCondition = require('../SqlModels/TermAndCondition');
const PromotionTermAndCondition = require('../SqlModels/PromotionTermAndCondition');
const City = require('../SqlModels/City');
const User = require('../SqlModels/User');
const Role = require('../SqlModels/Role');

// Constants
const constants = require('../Constants/app.constants');

exports.getAll = async function (req, res) {
	try {
		let user = req.user;
		if (user.roleName !== 'admin') {
			return res.status(400).send({
				status: false,
				message: "Error: method not allowed"
			})
		}

		Promotion.findAll({
			where: {
				deleteStatus: false
			},
			include: [
				{
					model: Service,
					where: {
						deleteStatus: false,
					},
				},
				{
					model: PromotionCategory,
					attributes: ['categoryId'],
					required: false,
				},
				{
					model: TermAndCondition,
					through: { attributes: [] },
					where: {
						deleteStatus: false,
					},
					attributes: ['id', 'detail'],
					required: false,
				},
			]
		}).then(promotions => {
			if (promotions && promotions.length) {
				return res.send({
					message: 'Data fetched successfully.',
					data: promotions
				})
			} else {
				return res.send({
					message: 'No data found.',
					data: []
				})
			}
		}).catch(err => {
			console.log(err);
			return respondWithError(req, res, '', null, 500)
		})
	} catch (error) {
		console.log(error)
	}
}

exports.getUserSpecificPromotions = async function (req, res) {
	try {

		let user = req.user;

		let serviceSlug = req.query.serviceSlug
		let branchId = req.query.branch

		let checkService = await Service.findOne({
			where: {
				slug: serviceSlug
			}
		})

		if (!checkService) {
			return res.status(400).send({
				status: false,
				message: 'Error: service not found'
			})
		}

		let promotions = await Promotion.findAll({
			where: {
				serviceId: checkService.id,
				deleteStatus: false,
			},
			include: [
				{
					model: Service,
					where: {
						deleteStatus: false,
					},
				},
				{
					model: PromotionCategory,
					attributes: ['categoryId'],
					required: false,
				},
				{
					model: TermAndCondition,
					through: { attributes: [] },
					where: {
						deleteStatus: false,
					},
					required: false,
				},
			]
		})

		// calling rpc for Service Data
		const getServiceInfo = () => {
			return new Promise((resolve, reject) => {
				try {
					rpcClient.RestaurantAppService.getServiceInfo({}, function (error, rpcResponseData) {
						if (error) return reject(error)
						return resolve(rpcResponseData)
					})
				} catch (error) {
					console.log(error);
					return reject(error)
				}
			})
		}

		let serviceData = await getServiceInfo()
		let serviceCategories = JSON.parse(serviceData.data)
		serviceCategories = serviceCategories.dashboardCards

		promotions = promotions.map((promotion) => {
			let allowedCategories = []
			for (let j = 0; j < promotion.promotion_categories.length; j++) {
				let promotionCategory = promotion.promotion_categories[j]
				let category = serviceCategories.find(a => a.id == promotionCategory.categoryId)
				if (category)
					allowedCategories.push(category)
			}

			promotion.service.service_categories = allowedCategories
			// console.log('before=>',promotion.promotion_categories)
			// delete promotion.promotion_categories
			// console.log('after=>',promotion.promotion_categories)
			return promotion
		});
		// console.log(promotions)

		rpcClient.RestaurantService.getAllRestaurant({
			type: '',
			id: [branchId]
		}, async (error, restaurantRespData) => {
			if (error) {
				console.log(error);
				return respondWithError(req, res, '', null, 500)
			}

			let promotionData = []
			let restaurants = JSON.parse(restaurantRespData.data)
			console.log('restaurants =>', restaurants);

			if (restaurants && restaurants.length) {
				for (let promotion of promotions) {
					promotion = promotion.toJSON()

					if (promotion.area === 'specific') {
						let allowedRegion = JSON.parse(promotion.allowedRegion)

						if (allowedRegion?.countryId) {
							let promotionCoordinates = []
							for (let i = 0; i < allowedRegion.cityIds.length; i++) {

								let cityCoordinates = await City.findOne({
									where: {
										id: allowedRegion.cityIds[i]
									},
									attributes: ["id"]
								})
								cityCoordinates = cityCoordinates.toJSON()

								if (Number(restaurants[0].city) == Number(cityCoordinates.id)) {

									promotionData.push({
										...promotion,
										restaurants: restaurants[0]
									})
								}

								promotionCoordinates.push(cityCoordinates.id)
							}

						}

					} else {
						promotionData.push({
							...promotion,
							restaurants: restaurants[0]
						})
					}

				}
			}
			if (promotionData.length) {
				return res.send({
					status: true,
					data: promotionData
				})
			} else {
				return res.send({
					status: true,
					data: promotionData,
					message: "No promotion available for your restaurant."
				})
			}

		})

	} catch (error) {
		console.log(error);
		return respondWithError(req, res, '', null, 500)
	}

}

exports.createPromotion = async function (req, res) {

	try {
		let timezone = req.header('timezone');
		let payload = req.body.match;
		let categoryIds = payload.categoryIds;
		let termIds = payload.termIds;

		let user = req.user;
		if (user.roleName !== 'admin') {
			return res.status(405).send({
				status: false,
				message: "Error: method not allowed"
			})
		}

		// checking if Service not exist
		let isServiceExist = await Service.findOne({ where: { id: payload.serviceId, isActive: true, deleteStatus: false } })
		if (!isServiceExist) {
			return res.status(400).send({
				message: 'service not found.'
			})
		}

		// calling rpc for Service Data
		const getServiceInfo = () => {
			return new Promise((resolve, reject) => {
				try {
					rpcClient.RestaurantAppService.getServiceInfo({}, function (error, rpcResponseData) {
						if (error) return reject(error)
						return resolve(rpcResponseData)
					})
				} catch (error) {
					console.log(error);
					return reject(error)
				}
			})
		}

		let serviceData = await getServiceInfo()
		let serviceCategories = JSON.parse(serviceData.data)
		serviceCategories = serviceCategories.dashboardCards

		// checking if category not exist
		for (let i = 0; i < categoryIds.length; i++) {
			let categoryId = categoryIds[i]
			let isDashboardCardExist = serviceCategories.find(a => a.id == categoryId)
			if (!isDashboardCardExist) {
				return res.status(400).send({
					message: `dashboard card id ${categoryId} not found.`
				})
			}
		}

		// checking if term and condition not exist
		let termAndConditions = await TermAndCondition.findAll({
			where: {
				id: {
					[Op.in]: termIds,
				},
				deleteStatus: false,
			},
		})
		for (let i = 0; i < termIds.length; i++) {
			let termId = termIds[i]
			let isTermExist = termAndConditions.find(a => a.id == termId)
			if (!isTermExist) {
				return res.status(400).send({
					message: `Term id ${termId} not found.`
				})
			}
		}

		// format start and end date
		payload.startDate = moment(payload.startDate).format(constants.TIMESTAMP_FORMAT);
		payload.endDate = moment(payload.endDate).format(constants.TIMESTAMP_FORMAT);
		let startDate = moment(payload.startDate, constants.TIMESTAMP_FORMAT);
		let endDate = moment(payload.endDate, constants.TIMESTAMP_FORMAT);
		if (endDate.isSameOrBefore(startDate)) {
			return res.status(400).send({
				message: 'end date must be greater than start date'
			})
		}
		payload.startDate = moment.tz(payload.startDate, timezone).utc().format(constants.TIMESTAMP_FORMAT);
		payload.endDate = moment.tz(payload.endDate, timezone).utc().format(constants.TIMESTAMP_FORMAT);

		// saving image to path and getting image name
		if (req.files && req.files.coverImage) {
			let imageData = await general_helper.uploadImage(req.files.coverImage, 'promotion')
			if (imageData.status) {
				payload.coverImage = constants.FILE_PREFIX + imageData.imageName;
			} else {
				return res.status(imageData.statusCode).send({
					message: imageData.message
				})
			}
		} else {
			return res.status(422).send({
				message: 'Invalid Data',
			})
		}

		let postData = new Promotion(payload)

		await postData.save();

		// add Category Ids to promotion Categories table
		for (let i = 0; i < categoryIds.length; i++) {
			let item = categoryIds[i]
			await PromotionCategory.create({
				promotionId: postData.id,
				categoryId: item,
			})
		}

		// add term and condition Ids to promotion terms table
		for (let i = 0; i < termIds.length; i++) {
			let item = termIds[i]
			await PromotionTermAndCondition.create({
				promotionId: postData.id,
				termId: item,
			})
		}

		let promotion = await Promotion.findOne({
			where: {
				id: postData.id,
			},
			include: [
				{
					model: Service,
					where: {
						deleteStatus: false,
					},
				},
				{
					model: PromotionCategory,
					attributes: ['categoryId'],
					required: false,
				},
				{
					model: TermAndCondition,
					through: { attributes: [] },
					where: {
						deleteStatus: false,
					},
					attributes: ['id', 'detail'],
					required: false,
				},
			]
		})

		// const getAllRestaurant = (ids) => {
		// 	return new Promise((resolve, reject) => {
		// 		try {
		// 			rpcClient.RestaurantService.getAllRestaurant({
		// 				type: 'cityWiseData',
		// 				id: ids
		// 			}, function (error, rpcResponseData) {
		// 				if (error) return reject(error)
		// 				return resolve(rpcResponseData)
		// 			})
		// 		} catch (error) {
		// 			console.log(error);
		// 			return reject(error)
		// 		}
		// 	})
		// }

		// try {
		// 	let restaurantRespData = await getAllRestaurant(cityIds)
		// 	let restaurants = JSON.parse(restaurantRespData.data)
		// } catch (error) {
		// 	console.log(error)
		// }
		if (payload.area != 'specific') {
			let users = await User.findAll({
				where: {
					status: 'active',
					deleteStatus: false,
				},
				attributes: ['id', 'email', 'username'],
				include: [
					{
						model: Role,
						where: {
							roleName: 'provider'
						}
					}
				]
			})
			let emails = []
			users.map((item, i) => {
				emails.push({
					name: `Create Promotion ${i}`,
					data: {
						subject: "Geniie Promotion",
						to: item.email,
						template: 'business/promotion.pug',
						templateData: {}
					}
				})
			})
			emailQueue.addBulk(emails)
		}
		else {
			let cityIds = []
			cityIds = payload.allowedRegion.cityIds.map(Number)
			rpcClient.RestaurantService.getAllRestaurant({
				type: 'cityWiseData',
				id: cityIds
			}, async function (error, rpcResponseData) {
				if (error) return reject(error)

				let restaurants = JSON.parse(rpcResponseData.data)

				let providerIds = []
				restaurants.forEach(item => {
					providerIds.push(item.providerId)
				});

				let users = await User.findAll({
					where: {
						status: 'active',
						deleteStatus: false,
						id: { [Op.in]: providerIds },
					},
					attributes: ['id', 'email', 'username']
				})

				let emails = []
				users.map((item, i) => {
					emails.push({
						name: `Create Promotion ${i}`,
						data: {
							subject: "Geniie Promotion",
							to: item.email,
							template: 'business/promotion.pug',
							templateData: {}
						}
					})
				})
				emailQueue.addBulk(emails)
			})
		}



		return res.status(200).send({
			message: 'Promotion has been created successfully.',
			data: promotion
		})
	} catch (error) {
		console.log(error);
		return respondWithError(req, res, '', null, 500)
	}

}

exports.updatePromotion = async function (req, res) {

	let timezone = req.header('timezone');
	let id = req.body.id
	let categoryIds = req.body.categoryIds
	let termIds = req.body.termIds
	let startDate = req.body.startDate
	let endDate = req.body.endDate

	if (req.user.roles[0].roleName != 'admin') {
		return res.status(405).send({
			message: 'Error: method not allowed',
		})
	}

	try {

		// format start and end date
		startDate = moment(startDate).format(constants.TIMESTAMP_FORMAT);
		endDate = moment(endDate).format(constants.TIMESTAMP_FORMAT);
		startDate = moment(startDate, constants.TIMESTAMP_FORMAT);
		endDate = moment(endDate, constants.TIMESTAMP_FORMAT);
		if (endDate.isSameOrBefore(startDate)) {
			return res.status(400).send({
				message: 'end date must be greater than start date'
			})
		}
		// console.log('req.body.startDate=>', req.body.startDate)
		// console.log('req.body.endDate=>', req.body.endDate)
		startDate = moment.tz(req.body.startDate, timezone).utc().format(constants.TIMESTAMP_FORMAT);
		endDate = moment.tz(req.body.endDate, timezone).utc().format(constants.TIMESTAMP_FORMAT);
		// console.log('endDate=>', endDate)


		let updateData = {
			id: req.body.id,
			title: req.body.title,
			coverImage: req.body.coverImage,
			heading: req.body.heading,
			serviceId: req.body.serviceId,
			discountType: req.body.discountType,
			discountValue: req.body.discountValue,
			startDate,
			endDate,
			area: req.body.area,
			status: req.body.status,
			allowedRegion: req.body.allowedRegion ? req.body.allowedRegion : null,
		}

		if (req.files && req.files.coverImage) {
			let imageData = await general_helper.uploadImage(req.files.coverImage, 'promotion')
			if (imageData.status) {
				updateData.coverImage = constants.FILE_PREFIX + imageData.imageName;
			} else {
				return res.status(imageData.statusCode).send({
					message: imageData.message
				})
			}
		}

		Promotion.findOne({ where: { id: id, deleteStatus: false } }).then(async item => {
			if (!item) {
				return res.status(400).send({
					message: 'Promotion not found against given id.',
				})
			} else {
				Promotion.update(updateData, {
					where: {
						id: id
					}
				}).then(async data => {
					if (data && data[0]) {
						// updating, adding, deleting categories to promotion categories table
						let savedPromotionCategories = await PromotionCategory.findAll({ where: { promotionId: id } })
						for (let i = 0; i < savedPromotionCategories.length; i++) {
							let savedPromotionCategory = savedPromotionCategories[i]
							let index = categoryIds.findIndex(a => a == savedPromotionCategory.categoryId);
							if (index >= 0) {
								categoryIds.splice(index, 1);
							} else {
								await savedPromotionCategory.destroy();
							}
						}
						for (let i = 0; i < categoryIds.length; i++) {
							let item = categoryIds[i]
							await PromotionCategory.create({
								promotionId: id,
								categoryId: item,
							})
						}

						// updating, adding, deleting terms to promotion term table
						let savedPromotionTerms = await PromotionTermAndCondition.findAll({ where: { promotionId: id } })
						for (let i = 0; i < savedPromotionTerms.length; i++) {
							let savedPromotionTerm = savedPromotionTerms[i]
							let index = termIds.findIndex(a => a == savedPromotionTerm.termId);
							if (index >= 0) {
								termIds.splice(index, 1);
							} else {
								await savedPromotionTerm.destroy();
							}
						}
						for (let i = 0; i < termIds.length; i++) {
							let item = termIds[i]
							await PromotionTermAndCondition.create({
								promotionId: id,
								termId: item,
							})
						}

						let updatedData = await Promotion.findOne({
							where: {
								id
							},
							include: [
								{
									model: Service,
									where: {
										deleteStatus: false,
									},
								},
								{
									model: PromotionCategory,
									attributes: ['categoryId'],
									required: false,
								},
								{
									model: TermAndCondition,
									through: { attributes: [] },
									where: {
										deleteStatus: false,
									},
									attributes: ['id', 'detail'],
									required: false,
								},
							]
						})
						return res.send({
							message: 'Data has been updated successfully.',
							data: updatedData
						})
					} else {
						return res.status(400).send({
							message: 'Unable to update data. Data not found.',
						})
					}
				}).catch(err => {
					console.log(err);
					return respondWithError(req, res, '', null, 500)
				})

			}
		})

	} catch (error) {
		console.log(error);
		return respondWithError(req, res, '', null, 500)
	}
}

exports.deletePromotion = async function (req, res) {
	let id = req.params.id

	if (req.user.roles[0].roleName != 'admin') {
		return res.status(405).send({
			message: 'Error: method not allowed',
		})
	}

	Promotion.update({ deleteStatus: true }, {
		where: {
			id: id,
			deleteStatus: false
		},
	}).then(data => {
		if (data && data[0]) {
			return res.send({
				message: 'Promotion has been deleted successfully.',
			})
		} else {
			return res.status(400).send({
				message: 'Unable to delete data. Data not found.',
			})
		}
	}).catch(err => {
		console.log(err);
		return respondWithError(req, res, '', null, 500)
	})
}

exports.changeAvailability = async function (req, res) {
	let id = req.body.id
	let status = req.body.status ? 'active' : 'inactive'

	let isPromotionExist = await Promotion.findOne({ where: { id, deleteStatus: false } })
	if (!isPromotionExist) {
		return res.status(400).send({
			message: 'promotion not found.',
		})
	} else if (isPromotionExist.status == status) {
		return res.status(400).send({
			message: `promotion status already ${status}.`,
		})
	}
	Promotion.update({ status: status }, {
		where: {
			id
		},
	}).then(data => {
		if (data && data[0]) {
			return res.send({
				message: `Promotion marked as ${status} successfully.`,
			})
		} else {
			return res.status(400).send({
				message: 'Unable to update status. Data not found.',
			})
		}
	}).catch(err => {
		console.log(err);
		return respondWithError(req, res, '', null, 500)
	})
}

exports.apply = async function (req, res) {
	let user = req.user
	let promoCode = req.body.promoCode
	Promotion.findOne({
		where: {
			promoCode: promoCode,
			deleteStatus: false,
			status: 'active',
			remainingLimit: {
				[Op.gt]: 0
			}
		},
		include: {
			model: PromoHistory,
			where: {
				userId: user.id
			},
			required: false
		}
	}).then(data => {
		if (data && data) {
			if (data.promo_histories && data.promo_histories.length < data.userMaxUseLimit) {

				let restaurantMicroService = MICRO_SERVICES.find(item => item.title === 'restaurant')
				let stringifyUser = JSON.stringify(req.user)
				req.headers['user'] = stringifyUser
				axios.post(`${restaurantMicroService.protocol}://${restaurantMicroService.microserviceBaseUrl}:${restaurantMicroService.port}/cart/promo/apply`,
					data.toJSON(),
					{ headers: { user: req.headers['user'], authorization: req.headers['authorization'] } }
				).then(response => {
					PromoHistory.create({
						userId: user.id,
						promoCodeId: data.id
					})

					data.remainingLimit = data.remainingLimit - 1
					data.save()

					return res.status(response.status).send(response.data)
					// return res.send({
					//     message: 'Data fetched successfully.',
					//     data: data[0]
					// })
				}).catch(err => {
					if (!err.response) {
						return respondWithError(req, res, '', null, 500)
					};
					return res.status(err.response.status).send(err.response.data)
				})
			} else {
				return res.status(400).send({
					message: 'Maximum limit to use this promo code is exceeded.',
				})
			}
		} else {
			return res.status(400).send({
				message: 'Promo Code not available for use.',
			})
		}
	}).catch(err => {
		console.log(err);
		return respondWithError(req, res, '', null, 500)
	})
}

exports.remove = async function (req, res) {
	let promoCode = req.body.promoCode
	Promotion.findAll({
		where: {
			promoCode: promoCode,
			deleteStatus: false,
			status: 'active'
		}
	}).then(data => {
		if (data && data.length) {
			let restaurantMicroService = MICRO_SERVICES.find(item => item.title === 'restaurant')
			let stringifyUser = JSON.stringify(req.user)
			req.headers['user'] = stringifyUser
			axios.post(`${restaurantMicroService.protocol}://${restaurantMicroService.microserviceBaseUrl}:${restaurantMicroService.port}/cart/promo/remove`,
				data[0].toJSON(),
				{ headers: { user: req.headers['user'], authorization: req.headers['authorization'] } }
			).then(data => {
				// console.log(data.status, data.data);
				return res.status(data.status).send(data.data)

				return res.send({
					message: 'Data fetched successfully.',
					data: data[0]
				})
			}).catch(err => {
				if (!err.response) {
					return respondWithError(req, res, '', null, 500)
				};
				return res.status(err.response.status).send(err.response.data)
			})

		} else {
			return res.status(400).send({
				message: 'Unable to fetch item.',
			})
		}
	}).catch(err => {
		console.log(err);
		return respondWithError(req, res, '', null, 500)
	})
}
