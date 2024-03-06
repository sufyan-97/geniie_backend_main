// Libraries
const fs = require("fs");
const moment = require("moment");
const path = require("path");
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const randomize = require('randomatic');
const mime = require('mime');
const { default: axios } = require("axios");
const { Op } = require('sequelize')
const FormData = require('form-data');


// Models
const User = require("../app/SqlModels/User");
const Role = require("../app/SqlModels/Role");
const RecentSearch = require("../app/SqlModels/RecentSearch");
const Notification = require("../app/SqlModels/Notification");

// Custom Libraries
const rpcClient = require('../lib/rpcClient')

// Constants
const app_constants = require("../../config/constants");

const constants = require("../app/Constants/app.constants");
const { MICRO_SERVICES } = require("../../config/constants");
const configConstants = require('../../config/constants');
// const { sendEmail } = require("../lib/email");

module.exports = {
	
	upsert: (Model, dataValues, condition) => {
		return new Promise((resolve, reject) => {
			Model.findOne({
				...condition
			}).then((record) => {
				if (!record) {
					Model.create(dataValues).then(savedRecord => resolve(savedRecord)).catch(error => reject(error))
				}

				for (const key in dataValues) {
					if (Object.hasOwnProperty.call(dataValues, key)) {
						record[key] = dataValues[key]
					}
				}

				record.save().then(savedRecord => resolve(savedRecord)).catch(error => reject(error))
			}).catch(error => reject(error))
		})

	},
	removeOldAndAddNew: (Model, dataValues, condition) => {
		return new Promise((resolve, reject) => {
			Model.update({
				deleteStatus: true
			}, { where: condition }).then((deletedData) => {
				Model.create(dataValues).then(savedRecord => resolve(savedRecord)).catch(error => reject(error))
			}).catch((error) => reject(error))
		})
	},
	updateGuestCart: (userId, deviceId) => {
		return new Promise((resolve, reject) => {
			User.findOne({
				where: {
					deviceId
				},
				include: {
					model: Role,
					where: {
						roleName: 'guest'
					}
				}
			}).then(data => {
				if (data) {
					let restaurantMicroService = MICRO_SERVICES.find(item => item.title === 'restaurant')
					console.log(restaurantMicroService);
					if (restaurantMicroService) {
						/**
						 * @TODO
						 * @description need to be changed on RPC
						 */
						let url = `${restaurantMicroService.protocol}://${restaurantMicroService.microserviceBaseUrl}:${restaurantMicroService.port}/internal/cart/changeUser`
						axios.put(url, { userId, guestUserId: data.id })
					}
				}
				return resolve(true)
			}).catch(err => reject(err))
		})
	},

	createTicket: async function (email, subject, message, departmentId = null) {
		let fmData = new FormData()
		fmData.append('email_address', email);
		fmData.append('subject', subject);
		fmData.append('message', message);
		if (departmentId) {
			fmData.append('department_id', departmentId);
		}
		return await axios.post(`${configConstants.SUPPORT_BASE_URL}/actions/account/create_ticket`, fmData, {
			headers: {
				"Authorization": `Basic ${configConstants.SUPPORT_HASH}`,
				...fmData.getHeaders()
			}
		});
	},

	getDepartments: async function () {
		return await axios.get(`${configConstants.SUPPORT_BASE_URL}/actions/account/get_departments`, {
			headers: {
				"Authorization": `Basic ${configConstants.SUPPORT_HASH}`
			}
		});
	},

	getAgentRoles: async function () {

		let roles = await Role.findAll({
			where: {
				isActive: true
			},
			attributes: ['id', 'roleName', 'isAgent']
		})

		let agentRoles = []
		roles.forEach((role) => {
			if (role.isAgent) {
				agentRoles.push(role.roleName)
			}
		});
		return agentRoles;
	},

	suspendProviderAndAllItsReferences: async function (providerId, providerAccountSuspendData, providerReferenceAccountSuspendData) {

		await User.update(providerAccountSuspendData,
			{
				where: {
					id: providerId,
				}
			}
		)

		await User.update(providerReferenceAccountSuspendData,
			{
				where: {
					parentId: providerId,
					deleteStatus: false,
					[Op.not]: {
						status: 'suspended',
					}
				}
			}
		)

		return new Promise((resolve, reject) => {
			try {
				rpcClient.RestaurantService.suspendRestaurants({
					id: providerId,
					role: 'provider',
				}, function (error, rpcResponseData) {
					console.log('error, rpcResponseData=>', error, rpcResponseData)
					if (error) return reject(error)
					return resolve(rpcResponseData)
				})
			} catch (error) {
				console.log(error);
				return reject(error)
			}
		})


	},

	destroyCart: (userId) => {
		let restaurantMicroService = MICRO_SERVICES.find(item => item.title === 'restaurant')
		console.log(restaurantMicroService);
		if (restaurantMicroService) {
			/**
			 * @TODO
			 * @description need to be changed on RPC
			 */
			let url = `${restaurantMicroService.protocol}://${restaurantMicroService.microserviceBaseUrl}:${restaurantMicroService.port}/internal/cart/${userId}`
			axios.delete(url)
		}
	},

	getMicroService: function (url) {
		let splitPoints = url.split('/')
		return splitPoints[1]
	},

	isValidDate: async function (dateIs) {
		if (new Date(dateIs) == 'Invalid Date') {
			return false;
		} else {
			return true;
		}
	},

	getWeekDay: async function (key) {

		switch (key) {
			case 1:
				return "Every Sunday";
			case 2:
				return "Every Monday";
			case 3:
				return "Every Tuesday";
			case 4:
				return "Every Wednesday";
			case 5:
				return "Every Thursday";
			case 6:
				return "Every Friday";
			case 7:
				return "Every Saturday";


			default:
				return "N/A";
		}
	},

	getMonthName: async function (key) {

		switch (key) {
			case 1:
				return "January";
			case 2:
				return "February";
			case 3:
				return "March";
			case 4:
				return "April";
			case 5:
				return "May";
			case 6:
				return "June";
			case 7:
				return "July";
			case 8:
				return "August";
			case 9:
				return "September";
			case 10:
				return "October";
			case 11:
				return "November";
			case 12:
				return "December";

			default:
				return "N/A";
		}
	},

	convertToLang: async function (lngWord, constant) {
		if (lngWord !== undefined && lngWord !== "" && lngWord !== null) {
			return lngWord;
		} else if (
			constant !== undefined &&
			constant !== "" &&
			constant !== null
		) {
			return constant;
		} else {
			return "N/A";
		}
	},

	validateEmail: email => {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	},

	validateIPAddress: ip => {
		var re = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
		return re.test(ip);
	},

	validateMacAddress: mac => {
		var re = /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/;
		return re.test(mac);
	},


	formatBytes: function (bytes, decimals = 2) {
		if (bytes === 0) return "0 Bytes";

		const k = 1000;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
	},

	bytesToSize: function (bytes) {
		var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
		if (bytes == 0) return "0 Byte";
		var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1000)));
		return Math.round(bytes / Math.pow(1000, i), 2) + " " + sizes[i];
	},

	getFileSize: function (file) {
		let fileExist = path.join(__dirname, "../uploads/" + file);
		if (fs.existsSync(fileExist)) {
			let file_status = fs.statSync(fileExist);
			return file_status.size;
		} else {
			return 0;
		}
	},

	replaceAt: function (string, index, replace) {
		index--;
		return (
			string.substring(0, index) + replace + string.substring(index + 1)
		);
	},

	move: function (oldPath, newPath) {
		return new Promise((resolve, reject) => {
			fs.rename(oldPath, newPath, function (err) {
				if (err) {
					if (err.code === 'EXDEV') {
						var readStream = fs.createReadStream(oldPath);
						var writeStream = fs.createWriteStream(newPath);

						readStream.on('error', reject);
						writeStream.on('error', reject);

						readStream.on('close', function () {
							fs.unlink(oldPath, resolve);
						});

						readStream.pipe(writeStream);
					} else {
						reject(err);
					}
					return;
				}
				resolve();
			});

		})
	},

	convertTimezoneValue: async function (dealerTimezone = '', date, clientToServerTZ = false, dateFormat = "YYYY-MM-DD HH:mm:ss") { // dealerTimezone: timezone, date: date/time
		let convertedDateTime = "N/A";
		if (date && new Date(date) !== "Invalid Date" && new Date(date) !== "Invalid date" && !isNaN(new Date(date))) {
			let timeZones = moment.tz.names();
			let foundZoneIndex = -1;
			if (this.isValidTimezone(dealerTimezone)) {
				foundZoneIndex = timeZones.findIndex(item => item.toLowerCase() === dealerTimezone.toLowerCase());
			}
			if (foundZoneIndex === -1) {
				dealerTimezone = moment.tz.guess(); // get local time zone value e.g "Asia/Karachi"
			}

			if (clientToServerTZ) {
				convertedDateTime = moment.tz(date, dealerTimezone).tz('UTC').format(dateFormat);
			} else {
				// convert server time to client time
				convertedDateTime = moment.tz(date, 'UTC').tz(dealerTimezone).format(dateFormat);
			}
		}

		return convertedDateTime;
	},

	isValidTimezone: function (tz) {
		let isValidTimezone = true;
		if (tz) {
			try {
				Intl.DateTimeFormat(undefined, { timeZone: tz });
			}
			catch (ex) {
				isValidTimezone = false;
			}
		} else {
			isValidTimezone = false;
		}
		return isValidTimezone;
	},

	getValueFromPrice: async function (value) {
		return getValueFromPrice(value);
	},

	IsValidJSONString: function (str) {
		try {
			return JSON.parse(str);
		} catch (e) {
			console.log("ERROR CONSOLE IN IsValidJSONString", e)
			return false;
		}
	},

	currencyFormat: function (value, symbol = '$') {
		let isNegativeValue = false;
		let formattedValue = `0.00`;

		if (device_helpers.checkValue(value) !== "N/A") {
			value = value.toString();
			formattedValue = `${value} .00`;
			let indexOfDot = value.indexOf(".");

			if (indexOfDot !== -1) {
				let intValue = Number(value);
				if (indexOfDot === 0) { // . dot place at zero index
					formattedValue = `0${intValue.toFixed(2)} `
				} else {
					formattedValue = `${intValue.toFixed(2)} `
				}
			}

			let indexOfNegative = formattedValue.indexOf("-");
			if (indexOfNegative !== -1) {
				isNegativeValue = true;
				formattedValue = formattedValue.slice(1, formattedValue.length);
			}
		}
		formattedValue = `${symbol} ${device_helpers.addCommas(formattedValue)} `
		return isNegativeValue ? `- ${formattedValue} ` : formattedValue;
	},


	hasSql: (value) => {

		if (value === null || value === undefined) {
			return false;
		}

		// sql regex reference: http://www.symantec.com/connect/articles/detection-sql-injection-and-cross-site-scripting-attacks
		var sql_meta = new RegExp('(%27)|(\')|(--)|(%23)|(#)', 'i');
		if (sql_meta.test(value)) {
			return true;
		}

		var sql_meta2 = new RegExp('((%3D)|(=))[^\n]*((%27)|(\')|(--)|(%3B)|(;))', 'i');
		if (sql_meta2.test(value)) {
			return true;
		}

		var sql_typical = new RegExp('w*((%27)|(\'))((%6F)|o|(%4F))((%72)|r|(%52))', 'i');
		if (sql_typical.test(value)) {
			return true;
		}

		var sql_union = new RegExp('((%27)|(\'))union', 'i');
		if (sql_union.test(value)) {
			return true;
		}

		return false;
	},

	generateRefreshToken: async () => {
		return new Promise(async (resolve, reject) => {
			try {
				let value = await bcrypt.hash(`${uuid.v4()}`, 10)
				return resolve(value);
			} catch (error) {
				reject(error)
			}
		})
		// return crypto.randomBytes(40).toString('hex');
		// return uuid.v4();
	},

	checkIsArray: checkIsArray,


	uploadImage: async function (image, prefix = '', subFolder = '') {
		try {
			let imageMimeType = image.type
			if (!constants.IMAGE_SUPPORTED_FORMATS.includes(imageMimeType?.toLowerCase()) && !constants.PDF_SUPPORTED_FORMATS.includes(imageMimeType?.toLowerCase())) {
				return {
					status: false,
					message: "Error: one of the uploaded file Extension is not valid.",
					statusCode: 422
				};
			}

			let extName = mime.getExtension(imageMimeType)

			if (!extName) {
				extName = 'jpg'
			}

			let storagePath = path.join(__dirname, `../storage/images`);
			let storagePathExists = fs.existsSync(storagePath);
			if (!storagePathExists) {
				fs.mkdirSync(storagePath);
			}
			let currentDate = moment().unix()
			let imageName = `${prefix}-${currentDate}-${randomize('0', 6)}.${extName}`;
			let imageTarget = path.join(__dirname, `../storage/images/` + imageName);
			if (subFolder) {
				imageTarget = path.join(__dirname, `../storage/images/${subFolder}/` + imageName);
			}

			// console.log(imageTarget);

			let moveImageError = await this.move(image.path, imageTarget)
			if (moveImageError) {
				console.log(error)
				return {
					status: false,
					message: 'Error: Internal server error',
					statusCode: 500
				}
			}
			return {
				status: true,
				imageName: imageName
			}
		} catch (error) {
			console.log(error);
			return {
				status: false,
				message: 'Error: Internal server error',
				statusCode: 500
			}
		}

	},

	uploadImageOnly: async function (image, prefix = '', subFolder = '') {
		try {
			let imageMimeType = image.type

			if (!constants.IMAGE_SUPPORTED_FORMATS.includes(imageMimeType?.toLowerCase())) {
				return {
					status: false,
					message: "Error: one of the uploaded file Extension is not valid.",
					statusCode: 422
				};
			}

			let extName = mime.getExtension(imageMimeType)

			let currentDate = moment().unix()
			let imageName = `${prefix}-${currentDate}-${randomize('0', 6)}.${extName}`;
			let imageTarget = path.join(__dirname, `../storage/images/` + imageName);
			if (subFolder) {
				imageTarget = path.join(__dirname, `../storage/images/${subFolder}/` + imageName);
			}

			let moveImageError = await this.move(image.path, imageTarget)
			if (moveImageError) {
				return {
					status: false,
					message: 'Error: Internal server error',
					statusCode: 500
				}
			}
			return {
				status: true,
				imageName: imageName
			}
		} catch (error) {
			console.log(error);
			return {
				status: false,
				message: 'Error: Internal server error',
				statusCode: 500
			}
		}

	},

	uploadDocs: async function (file, userDir, prefix = '') {
		try {
			let fileMimeType = file.type
			// console.log(file)
			if (!constants.IMAGE_SUPPORTED_FORMATS.includes(fileMimeType.toLowerCase()) && !constants.PDF_SUPPORTED_FORMATS.includes(fileMimeType.toLowerCase())) {
				return {
					status: false,
					message: "Error: one of the uploaded file Extension is not valid.",
					statusCode: 422
				};
			}

			let extName = file.originalFilename.split('.').pop()

			let currentDate = moment().unix()
			let fileName = `${prefix}-${currentDate}-${path.parse(file.originalFilename).name}.${extName}`;
			// let fileType = 'images'

			let fileStoragePath = path.join(__dirname, `../storage/${userDir}/`)
			// console.log('fileStoragePath:', fileStoragePath)
			let fileStoragePathExists = fs.existsSync(fileStoragePath)
			if (!fileStoragePathExists) {
				fs.mkdirSync(fileStoragePath, { recursive: true });
			}

			let fileTarget = path.join(`${fileStoragePath}/${fileName}`);


			// console.log(imageTarget);

			let moveImageError = await this.move(file.path, fileTarget)
			if (moveImageError) {
				console.log(error)
				return {
					status: false,
					message: 'Error: Internal server error',
					statusCode: 500
				}
			}
			return {
				status: true,
				fileName: fileName
			}
		} catch (error) {
			console.log(error);
			return {
				status: false,
				error: error
			}
		}

	},

	pushToArray: function (arr, obj, key, appDefined = null) {
		try {

			let index = -1

			if (appDefined) {
				index = arr.findIndex(e => e.app && (e[key] === obj[key] && e.app === appDefined))
			} else {
				index = arr.findIndex(e => e[key] === obj[key] && !e.app)
			}

			if (index === -1) {
				arr.push(obj);
			} else {
				arr[index] = obj;
			}
			return arr
		} catch (error) {
			console.log(error)
			return []
		}
	},
	pushValueToArray: function (arr, value) {
		try {
			const index = arr.findIndex((arrVal) => arrVal === value);

			if (index === -1) {
				arr.push(value);
			}

			return arr
		} catch (error) {
			console.log(error)
			return []
		}
	},
	getIpInformation: function (ipAddress) {
		return new Promise(async (resolve, reject) => {
			let url = app_constants.IP_INFO_CHECKER
			if (ipAddress !== '::1') {
				url = `${url}${ipAddress}/`
			}
			url = `${url}json`
			axios.get(url).then((ipInfo) => {
				return resolve(ipInfo.data)
			}).catch((error) => {
				return reject(error)
			})
		})
	},
	isObject: function (obj) {
		return (obj && typeof obj === 'object' && !Array.isArray(obj));
	},
	mergeDeep: function (target, source) {
		let output = Object.assign({}, target);
		if (this.isObject(target) && this.isObject(source)) {
			Object.keys(source).forEach(key => {
				if (this.isObject(source[key])) {
					if (!(key in target))
						Object.assign(output, { [key]: source[key] });
					else
						output[key] = this.mergeDeep(target[key], source[key]);
				} else {
					Object.assign(output, { [key]: source[key] });
				}
			});
		}
		return output;
	},
	validateReqData: function (reqData, validParams) {
		try {
			let errors = [];
			let isValid = true

			let reqKeys = Object.keys(reqData);

			try {
				validParams = JSON.parse(validParams).length ? JSON.parse(validParams) : []
			} catch (error) {
				validParams = []
			}


			validParams.map(validParam => {
				// console.log(validParam)
				let reqKey = reqKeys.find(reqKey => reqKey === validParam.name)

				isValid = validParam.required && !reqKey ? false : isValid

				if (!isValid) {
					errors.push(`${validParam.name} is required`)
					return
				}

				isValid = reqKey && typeof reqData[reqKey] != validParam.type ? false : isValid

				if (!isValid) {
					errors.push(`${reqKey} should be ${validParam.type}`)
				}
			})

			console.log(isValid, errors)

			return isValid
		} catch (error) {
			console.log(error)
			return Error(error)
		}
	},

	saveRecentSearch: function (recentSearchData) {
		return new Promise(async (resolve, reject) => {
			try {
				// console.log(recentSearchData);
				RecentSearch
					.findOne({ where: { ...recentSearchData, deletedAt: null } })
					.then(function (obj) {
						if (obj) {
							obj.destroy()
							resolve(true)
						}

						RecentSearch.create(recentSearchData)
							.then(item => { resolve(true) })
							.catch(item => { resolve(false) })

					})



			} catch (error) {
				console.log(error);
				resolve(false)
			}
		})
	},

	saveNotificationData: function (data, slug) {
		return new Promise(async (resolve, reject) => {
			try {
				let appName = slug === 'asaap' ? 'user' : slug === 'asaap-restaurant' ? 'restaurant' : 'rider'
				let notificaiton = {
					subject: data.title,
					description: data.body,
					notificationData: data.data,
					appName: appName
				}

				Notification.create(notificaiton)
					.then(item => { resolve(true) })
					.catch(item => { resolve(false) })

			} catch (error) {
				console.log(error);
				resolve(false)
			}
		})
	},
}

async function getValueFromPrice(value) {

	var regexOnlyFloatValue = /[+-]?\d+(\.\d+)?/g;
	let parsedValue = value;
	let finalValue = '';
	let isNegativeValue = false;

	try {

		if (value && typeof (value) !== 'number' && value.match(regexOnlyFloatValue)) {
			let indexOfNegative = parsedValue.indexOf("-");
			if (indexOfNegative !== -1) {
				isNegativeValue = true;
				parsedValue = parsedValue.splice(indexOfNegative, 1);
			}
			let parsedFloatValue = parsedValue.match(regexOnlyFloatValue);
			// parsedValue = parsedValue[0]
			for (let i = 0; i < parsedFloatValue.length; i++) {
				finalValue += parsedFloatValue[i]
			}

			// console.log(parsedValue);
			// parsedValue = parseFloat(value.replace(/\$|,/g, ''))
		} else {
			finalValue = value;
		}

	} catch (err) {
		console.log(err)
	}
	return finalValue ? isNegativeValue ? -parseFloat(finalValue) : parseFloat(finalValue) : "0.00";

}

function checkIsArray(data) {
	try {
		if (!data) {
			return [];
		}
		if (Array.isArray(data) && data.length) {
			return data;
		} else {
			return [];
		}
	} catch (err) {
		return [];
	}
}


