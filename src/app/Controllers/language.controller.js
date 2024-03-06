//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

// Libraries
const fs = require('fs')
const path = require('path');
const sequelize = require('sequelize')

// Custom Libraries
const rpcClient = require('../../lib/rpcClient')

// Modals
const Language = require('../SqlModels/Language');
const SystemApp = require('../SqlModels/SystemApp');

// Helpers
const general_helper = require('../../helpers/general_helper');

// Constants
const constants = require('../Constants/app.constants');

// Language CRUD
exports.getLanguages = async function (req, res) {
	Language.findAll({
		where: {
			deleteStatus: false
		},
	}).then(data => {
		if (data && data.length) {
			return res.send({
				status: true,
				message: 'Language data fetched successfully.',
				data: data
			})
		} else {
			return res.status(200).send({
				message: 'Unable to fetch language. Languages not found.',
				data: [],
				status: true,
			})
		}
	}).catch(err => {
		console.log(err);
		return respondWithError(req, res, '', null, 500)
	})
}

exports.addLanguage = async function (req, res) {
	try {
		let user = req.user

		if (user.roleName !== 'admin') {
			return respondWithError(req, res, 'action_not_allowed', null, 405);
		}

		let flagName = null
		if (req.files && req.files.flag) {

			let flagData = await general_helper.uploadImage(req.files.flag, 'language')
			if (flagData.status) {
				flagName = constants.FILE_PREFIX + flagData.imageName
			}
		}

		let name = req.body.name.toLowerCase()
		let languageCode = req.body.languageCode.toLowerCase()

		let languageExists = await Language.findAll({
			where: {
				deleteStatus: false,
				[sequelize.Op.or]: [
					{
						name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + name + '%')
					},
					{
						languageCode: sequelize.where(sequelize.fn('LOWER', sequelize.col('languageCode')), 'LIKE', '%' + languageCode + '%')
					}
				]
			}
		})
		if (languageExists.length) {
			return respondWithError(req, res, 'Language already added. Please add another language.', null, 400)
		}

		let languageData = new Language({
			name,
			languageCode,
			flag: flagName
		})

		await languageData.save()
		return respondWithSuccess(req, res, 'Language has been added successfully.', languageData, 200);
	} catch (error) {
		console.log("err:", error);
		return respondWithError(req, res, '', null, 500)
	}
}

exports.updateLanguage = async function (req, res) {
	try {
		let user = req.user

		// if (user.roleName !== 'admin') {
		// 	return respondWithError(req, res, 'action_not_allowed', null, 405);
		// }

		let lngId = req.params.id

		let name = req.body.name.toLowerCase()
		let languageCode = req.body.languageCode.toLowerCase()

		let isExistData = await Language.findAll({
			where: {
				deleteStatus: false,
				[sequelize.Op.not]: [
					{
						id: lngId
					}
				],
				[sequelize.Op.or]: [
					{
						name: sequelize.where(sequelize.fn('LOWER', sequelize.col('name')), 'LIKE', '%' + name + '%')
					},
					{
						languageCode: sequelize.where(sequelize.fn('LOWER', sequelize.col('languageCode')), 'LIKE', '%' + languageCode + '%')
					}
				]
			}
		})

		if (isExistData.length) {
			return respondWithError(req, res, 'Language already added. Please add another language.', null, 400)
		}

		let languageData = await Language.findOne({
			where: {
				[sequelize.Op.and]: [
					{
						deleteStatus: false
					},
					{
						id: lngId
					}
				]
			}
		})

		if (!languageData) {
			return respondWithError(req, res, 'Language not found to update.', null, 400)
		}

		let flagName = null
		if (req.files && req.files.flag) {

			let flagData = await general_helper.uploadImage(req.files.flag, 'language')
			if (flagData.status) {
				flagName = constants.FILE_PREFIX + flagData.imageName
			}
		}

		languageData.name = name
		languageData.languageCode = languageCode
		languageData.flag = flagName

		await languageData.save()

		return respondWithSuccess(req, res, 'Language has been added successfully.', languageData, 200)
	} catch (error) {
		console.log("err:", error);
		return respondWithError(req, res, '', null, 500)
	}
}

exports.deleteLanguage = async function (req, res) {
	let id = req.params.id

	let language = await Language.findOne({
		where: {
			id: id,
			isDefault: true
		}
	})
	if (language) {
		return res.status(400).send({
			message: 'You cannot delete default language',
		})
	}

	Language.update({ deleteStatus: true }, {
		where: {
			[sequelize.Op.and]: [
				{
					deleteStatus: false
				},
				{
					id: id
				}
			]
		},
	}).then(languageData => {
		if (languageData && languageData[0]) {
			return res.send({
				message: 'Language has been deleted successfully.',
			})
		} else {
			return res.status(400).send({
				message: 'Unable to delete language. Language not found.',
			})
		}
	}).catch(err => {
		console.log(err);
		return respondWithError(req, res, '', null, 500)
	})
}


// LanguageString CRUD

// todo
exports.getLanguageFile = async function (req, res) {
	// console.log(req.header('language'))
	let languageCode = req.header('language');
	let app = req.query.app;

	Language.findOne({
		where: {
			languageCode: languageCode,
			isActive: true,
			deleteStatus: false
		}
	}).then((lngData) => {
		if (!lngData) {
			return res.status(400).send({
				status: false,
				message: 'Error: Language not found'
			})
		}

		fs.readFile(path.join(__dirname, `../../i18n/${languageCode}.json`), function (err, fileLngData) {
			if (err) {
				console.log(err)
				return respondWithError(req, res, '', null, 500)
			}
			try {
				let parsedLngData = JSON.parse(fileLngData);
				if (app) {
					parsedLngData = parsedLngData.filter((lngKey) => lngKey.app === app)
				}
				return res.send({
					id: lngData.id,
					languageCode: lngData.languageCode,
					language: lngData.name,
					data: parsedLngData
				})
			} catch (error) {
				console.log(error)
				return respondWithError(req, res, '', null, 500)
			}
		})
	}).catch((error) => {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	})

}

exports.getAllLanguageFile = async function (req, res) {
	Language.findAll({
		where: {
			isActive: true,
			deleteStatus: false
		}
	}).then(async (lngData) => {
		if (!lngData || !lngData.length) {
			return res.status(200).send({
				status: false,
				message: 'Languages not found'
			})
		}

		let returnArray = [];
		for (let i = 0; i < lngData.length; i++) {
			const element = lngData[i];
			try {
				let data = await fs.readFileSync(path.join(__dirname, `../../i18n/${element.languageCode}.json`));
				let languageData = JSON.parse(data);

				let objData = {
					id: element.id,
					languageCode: element.languageCode,
					language: element.name,
					lngKeyValue: languageData
				};
				returnArray.push(objData);
			} catch (error) {
				console.log(error)
				continue;
			}
		}
		return res.send({
			message: 'data fetched successfully',
			data: returnArray
		})
	}).catch((error) => {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	})

}

exports.getKeyValues = async function (req, res) {
	try {
		let lngKey = req.query.lngKey;

		let keysData = await fs.readFileSync(path.join(__dirname, `../../i18n/en.json`))
		let parsedKeysData = JSON.parse(keysData)
		let keyIndex = parsedKeysData.findIndex(a => a.key.toLowerCase() === lngKey.toLowerCase())
		// console.log('keysData', parsedKeysData)
		if (keyIndex === -1) {
			return res.send({
				status: false,
				data: []
			})
		}

		Language.findAll({
			where: {
				deleteStatus: 0
			}
		}).then(async (languages) => {
			try {
				let stringData = []

				for (let language of languages) {
					// console.log(language)
					let lngValues = '[]'
					try {
						lngValues = await fs.readFileSync(path.join(__dirname, `../../i18n/${language.languageCode}.json`))

					} catch (error) {
						lngValues = '[]'
					}
					let parsedLngValues = JSON.parse(lngValues);
					let lngValue = parsedLngValues.find((lngVal) => lngVal.key.toLowerCase() === lngKey.toLowerCase())
					if (lngValue) {
						stringData.push({
							lngCode: language.languageCode,
							language: language.name,
							isDefault: language.isDefault,
							lngValue: lngValue.value,
							isSet: lngValue.isSet
						})
					}
				}
				return res.status(200).send({
					data: {
						lngKey: lngKey,
						lngValues: stringData
					}
				})
			} catch (error) {
				console.log(error)
				return respondWithError(req, res, '', null, 500)
			}

		}).catch(error => {
			console.log(error)
			return respondWithError(req, res, '', null, 500)
		})
	} catch (error) {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	}

}


// need to refactor API based on performance later
exports.createKeys = async function (req, res) {
	try {
		let lngKey = req.body.lngKey;
		let lngValues = req.body.lngValues
		let app = req.body.app

		let dbLanguages = await Language.findAll({
			where: {
				deleteStatus: false
			},
			order: [['isDefault', 'DESC']]
		})

		let savedLngValues = []
		let defaultValue = null;

		let rpcLngData = []

		for (const dbLngData of dbLanguages) {
			if (!defaultValue && dbLngData.isDefault) {
				defaultValue = lngValues.find(lngValue => lngValue.lngCode === dbLngData.languageCode)
			}


			let getLngData = '[]';
			try {
				getLngData = await fs.readFileSync(path.join(__dirname, `../../i18n/${dbLngData.languageCode}.json`))
			} catch (error) {
				getLngData = '[]'
			}

			let parsedLanguageData = JSON.parse(getLngData);
			let isFound = false;

			for (const lngData of lngValues) {

				if (lngData.lngCode === dbLngData.languageCode && lngData.lngValue) {
					// console.log('language found ', lngData, i)
					isFound = true
					parsedLanguageData = general_helper.pushToArray(parsedLanguageData,
						{
							key: lngKey,
							language: dbLngData.name,
							app: app ? app : null,
							value: lngData.lngValue,
							isSet: true
						}, 'key', app)

					savedLngValues.push({
						lngCode: dbLngData.languageCode,
						lngValue: lngData.lngValue
					})
				}
			}

			if (!isFound && defaultValue) {
				let keyExist = lngValues.find(lngValue => lngValue.lngCode === dbLngData.languageCode)
				if (!keyExist) {
					parsedLanguageData = general_helper.pushToArray(parsedLanguageData,
						{
							key: lngKey,
							app: app ? app : null,
							language: dbLngData.name,
							value: defaultValue.lngValue ? defaultValue.lngValue : "",
							isSet: false
						}, 'key', app)
					savedLngValues.push({
						lngCode: dbLngData.languageCode,
						lngValue: defaultValue.lngValue
					})
				}
			}

			try {
				rpcLngData.push({
					languageCode: dbLngData.languageCode,
					languageData: parsedLanguageData
				})
				await fs.writeFileSync(path.join(__dirname, `../../i18n/${dbLngData.languageCode}.json`), JSON.stringify(parsedLanguageData), 'utf8')

			} catch (error) {
				console.log(dbLngData.languageCode, error)
			}
		}

		// return res.send('testing');

		console.log('savedLngValues', savedLngValues)
		if (!savedLngValues.length) {
			return res.status(400).send({
				status: false,
				message: 'language key is not saved'
			})
		}

		// console.log(JSON.stringify(rpcLngData));
		Promise.all([
			rpcClient.RestaurantAppService.saveLanguageStrings({
				data: JSON.stringify(rpcLngData)
			}, (error, rpcResponse) => {
				if (error) {
					console.log('Language key values were updated successfully, could not update on service')
				}
			}),

			rpcClient.RiderAppService.saveLanguageStrings({
				data: JSON.stringify(rpcLngData)
			}, (error, rpcResponse) => {
				if (error) {
					console.log('Language key values were updated successfully, could not update on service')
				}
			})
		])

		return res.send({
			status: true,
			message: 'Language key values were updated successfully',
			data: {
				lngKey: lngKey,
				lngValues: savedLngValues
			}
		})
	} catch (error) {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	}
}


// todo
exports.deleteKeys = async function (req, res) {
	try {
		let lngKey = req.query.lngKey;
		let app = req.query.app

		let languages = await Language.findAll({
			where: {
				deleteStatus: false
			}
		})

		let rpcLngData = []

		for (let language of languages) {
			let lngValues = '[]'
			try {
				lngValues = await fs.readFileSync(path.join(__dirname, `../../i18n/${language.languageCode}.json`))

			} catch (error) {
				lngValues = '[]'
			}

			let parsedLngValues = JSON.parse(lngValues);
			let findIndex = -1
			if (app) {
				findIndex = parsedLngValues.findIndex((lngVal) => lngVal.key.toLowerCase() === lngKey.toLowerCase() && lngVal.app === app)
			} else {
				findIndex = parsedLngValues.findIndex(lngVal => lngVal.key.toLowerCase() === lngKey.toLowerCase() && !lngVal.app)
			}

			if (findIndex >= 0) {
				parsedLngValues.splice(findIndex, 1);
			}

			rpcLngData.push({
				languageCode: language.languageCode,
				languageData: parsedLngValues
			})
			await fs.writeFileSync(path.join(__dirname, `../../i18n/${language.languageCode}.json`), JSON.stringify(parsedLngValues), 'utf8')

		}


		// console.log(JSON.stringify(rpcLngData));
		Promise.all([
			rpcClient.RestaurantAppService.saveLanguageStrings({
				data: JSON.stringify(rpcLngData)
			}, (error, rpcResponse) => {
				if (error) {
					console.log('Language key values were updated successfully, could not update on service')
				}
			}),

			rpcClient.RiderAppService.saveLanguageStrings({
				data: JSON.stringify(rpcLngData)
			}, (error, rpcResponse) => {
				if (error) {
					console.log('Language key values were updated successfully, could not update on service')
				}
			})
		])

		return res.status(200).send({
			status: true,
			message: 'Language key deleted successfully'
		})

	} catch (error) {
		console.log(error)
		return respondWithError(req, res, '', null, 500)
	}
}
