// Libraries

// Modals
const EmailTemplate = require('../SqlModels/EmailTemplate');
var SentMail = require('../SqlModels/SentMail');

// Custom Libraries
const { sendEmailV2 } = require('../../lib/email');

// helpers
const general_helper = require('../../helpers/general_helper');
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

// constants
const constants = require('../Constants/app.constants');


exports.getAll = async function (req, res) {
	EmailTemplate.findAll().then(templateData => {
		if (templateData && templateData.length) {
			return res.send({
				data: templateData
			})
		} else {
			return res.send({
				data: []
			})
		}
	}).catch(err => {
		console.log(err);
		return respondWithError(req, res, '', null, 500)
	})
}

// exports.getOne = async function (req, res) {
// 	let id = req.params.id

// 	EmailTemplate.findOne({
// 		where: {
// 			id: id
// 		},
// 	}).then(templateData => {
// 		if (!templateData) {
// 			return res.status(400).send({
// 				message: 'Unable to fetch Onboarding. Onboarding not found.',
// 			})
// 		}

// 		return res.send({
// 			message: 'Onboarding data fetched successfully.',
// 			data: templateData
// 		})
// 	}).catch(err => {
// 		console.log(err);
// 		return respondWithError(req, res, '', null, 500)
// 	})
// }

// exports.post = async function (req, res) {
// 	let appName = req.query.app

// 	let isAppExist = await SystemApp.findOne({ where: { slug: appName, deleteStatus: false } });
// 	if (!isAppExist) {
// 		return res.status(400).send({ message: 'app does not exist in system' })
// 	}

// 	let onboarding = new EmailTemplate({
// 		heading: req.body.heading,
// 		details: req.body.details,
// 		appName: appName
// 	})

// 	onboarding.save().then(async (onboardingData) => {
// 		let data = await EmailTemplate.findOne({ where: { id: onboardingData.id } });
// 		return res.send({
// 			message: 'Onboarding has been added successfully.',
// 			data: data
// 		})
// 	}).catch(err => {
// 		console.log(err);
// 		return respondWithError(req, res, '', null, 500)
// 	})
// }

// exports.update = async function (req, res) {
// 	let appName = req.query.app

// 	let isAppExist = await SystemApp.findOne({ where: { slug: appName, deleteStatus: false } });
// 	if (!isAppExist) {
// 		return res.status(400).send({ message: 'app does not exist in system' })
// 	}

// 	let updateData = {
// 		id: req.body.id,
// 		heading: req.body.heading,
// 		details: req.body.details,
// 	}

// 	if (req.files && req.files.image) {
// 		let imageData = await general_helper.uploadImage(req.files.image, 'onboarding', 'noAuth')
// 		if (imageData.status) {
// 			updateData.image = constants.NO_AUTH_FILE_PREFIX + imageData.imageName;
// 		} else {
// 			return res.status(imageData.statusCode).send({
// 				message: imageData.message
// 			})
// 		}
// 	}

// 	EmailTemplate.update(updateData, {
// 		where: {
// 			id: req.body.id,
// 			appName: appName,
// 			deleteStatus: false
// 		},
// 	}).then(async data => {
// 		if (data && data[0]) {
// 			let updatedData = await EmailTemplate.findOne({ where: { id: req.body.id } })
// 			return res.send({
// 				message: 'Onboarding has been updated successfully.',
// 				data: updatedData
// 			})
// 		} else {
// 			return res.status(400).send({
// 				message: 'Unable to update Onboarding. Onboarding not found.',
// 			})
// 		}
// 	}).catch(err => {
// 		console.log(err);
// 		return respondWithError(req, res, '', null, 500)
// 	})
// }

exports.save = async function (req, res) {

	try {
		let templateName = req.body.templateName
		let templateData = req.body.templateData

		let emailTemplate = await EmailTemplate.create({
			templateName,
			templateData,
		})

		return respondWithSuccess(req, res, 'design created successfully', emailTemplate)

	} catch (error) {
		console.log(error);
		return respondWithError(req, res, '', null, 500)
	}

}

exports.update = async function (req, res) {
	try {
		let id = req.body.id
		let templateName = req.body.templateName
		let templateData = req.body.templateData

		await EmailTemplate.update({
			templateName,
			templateData,
		},
			{
				where: {
					id: id
				}
			}
		)

		let emailTemplate = await EmailTemplate.findOne({
			where: {
				id: id
			}
		})

		return respondWithSuccess(req, res, 'design updated successfully', emailTemplate)

	} catch (error) {
		console.log(error);
		return respondWithError(req, res, '', null, 500)
	}

}

exports.delete = async function (req, res) {
	try {
		let id = req.params.id

		await EmailTemplate.destroy({
			where: {
				id: id
			}
		})

		return respondWithSuccess(req, res, 'design deleted successfully')

	} catch (error) {
		console.log(error);
		return respondWithError(req, res, '', null, 500)
	}
}

exports.sendMail = async function (req, res) {

	try {
		let email = req.body.email
		let subject = req.body.subject
		let htmlData = req.body.htmlData

		SentMail.create({
			email: email,
			subject: subject,
			htmlData: htmlData,
		})

		await sendEmailV2(subject, htmlData, email)

		return respondWithSuccess(req, res, 'mail delivered successfully')

	} catch (error) {
		console.log(error);
		return respondWithError(req, res, '', null, 500)
	}
}

exports.getSentMail = async function (req, res) {

	try {

		let sentMail = await SentMail.findAll()

		return respondWithSuccess(req, res, 'data fetched successfully', sentMail)

	} catch (error) {
		console.log(error);
		return respondWithError(req, res, '', null, 500)
	}

}
