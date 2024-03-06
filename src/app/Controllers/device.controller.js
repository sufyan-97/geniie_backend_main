//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

// libraries
const { Op } = require('sequelize');
const Device = require('../SqlModels/Device');


// Modals
const SystemApp = require('../SqlModels/SystemApp');


exports.getAll = async function (req, res) {

	Device.findAll({ where: { deleteStatus: false } }).then(devices => {
		return res.send({
			data: devices
		})
	}).catch(err => {
		console.log(err);
		return respondWithError(req, res, '', null, 500)
	})
}


exports.updateOrRegister = async function (req, res) {
	console.log(req.body.fireBaseDeviceToken);
	let uuid = req.body.uuid
	let appSlug = req.body.appSlug
	let serial = req.body.serial
	let mac = req.body.mac
	let fireBaseDeviceToken = req.body.fireBaseDeviceToken
	let isIos = req.body.isIos ? req.body.isIos : false
	let systemApp = await SystemApp.findOne({ where: { slug: appSlug, deleteStatus: false } })
	if (systemApp) {
		Device.findOne({ where: { uuid: uuid, systemAppId: systemApp.id } }).then(existedDeviceData => {
			if (existedDeviceData) {
				if (fireBaseDeviceToken !== existedDeviceData.fireBaseDeviceToken) {
					existedDeviceData.fireBaseDeviceToken = fireBaseDeviceToken
					existedDeviceData.isIos = isIos
					existedDeviceData.save().then(updatedDevice => {
						return res.send({
							message: 'Device data has been updated successfully.',
							data: updatedDevice
						})
					})
				} else {
					return res.send({
						message: 'Device already registered.',
						data: existedDeviceData
					})
				}
			} else {
				let deviceData = new Device({
					uuid,
					systemAppId: systemApp.id,
					serial,
					mac,
					fireBaseDeviceToken,
					isIos
				})

				deviceData.save().then(async newDevice => {

					return res.send({
						message: 'Device has been registered successfully.',
						data: newDevice
					})

				}).catch(err => {
					console.log(err);
					return respondWithError(req, res, '', null, 500)
				})
			}
		}).catch(err => {
			console.log(err);
			return respondWithError(req, res, '', null, 500)
		})

	} else {
		return res.status(400).send({
			message: 'Error: Unauthorized Access.',
		})
	}
}