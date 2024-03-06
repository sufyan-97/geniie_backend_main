// Libraries
const axios = require('axios');
const FormData = require('form-data');

//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

// Custom Libraries
const { sendEmailV2 } = require('../../lib/email');
const { sequelize_conn } = require('../../../config/database');

const emailQueue = require('../../lib/emailWorker');

// Models
const WebMessage = require('../SqlModels/WebMessage');
const Subscriber = require('../SqlModels/Subscriber');

// Constants
const configConstants = require('../../../config/constants');

exports.saveMessage = async function (req, res) {
	WebMessage.create({
		email: req.body.email,
		message: req.body.message,
		fullName: req.body.fullName,
		subject: req.body.subject,
	}).then(async data => {
		let fmData = new FormData()
		fmData.append('email_address', req.body.email);
		// fmData.append('fullName', req.body.fullName );
		fmData.append('subject', req.body.subject);
		fmData.append('message', req.body.message);
		let supportResponse = await axios.post(`${configConstants.SUPPORT_BASE_URL}/actions/account/create_ticket`, fmData, {
			headers: {
				"Authorization": `Basic ${configConstants.SUPPORT_HASH}`,
				...fmData.getHeaders()
			}
		});
		return respondWithSuccess(req, res, "Your message has been sent to geniie administration.", null, 200, 'data')
	}).catch(err => {
		console.log(err)
		return respondWithError(req, res, {}, "Internal Server Error.", 500)
	})


}

exports.getSubscribers = async function (req, res) {
	Subscriber.findAll({
		where: {
			deleteStatus: false
		}
	}).then(data => {
		return respondWithSuccess(req, res, "data fetched successfully.", data)
	}).catch(err => {
		console.log(err)
		return respondWithError(req, res, '', null, 500)
	})
}

exports.subscribe = async function (req, res) {
	Subscriber.findOne({ where: { email: req.body.email, deleteStatus: false } }).then(data => {
		if (data) {
			return respondWithError(req, res, {}, "You are already a member of geniie newsletter.", 400)
		}
		Subscriber.create({
			email: req.body.email
		}).then(data => {
			return respondWithSuccess(req, res, "You successfully subscribed to geniie newsletter.", null, 200, 'data')
		}).catch(err => {
			console.log(err)
			return respondWithError(req, res, {}, "Internal Server Error.", 500)
		})
	})
}

exports.deleteSubscriber = async function (req, res) {

	let id = req.params.id

	Subscriber.update({ deleteStatus: true },
		{
			where: {
				id: id
			}
		}
	).then(data => {
		if (!data) {
			return respondWithError(req, res, 'subscriber not found', null, 400)
		}
		return respondWithSuccess(req, res, "subscriber deleted successfully.")
	}).catch(err => {
		console.log(err)
		return respondWithError(req, res, '', null, 500)
	})
}

exports.unsubscribe = async function (req, res) {

	let email = req.query.email

	Subscriber.update({ deleteStatus: true },
		{
			where: {
				email: email
			}
		}
	).then(data => {
		if (!data) {
			return respondWithError(req, res, 'subscriber not found', null, 400)
		}
		return res.redirect(`${configConstants.WEB_URL}?message=Your email is unsubscribed`)
	}).catch(err => {
		console.log(err)
		return respondWithError(req, res, '', null, 500)
	})
}

exports.messageToSubscriber = async function (req, res) {

	let message = req.body.message

	Subscriber.findAll({
		where: {
			deleteStatus: false,
		}
	}).then(async data => {

		let emails = []
		data.map((item, i) => {
			emails.push({
				name: `Newsletters ${i}`,
				data: {
					subject: "Geniie Response",
					to: item.email,
					message: message
				}
			})
		})

		emailQueue.addBulk(emails)

		// let newEmails = emails.join()
		// await sendEmailV2("Geniie Response", message, newEmails);

		return respondWithSuccess(req, res, "Your message has been send to subscribers successfully.")
	}).catch(err => {
		console.log(err)
		return respondWithError(req, res, '', null, 500)
	})

}