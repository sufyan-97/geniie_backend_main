// Library
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const pug = require('pug');
const path = require('path');
const fs = require('fs');
const pdf = require('html-pdf');

// constants
const constants = require('../../config/constants');

var transporter1 = null

if (constants.SMTP_HOST && constants.SMTP_PORT) {
	transporter1 = nodemailer.createTransport(smtpTransport({
		host: constants.SMTP_HOST,
		port: constants.SMTP_PORT,
		auth: {
			user: constants.SMTP_USERNAME,
			pass: constants.SMTP_PASSWORD
		},


		// securing
		// secureConnection: false, // if true the connection will use TLS when connecting to server. If false (the default) then TLS is used if server supports the STARTTLS extension. In most cases set this value to true if you are connecting to port 465. For port 587 or 25 keep it false
		// secure: true, // if true the connection will use TLS when connecting to server. If false (the default) then TLS is used if server supports the STARTTLS extension. In most cases set this value to true if you are connecting to port 465. For port 587 or 25 keep it false
		tls: {
			// 	ciphers: 'SSLv3',
			rejectUnauthorized: false,
			// 	servername:''
		},
		// ignoreTLS: true, // if this is true and secure is false then TLS is not used even if the server supports STARTTLS extension
		// requireTLS: true, // if this is true and secure is false then Nodemailer tries to use STARTTLS even if the server does not advertise support for it. If the connection can not be encrypted then message is not sent

		logger: true,
		debug: true,

		connectionTimeout: 600000,
		greetingTimeout: 300000,

	}));
}

var transporter2 = null
if (constants.SMTP_HOST2 && constants.SMTP_PORT2) {
	transporter2 = nodemailer.createTransport(smtpTransport({
		host: constants.SMTP_HOST2,
		port: constants.SMTP_PORT2,
		auth: {
			user: constants.SMTP_USERNAME2,
			pass: constants.SMTP_PASSWORD2
		},
		secure: false,
		tls: true,
		tls: {
			rejectUnauthorized: false,
		},
		logger: true,
		debug: true,

		connectionTimeout: 600000,
		greetingTimeout: 300000,

	}));
}


const createPdf = (html) => {
	return new Promise((resolve, reject) => {
		pdf.create(html, {
			format: "Letter",
			orientation: "portrait",
			type: "pdf",
			quality: "75",
		}).toStream((error, invoiceFileSaved) => {
			if (error) {
				return reject(error)
			}
			return resolve(invoiceFileSaved)
		})
	})
}

exports.sendEmailV2 = function (subject, message, to, template = null, templateData = {}, isTemplateAttachment = null, attachmentFiles = []) {

	return new Promise(async (resolve, reject) => {

		try {

			let attachments = []

			if (template) {
				let templatePath = path.join(__dirname, `../views/email/${template}`)

				if (!fs.existsSync(templatePath)) {
					return reject('view does not exists')

				}

				message = pug.renderFile(templatePath, {
					to: to,
					host: constants.HOST,
					mainURL: constants.WEB_URL,

					FACEBOOK: constants.FACEBOOK,
					TWITTER: constants.TWITTER,
					LINKED_IN: constants.LINKED_IN,
					INSTAGRAM: constants.INSTAGRAM,

					...templateData
				});

				if (isTemplateAttachment) {
					let stream = await createPdf(message)

					attachments.push({
						filename: isTemplateAttachment?.fileName ? isTemplateAttachment?.fileName : 'geniie.pdf', content: stream, contentType: isTemplateAttachment?.contentType ? isTemplateAttachment?.contentType : 'application/pdf'
					})
				}

			}


			attachmentFiles.map(attachmentFile => {
				attachments.push({
					filename: attachmentFile.fileName, path: attachmentFile.file, contentType: attachmentFile.contentType
				})
			})


			const mailOptions = {
				from: `${constants.SMTP_FROM_NAME} <${constants.SMTP_FROM_EMAIL}>`,
				to: to,
				subject: `${constants.SMTP_COMMON_SUBJECT} ${subject}`,
				html: message,
				attachments: attachments.length ? attachments : null,
				list: {
					unsubscribe: {
						url: `${constants.HOST}/web/unsubscribe?email=${(typeof to === 'string') ? to : to[0]}`,
						comment: 'Comment'
					}
				}
			};

			if (transporter1) {
				console.log("***************************************************************************************")
				console.log("************************** Send Email with first Credentials **************************")
				console.log("***************************************************************************************")

				// console.log("hello smtp", smtpTransport);
				transporter1.sendMail(mailOptions, (error, response) => {
					if (error) {
						console.error("********************************************************")
						console.error(`**************** first ${error.message} ****************`)
						console.error("********************************************************")

						if (!transporter2) {
							console.log("***********************************************************************")
							console.log("************************* Second not provided *************************")
							console.log("***********************************************************************")
							return reject(error, response)
						}

						console.log("****************************************************************************************")
						console.log("************************** Send Email with second Credentials **************************")
						console.log("****************************************************************************************")

						mailOptions.from = constants.SMTP_FROM_EMAIL2;
						transporter2.sendMail(mailOptions, function (err, resp) {
							if (err) {
								console.error("********************************************************")
								console.error(`**************** Second ${error.message} ***************`)
								console.error("********************************************************")
								return reject(err, resp)
							}

							return resolve(err, resp)
						});

					}
					return resolve(error, response)

				});
				return
			}

			if (transporter2) {
				console.log("****************************************************************************************")
				console.log("************************** Send Email with second Credentials **************************")
				console.log("****************************************************************************************")

				mailOptions.from = constants.SMTP_FROM_EMAIL2;
				transporter2.sendMail(mailOptions, function (error, response) {
					if (error) {
						console.error("********************************************************")
						console.error(`**************** second ${error.message} ***************`)
						console.error("********************************************************")
						reject(error, response)
					} else {
						resolve(error, response)
					}
				})
				return
			}

			console.log("****************************************************************************")
			console.log("************************* Credentials not provided *************************")
			console.log("****************************************************************************")

			return reject('Credentials not provided')
		} catch (error) {
			console.log(error)
			return reject('function error')
		}
	})
}