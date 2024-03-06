// Libraries
const bcrypt = require('bcrypt');
const generator = require('generate-password');


// Custom Libraries
const { sendEmailV2 } = require('../lib/email');
const rpcClient = require('../lib/rpcClient')


// Models
const User = require("../app/SqlModels/User");
const Role = require("../app/SqlModels/Role");
const BankAccount = require('../app/SqlModels/BankAccount');
const UserAccountBalance = require('../app/SqlModels/UserAccountBalance');
const Country = require('../app/SqlModels/Country');
const UserAddress = require('../app/SqlModels/UserAddress');
const UserMedia = require('../app/SqlModels/UserMedia');
const UserGeneralInformation = require('../app/SqlModels/UserGeneralInformation');
const VehicleInformation = require('../app/SqlModels/VehicleInformation');
const Language = require('../app/SqlModels/Language');
const UserLanguage = require('../app/SqlModels/UserLanguage');



module.exports = {
	businessRegistration: function (user, userServiceData) {
		/**
		 * @pending method should be based on transaction
		*/

		return new Promise(async (resolve, reject) => {

			try {

				let serviceDetails = userServiceData.serviceDetails
				if (!serviceDetails) {
					return reject({
						status: false,
						message: "Error: Service details are not found"
					})
				}

				if (!serviceDetails?.aboutYourRestaurant?.emailAddress || !serviceDetails?.aboutYourRestaurant?.phoneNumber) {
					return reject({
						status: false,
						message: 'Error: Restaurant Information is not valid'
					})
				}

				// provider personal information
				try {
					let {
						businessMedia
					} = serviceDetails;

					await User.update(serviceDetails.personalInformation, {
						where: {
							id: user.id
						},
					})

					await UserMedia.destroy({ where: { id: user.id } })

					let photoIds = businessMedia['photoId']?.map((photoId) => {
						return {
							mediaType: 'photoId',
							fileName: photoId,
							userId: user.id
						}
					})
					if (photoIds) {
						await UserMedia.bulkCreate(photoIds)
					}
				} catch (error) {
					console.log(error)
					return reject({
						status: false,
						message: 'Error: User information is not complete'
					})
				}



				let restaurantUser = await User.findOne({
					where: {
						parentId: user.id,
						deleteStatus: false
					}
				})

				if (!restaurantUser) {
					let restaurantRole = await Role.findOne({
						where: {
							roleName: 'restaurant'
						},
						attributes: ['id']
					})

					if (!restaurantRole) {
						return reject({
							status: false,
							message: 'Error: role is not defined'
						})
					}

					// how to generate password
					// let password = generator.generate({
					// 	length: 10,
					// 	numbers: true
					// });
					// serviceDetails.aboutYourRestaurant.password = await bcrypt.hash(password, 10);

					restaurantUser = new User({
						// firstName: serviceDetails.aboutYourRestaurant.restaurantName,
						firstName: serviceDetails.personalInformation.firstName,
						lastName: serviceDetails.personalInformation.lastName,
						phoneNumber: serviceDetails.aboutYourRestaurant.phoneNumber,
						email: serviceDetails.aboutYourRestaurant.emailAddress,
						username: serviceDetails.aboutYourRestaurant.emailAddress,
						dob: serviceDetails.personalInformation.dob,
						// password: serviceDetails.aboutYourRestaurant.password,
						parentId: user.id
					});
					await restaurantUser.save()
					await restaurantUser.addRole(restaurantRole)

				} else {
					// restaurantUser.firstName = serviceDetails.aboutYourRestaurant.restaurantName
					restaurantUser.firstName = serviceDetails.personalInformation.firstName,
						restaurantUser.lastName = serviceDetails.personalInformation.lastName,
						restaurantUser.phoneNumber = serviceDetails.aboutYourRestaurant.phoneNumber

					await restaurantUser.save()
				}

				try {
					if (!serviceDetails?.bank?.name || !serviceDetails?.bank?.holderName || !serviceDetails?.bank?.accountNumber) {
						return reject({
							status: false,
							message: 'User bank information is not complete'
						})
					}

					let bankAccount = await BankAccount.findOne({
						where: {
							userId: restaurantUser.id
						}
					})

					if (!bankAccount) {
						bankAccount = new BankAccount({
							name: serviceDetails?.bank?.name,
							holderName: serviceDetails?.bank?.holderName,
							accountNumber: serviceDetails?.bank?.accountNumber,
							sortCode: serviceDetails?.bank?.sortCode,
							cityId: serviceDetails?.bank?.cityId,
							postCode: serviceDetails?.bank?.postcode,
							street: serviceDetails?.bank?.billingAddress,
							userId: restaurantUser.id
						})
					} else {

						bankAccount.name = serviceDetails?.bank?.name
						bankAccount.holderName = serviceDetails?.bank?.holderName
						bankAccount.accountNumber = serviceDetails?.bank?.accountNumber
						bankAccount.sortCode = serviceDetails?.bank?.sortCode
						bankAccount.cityId = serviceDetails?.bank?.cityId
						bankAccount.street = serviceDetails?.bank?.billingAddress
						bankAccount.postCode = serviceDetails?.bank?.postcode
						// bankAccount.accountNumber = serviceDetails?.bank?.accountNumber
						// await bankAccount.update({ ...serviceDetails.bank })
					}
					// console.log(bankAccount)
					await bankAccount.save()
				} catch (error) {
					console.log(error)
					return reject({
						status: false,
						message: 'User bank information is not complete'
					})
				}


				serviceDetails.userId = restaurantUser.id

				let {
					aboutYourRestaurant,
					foodHygieneInformation,
					restaurantTimings,
					restaurantMetadata,
					businessMedia,
					menuLink,
				} = serviceDetails;

				delete businessMedia.photoId
				// console.log('updated business media', businessMedia);
				rpcClient.RestaurantService.register({
					data: JSON.stringify({
						...aboutYourRestaurant,
						...foodHygieneInformation,
						...restaurantTimings,
						...restaurantMetadata,
						businessMedia,
						userId: restaurantUser.id,
						providerId: user.id,
						menuLink
					})
				}, async (err, response) => {
					if (err) {
						return reject({ message: "call failed", error: err })
					}

					return resolve(serviceDetails);

				})
			} catch (error) {
				console.log(error)
				return reject({
					message: `Error: ${error.message}`,
				})
			}
		})
	},

	riderRegistration: function (user, registrationRecord) {
		/**
		 * @pending method should be based on transaction
		*/

		return new Promise(async (resolve, reject) => {

			try {

				let registrationData = registrationRecord.registrationData
				if (!registrationData) {
					return reject({
						status: false,
						message: "Error: Service details are not found"
					})
				}

				// provider personal information
				try {
					await User.update(registrationData.personalInformation, {
						where: {
							id: user.id
						},
					})
				} catch (error) {
					console.log(error)
					return reject({
						status: false,
						message: 'Error: User information is not complete'
					})
				}

				try {
					let vehicleInformation = await VehicleInformation.findOne({
						where: {
							userId: user.id
						}
					})
					if (!vehicleInformation) {
						vehicleInformation = new VehicleInformation({
							...registrationData.vehicleInformation,
							userId: user.id,
							isSelected: true
						})
						await vehicleInformation.save()
					} else {
						vehicleInformation.update({ ...registrationData.vehicleInformation })
					}
				} catch (error) {
					console.log(error)
					return reject({
						status: false,
						message: 'Error: Vehicle information is not complete'
					})
				}

				try {
					let userGeneralInformationList = []
					let generalInformationObj = registrationData.generalInformation
					userGeneralInformationList = await UserGeneralInformation.findAll({
						where: {
							userId: user.id
						}
					})
					if (!userGeneralInformationList && userGeneralInformationList.length) {
						for (let key in generalInformationObj) {
							if (generalInformationObj[key]) {
								userGeneralInformationList.push({
									userId: user.id,
									key: key,
									value: generalInformationObj[key],
								})
							}
						}
						await UserGeneralInformation.bulkCreate(userGeneralInformationList);
					} else {
						userGeneralInformationList = []
						await UserGeneralInformation.destroy({
							where: {
								userId: user.id,
							}
						})
						for (let key in generalInformationObj) {
							if (generalInformationObj[key]) {
								userGeneralInformationList.push({
									userId: user.id,
									key: key,
									value: generalInformationObj[key],
								})
							}
						}
						await UserGeneralInformation.bulkCreate(userGeneralInformationList);
					}
				} catch (error) {
					console.log(error)
					return reject({
						status: false,
						message: 'Error: user general information is not complete'
					})
				}
				if (!registrationData.isBranchRider) {
					try {
						let bankAccount = await BankAccount.findOne({
							where: {
								userId: user.id
							}
						})
						if (!bankAccount) {
							bankAccount = new BankAccount({
								...registrationData.bank,
								userId: user.id
							})
							await bankAccount.save()
						} else {
							bankAccount.update({ ...registrationData.bank })
						}
					} catch (error) {
						console.log(error)
						return reject({
							status: false,
							message: 'Error: User bank information is not complete'
						})
					}
				}
				let country = null

				try {
					let country = await Country.findOne({
						where: {
							id: registrationData.location.countryId
						}
					});

					if (!country) {
						return reject({
							status: false,
							message: "Error: related country not found"
						})
					}

				} catch (error) {
					return reject({
						status: false,
						message: "Error: related country not found"
					})
				}


				try {
					let userAddress = await UserAddress.findOne({
						where: {
							userId: user.id
						}
					})
					if (!userAddress) {
						userAddress = new UserAddress({
							userId: user.id,
							address: registrationData.location.address,
							longitude: registrationData.location.longitude,
							latitude: registrationData.location.longitude,
							countryId: registrationData.location.countryId,
							cityId: registrationData.location.cityId,
							postCode: registrationData.location.postCode,
							addressLabelName: ""
						})
						await userAddress.save()
					} else {
						userAddress.update({ ...registrationData.location })
					}
				} catch (error) {
					console.log(error)
					return reject({
						status: false,
						message: 'Error: User address information is not complete'
					})
				}

				try {
					let userAccount = await UserAccountBalance.findOne({
						where: {
							userId: user.id
						}
					})
					if (!userAccount) {
						userAccount = new UserAccountBalance({
							userId: user.id,
							countryId: country.id,
							currencyId: country.currencyId
						})
						await userAccount.save()
					}
				} catch (error) {
					console.log(error)
					return reject({
						status: false,
						message: 'Error: User bank information is not complete'
					})
				}

				try {
					console.log('registrationRecord.registrationData.media', registrationRecord.registrationData.media);
					await UserMedia.destroy({ where: { userId: user.id } })
					let mediaCreateArray = []
					let userMedia = await UserMedia.findAll({ where: { userId: user.id } })
					for (let mediaKey in registrationData.media) {
						registrationData.media[mediaKey].map(item => {
							let isNeeded = true
							userMedia.map(alreadyAddedMedia => {
								if (alreadyAddedMedia.mediaType === mediaKey && alreadyAddedMedia.fileName === item) {
									isNeeded = false
									return
								}
							})
							if (isNeeded) {
								mediaCreateArray.push({
									mediaType: mediaKey,
									userId: user.id,
									fileName: item.path,
									expiryDate: item.expiryDate
								})
							}
						})
					}
					if (mediaCreateArray && mediaCreateArray.length) {
						await UserMedia.bulkCreate(mediaCreateArray)
					}
				} catch (error) {
					console.log(error)
					return reject({
						status: false,
						message: 'Error: User medias information is not complete'
					})
				}
				if (!registrationData.isBranchRider) {
					try {

						let languageData = await Language.findOne({
							where: {
								name: registrationRecord.registrationData.personalInformation.language
							},
							attributes: ["id"]
						})
						console.log('languageId =>', languageData.id);

						await UserLanguage.create({
							userId: user.id,
							languageId: languageData.id
						})

					} catch (error) {
						console.log(error)
						return reject({
							status: false,
							message: 'Error: User language information is not complete'
						})
					}
				}

				try {
					registrationRecord.registrationData = registrationData;

					registrationRecord.status = 'waiting for approval';
					await registrationRecord.save()
					return resolve(true);

				} catch (error) {
					console.log(error)
					return reject("Error: Internal Server Error.")
				}


			} catch (error) {
				console.log(error)
				return reject({
					message: `Error: ${error.message}`,
				})
			}
		})
	},
}
