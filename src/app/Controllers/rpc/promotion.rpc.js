// Libraries

// Models
const Promotion = require('../../SqlModels/Promotion')

exports.getPromotionList = function (call, callback) {
	try {
		let reqData = call.request;

	} catch (error) {
		console.log(error)
		return callback(error)
	}
}

exports.getPromotion = async function (call, callback) {
	try {
		let reqData = call.request;
		console.log(reqData)
		let promotion = await Promotion.findOne({
			where: {
				id: reqData.promotionId
			}
		})

		if (!promotion) {
			return callback({
				message: 'Promotion not found'
			})
		}

		return callback(null, {
			status: true,
			data: JSON.stringify(promotion)
		})
	} catch (error) {
		console.log(error)
		return callback(error)
	}
}