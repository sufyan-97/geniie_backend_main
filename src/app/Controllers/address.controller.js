// libraries
var fs = require('fs');
var path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { Op } = require('sequelize')

// Config
// var redisJwt = require('../../../config/jwt');
// const redisClient = require("../../../config/redis");

// Custom Libraries
const { sendEmail } = require('../../lib/email');

// Modals
// var User = require('../SqlModels/User');
var UserAddress = require('../SqlModels/UserAddress');
var AddressLabel = require('../SqlModels/AddressLabel');

// helpers
const general_helpers = require('../../helpers/general_helper');
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper');

// Constants
const constants = require('../../../config/constants');
// const { APP_SECRET } = require('../../../config/constants');

exports.getAll = async function (req, res) {
	let lngCode = req.headers['language']

	UserAddress.findAll({
		lngCode: lngCode,
		where: {
			[Op.and]: [
				{
					userId: req.user.id
				},
				{
					deleteStatus: false
				}
			]
		},
		order: [['activeAddress', 'DESC']],
		include: AddressLabel
	}).then(data => {
		let message = 'Unable to fetch address. Address not found.'
		if (data && data.length) {
			message = 'Addresses data fetched successfully.'
		}

		return respondWithSuccess(req, res, message, data, 200, 'addresses')
	}).catch(err => {
		console.log(err);
		return respondWithError(req, res, '', null, 500)
	})
}

exports.getOne = async function (req, res) {
	let id = req.params.id
	UserAddress.findOne({
		where: {
			[Op.and]: [
				{
					userId: req.user.id
				},
				{
					id: id
				},
				{
					deleteStatus: false
				}
			]
		},
		include: AddressLabel
	}).then(data => {
		if (data) {
			return res.send({
				message: 'Addresses data fetched successfully.',
				address: data
			})
		} else {
			return res.send({
				message: 'Address not found.',
				address: {}
			})
		}
	}).catch(err => {
		console.log(err);
		return respondWithError(req, res, '', null, 500)
	})
}

exports.post = async function (req, res) {
	if (req.user.is_guest_user) {
		return res.status(400).send({
			message: 'Error: Unauthorized Access.',
		})
	}
	let userAddress = new UserAddress({
		address: req.body.address,
		addressHeading: req.body.addressHeading ? req.body.addressHeading : null,
		floor: req.body.floor ? req.body.floor : null,
		optional: req.body.optional ? req.body.optional : null,
		latitude: req.body.latitude,
		longitude: req.body.longitude,
		userId: req.user.id,
		roleId: 1,
		activeAddress: false,
		addressLabelId: req.body.addressLabelId,
		addressLabelName: req.body.addressLabelName,
		postCode: req.body.postCode
	})

	userAddress.save().then(async address => {

		let updatedData = await UserAddress.findOne({
			where: {
				id: address.id
			},
			include: AddressLabel
		})

		return res.send({
			message: 'Address has been added successfully.',
			address: updatedData
		})

	}).catch(err => {
		console.log(err);
		return respondWithError(req, res, '', null, 500)
	})
}

exports.update = async function (req, res) {

	let id = req.body.id
	let address = req.body.address
	let latitude = req.body.latitude
	let longitude = req.body.longitude
	let addressLabelId = req.body.addressLabelId
	let addressLabelName = req.body.addressLabelName ? req.body.addressLabelName : ''


	UserAddress.update({
		address, latitude, longitude, addressLabelId, addressLabelName,
		addressHeading: req.body.addressHeading ? req.body.addressHeading : null,
		floor: req.body.floor ? req.body.floor : null,
		optional: req.body.optional ? req.body.optional : null,
		postCode: req.body.postCode ? req.body.postCode : null,
	}, {
		where: {
			[Op.and]: [
				{
					userId: req.user.id
				},
				{
					id: id
				},
				{
					deleteStatus: false
				}
			]
		},
	}).then(async data => {
		if (data && data[0]) {

			let updatedData = await UserAddress.findOne({
				where: {
					id: id
				},
				include: AddressLabel
			})

			return res.send({
				message: 'Address has been updated successfully.',
				address: updatedData
			})

		} else {
			return res.status(400).send({
				message: 'Unable to update address. Address not found.',
			})
		}
	}).catch(err => {
		console.log(err);
		return respondWithError(req, res, '', null, 500)
	})
}

exports.delete = async function (req, res) {
	let id = req.params.id
	UserAddress.update({ deleteStatus: true }, {
		where: {
			[Op.and]: [
				{
					userId: req.user.id
				},
				{
					id: id
				}
			]
		},
	}).then(data => {
		if (data && data[0]) {
			return res.send({
				message: 'Address has been deleted successfully.',
			})
		} else {
			return res.status(400).send({
				message: 'Unable to delete address. Address not found.',
			})
		}
	}).catch(err => {
		console.log(err);
		return respondWithError(req, res, '', null, 500)
	})
}

exports.updateActiveAddress = async function (req, res) {
	let id = req.params.id
	UserAddress.update({ activeAddress: true }, {
		where: {
			[Op.and]: [
				{
					userId: req.user.id
				},
				{
					id: id
				},
				{
					deleteStatus: false
				}
			]
		},
	}).then(data => {
		if (data && data[0]) {
			UserAddress.update({ activeAddress: false }, {
				where: {
					[Op.and]: [
						{
							userId: req.user.id
						},
						{
							[Op.not]: { id: id }
						},
						{
							deleteStatus: false
						}
					]
				},
			})
			return res.send({
				message: 'Active address has been updated successfully.',
			})
		} else {
			return res.status(400).send({
				message: 'Unable to change active address. Address not found.',
			})
		}
	}).catch(err => {
		console.log(err);
		return respondWithError(req, res, '', null, 500)
	})
}