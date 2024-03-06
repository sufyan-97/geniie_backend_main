// Libraries
const { Op } = require('sequelize')
const { default: axios } = require('axios');

// Custom Libraries
const rpcClient = require('../../lib/rpcClient')

// Modals
const Modal = require('../SqlModels/PromoCode');
const PromoHistory = require('../SqlModels/PromoHistory');

// Helpers
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')
const general_helper = require('../../helpers/general_helper');

// constants
const { MICRO_SERVICES } = require('../../../config/constants');
const appConstants = require('../Constants/app.constants');


exports.getAll = async function (req, res) {
    Modal.findAll({
        where: {
            promoType: 'area',
            deleteStatus: false
        }
    }).then(data => {
        if (data && data.length) {
            return res.send({
                message: 'Data fetched successfully.',
                data: data
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
}

exports.getOne = async function (req, res) {
    let id = req.params.id
    Modal.findAll({
        where: {
            [Op.and]: [
                {
                    id: id
                },
                {
                    deleteStatus: false
                }
            ]
        }
    }).then(data => {
        if (data && data.length) {
            return res.send({
                message: 'Data fetched successfully.',
                data: data[0]
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

exports.post = async function (req, res) {

    let payload = req.body.match;
    if (!payload.allowedRegion.countryId)
        payload.allowedRegion = null
    // let allowedRegion = { countryId: payload.countryId, stateIds: payload.stateIds, cityIds: payload.cityIds }

    payload = { ...payload, remainingLimit: payload.maxUseLimit }

    let postData = new Modal(payload)

    postData.save().then(async postedData => {
        let promoCode = await Modal.findOne({
            where: {
                id: postedData.id,
            }
        })
        return res.status(200).send({
            message: 'Promo Code has been added successfully.',
            data: promoCode
        })
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })

}

exports.update = async function (req, res) {

    let id = req.body.id

    let promoCode = await Modal.findOne({ where: { id }, attributes: ['maxUseLimit', 'remainingLimit'] })

    let remainingLimit = promoCode.maxUseLimit - promoCode.remainingLimit
    remainingLimit = req.body.maxUseLimit - remainingLimit

    let updateData = {
        name: req.body.name,
        discount: req.body.discount,
        promoCode: req.body.promoCode,
        type: req.body.type,
        status: req.body.status,
        maxUseLimit: req.body.maxUseLimit,
        userMaxUseLimit: req.body.userMaxUseLimit,
        remainingLimit: remainingLimit,
        minOrderLimit: req.body.minOrderLimit,
        maxDiscount: req.body.maxDiscount,
        // expiryDate: req.body.expiryDate,
        // allowedRegion: req.body.allowedRegion
    }

    let additionalCheck = {}

    if (req.body.expiryDate)
        additionalCheck.expiryDate = req.body.expiryDate

    additionalCheck.allowedRegion = req.body.allowedRegion != "null" ? req.body.allowedRegion : null

    updateData = { ...updateData, ...additionalCheck }

    Modal.findOne({ where: { promoCode: req.body.promoCode, [Op.not]: { id: id } } }).then(async item => {
        if (item) {
            return res.status(400).send({
                message: 'Promo with same code is already added.',
            })
        } else {
            Modal.update(updateData, {
                where: {
                    id: id,
                    deleteStatus: false
                }
            }).then(async data => {
                if (data && data[0]) {
                    let updatedData = await Modal.findOne({ where: { id } })
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
}

exports.delete = async function (req, res) {
    let id = req.params.id
    Modal.update({ deleteStatus: true }, {
        where: {
            id: id,
            deleteStatus: false
        },
    }).then(data => {
        if (data && data[0]) {
            return res.send({
                message: 'Promo Code has been deleted successfully.',
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

exports.apply = async function (req, res) {
    let user = req.user
    let promoCode = req.body.promoCode
    Modal.findOne({
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

                // let stringifyUser = JSON.stringify(req.user)
				// req.headers['user'] = stringifyUser

				rpcClient.RestaurantService.applyPromo({
					userData: JSON.stringify(req.user),
					promoData: JSON.stringify(data.toJSON()),
					geoLocationData: req.headers['geolocation']
				}, function (error, applyPromoCodeResponse) {
					if (error) {
						console.log(error)
						return respondWithError(req, res, '', null, 500)
					}

					// console.log(JSON.parse(applyPromoCodeResponse.data));
					PromoHistory.create({
						userId: user.id,
						promoCodeId: data.id
					})

					data.remainingLimit = data.remainingLimit - 1
					data.save()

					return res.status(200).send(JSON.parse(applyPromoCodeResponse.data))

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
    Modal.findAll({
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
