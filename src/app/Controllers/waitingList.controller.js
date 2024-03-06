const { Op } = require('sequelize');
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper.js');
//Models
const WaitingList = require('../SqlModels/WaitingList.js')
const Subscriber = require('../SqlModels/Subscriber')
const PromoCode = require('../SqlModels/PromoCode.js');

exports.addWaitingList = async function (req, res) {
	try {
		const { firstName, lastName, email, mobileNumber } = req.body;
		let clientAgent = req.headers["user-agent"];

		let existingWaitingList = await WaitingList.findOne({
			where: {
				[Op.or]: [
					{
						mobileNumber: mobileNumber
					},
					{
						email: email
					}
				],
			}
		})

		if (existingWaitingList) {
			return res.status(400).send({
				status: false,
				message: 'You have already availed the promo code.'
			})
		}

		let waitingList = {
			whatsappNumber: req.body.whatsappNumber ? req.body.whatsappNumber : null,
		}

		if (req.body.showUpdates) {
			let [existingSubscriber, newSubscriber] = await Subscriber.findOrCreate({
				where: {
					email: email,
					deleteStatus: false
				},
				defaults: {
					email: email
				}
			})
			console.log(existingSubscriber, newSubscriber);
			// waitingList.showUpdates = req.body.showUpdates
		}

		const promoCodeId = await generateAndGetPromoCodeId();

		await WaitingList.create({
			firstName, lastName, email, mobileNumber, promoCodeId,
			...waitingList,
			clientAgent: clientAgent ? clientAgent : null
		})

		// res.cookie('don_not_show', true);

		return respondWithSuccess(req, res, 'Successfully added')
	} catch (err) {
		console.log(err)
		return respondWithError(req, res, 'internal server error', null, 500);
	}
}

async function generateAndGetPromoCodeId() {

	let promoCode = await PromoCode.findOne({
		where: {
			promoCode: 'wishlist10',
			promoType: 'user',
			deleteStatus: false
		}
	})
	if (promoCode) {
		return promoCode.id
	} else {
		promoCode = await PromoCode.create({
			name: 'Wish List',
			promoCode: 'wishlist10',
			discount: 20,
			maxUseLimit: 1,
			userMaxUseLimit: 1,
			minOrderLimit: 1,
			maxDiscount: 1,
			remainingLimit: 1,
			promoType: 'user'
		})
		return promoCode.id
	}
}