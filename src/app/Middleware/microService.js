const axios = require("axios");
const FormData = require('form-data');
const fs = require("fs");
const path = require('path')

const { MICRO_SERVICES } = require("../../../config/constants");
const app_constants = require("../Constants/app.constants");
const general_helper = require("../../helpers/general_helper");


module.exports = async (req, res) => {
    // console.log('testing here')
    // console.log('req.headers=>', req.headers['timezone']);
    let originalUrl = req.originalUrl
    // console.log('originalUrl:', originalUrl)

    let microService = general_helper.getMicroService(originalUrl)

    let microServiceData = MICRO_SERVICES.find(item => item.endPoint === microService)

    if (!microServiceData) {
        return res.status(404).send({
            message: "Not found"
        })
    }

    let endPoint = ''
    // if (originalUrl.includes('/verified')) {
    //     endPoint = originalUrl.replace(`/${microService}/verified`, '')
    //     let stringifyUser = JSON.stringify(req.user)
    //     req.headers['user'] = stringifyUser
    // } else {
    //     endPoint = originalUrl.replace(`/${microService}`, '')
    // }

    endPoint = originalUrl.replace(`/${microService}`, '')
    let stringifyUser = JSON.stringify(req.user)

    req.headers['user'] = stringifyUser
    if (req.user) {
        let url = `${microServiceData.protocol}://${microServiceData.microserviceBaseUrl}:${microServiceData.port}${endPoint}`
        let method = req.method.toLowerCase()
        if (method === 'get' || method === 'delete') {
            axios[`${method}`](url, {
                headers: {
                    user: req.headers['user'],
                    authorization: req.headers['authorization'],
                    timezone: req.headers['timezone'] ? req.headers['timezone'] : '',
                    language: req.headers['language'] ? req.headers['language'] : 'en',
                    geolocation : req.headers['geolocation'] ? req.headers['geolocation'] : {}

                }
            }).then((response) => {
                return res.status(response.status).send(response.data)
            }).catch(err => {
                if (!err.response) {
                    return res.status(500).send({
                        message: "Internal Server Error."
                    })
                };
                return res.status(err.response.status).send(err.response.data)
            })
            return
        } else {
            let reqBodyData = req.body
            let files = req.files

            let fileUploadError = [];

            let filePaths = [];

            if (files && Object.keys(req.files).length) {
                for (const fileKey in files) {
                    reqBodyData[fileKey] = files[fileKey].length > 1 ? [] : null
                    if (files[fileKey].length > 1) {
                        console.log('save micro-service Multiple files')
                        for (let file = 0; file < files[fileKey].length; file++) {

                            let imageData = await general_helper.uploadImage(files[fileKey][file], microService)
                            if (imageData.status) {
                                reqBodyData[fileKey].push(app_constants.FILE_PREFIX + imageData.imageName);
                                filePaths.push(imageData.imageName)
                            } else {
                                fileUploadError.push(files[fileKey][file])
                                break;
                            }

                        }

                        if (fileUploadError && fileUploadError.length) {
                            break;
                        }

                    } else {
                        console.log('save micro-service Single file')

                        let file = req.files[fileKey]
                        let imageData = await general_helper.uploadImage(file, microService)
                        if (imageData.status) {
                            reqBodyData[fileKey] = app_constants.FILE_PREFIX + imageData.imageName;
                            filePaths.push(imageData.imageName)
                        } else {
                            fileUploadError.push(files[fileKey])
                            break;
                        }
                    }
                }
            }

            if (fileUploadError && fileUploadError.length) {
                // console.log(filePaths)
                // remove already uploaded files
                filePaths.map((filePath) => {
                    fs.unlinkSync(path.join(__dirname, `../../storage/images/${filePath}`))
                })

                // console.log('error', fileUploadError);

                return res.status(422).send({
                    message: "Error: one of the uploaded file Extension is not valid.",
                })
            }

            axios[`${method}`](url, reqBodyData, {
                headers: {
                    user: req.headers['user'],
                    authorization: req.headers['authorization'],
                    timezone: req.headers['timezone'] ? req.headers['timezone'] : '',
                    language: req.headers['language'] ? req.headers['language'] : 'en',
                    geolocation : req.headers['geolocation'] ? req.headers['geolocation'] : {}
                }
            }).then((response) => {
                return res.status(response.status).send(response.data)
            }).catch(err => {
                // remove already uploaded files
                filePaths.map((filePath) => {
                    fs.unlinkSync(path.join(__dirname, `../../storage/images/${filePath}`))
                })

                if (!err.response) {
                    return res.status(500).send({
                        message: "Internal Server Error."
                    })
                };
                return res.status(err.response.status).send(err.response.data)
            })
        }
    } else {
        return res.status(401).send({
            name: "AuthenticationError",
            message: "Unauthorized",
            status: 401
        })
    }
}