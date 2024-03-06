//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')
const fs = require('fs')
const { Op } = require('sequelize')
const path = require('path');

// Modals
var Modal = require('../SqlModels/Role');
const constants = require('../Constants/app.constants');
const general_helper = require('../../helpers/general_helper');
const { default: axios } = require('axios');
const PostcodeAddresses = require('../SqlModels/postcodeAddresses');
const { postcodeAddresses } = require('../MongoModels/PostcodeAddresses');

exports.getAll = async function (req, res) {
    let postCodesList = []
    let addressesList = []
    let completePostcodeDetails = {}
    let bulkInsertData = []
    let addressDetails = []


    try {


        let getPostcodesData = '[]';

        let postcodesList = {}
        getPostcodesData = await fs.readFileSync(path.join(__dirname, `../../postcodes/postcodes.json`))




        let getParsedPostcodesData = JSON.parse(getPostcodesData);


        console.log('getParsedPostcodesData =>', getParsedPostcodesData.length);

        if (getParsedPostcodesData && getParsedPostcodesData.length) {
            let filteredArray = []

            for (let i = 0; i < 1; i++) {
                filteredArray.push(getParsedPostcodesData[i])
            }

            // console.log('filteredArray', getParsedPostcodesData);
            if (getParsedPostcodesData && getParsedPostcodesData.length) {
                (async function myLoop(i) {
                    try {


                        console.log('i =>', i);
                        console.log('getParsedPostcodesData[i]', getParsedPostcodesData[i]);
                        let alreadyExistCheck = await postcodeAddresses.findOne({

                            postcode: getParsedPostcodesData[i]

                        })
                        // console.log('alreadyExistCheck =>', alreadyExistCheck);
                        if (!alreadyExistCheck) {
                            setTimeout(async function () {
                                try {


                                    if (getParsedPostcodesData && getParsedPostcodesData.length) {

                                        // const shuffled = getParsedApiKeysData.sort(() => 0.5 - Math.random());
                                        // console.log('shuffled =>', shuffled);

                                        // Get sub-array of first n elements after shuffled
                                        // let selected = shuffled.slice(0, 1);

                                        // console.log('selected =>', selected);
                                        try {

                                            postcodesList = await axios.get(`https://api.addressian.co.uk/v2/autocomplete/${getParsedPostcodesData[i]}`, {
                                                headers: {
                                                    "x-api-key": "LTJOh4wwVT5lQDjQrCwSM5O7P0E9BWIB26GFf9nR",
                                                },
                                            })
                                        } catch (error) {
                                            console.log(error);
                                        }
                                        // console.log('addressesList', addressesList);
                                        // console.log('postcodesList', postcodesList.data);
                                        if (postcodesList) {
                                            postcodesList.data.map(data => {
                                                // console.log('data =>', data);
                                                addressDetails.push(data)
                                                let address = ''
                                                for (let k = 0; k < data.address.length; k++) {
                                                    if (data.address.length >= 1) {
                                                        address = address + ` ${data.address[k]},`
                                                    } else if (k == data.address.length - 1) {
                                                        address = address + ` ${data.address[k]},`
                                                    } else if (k == 0) {
                                                        address = `${data.address[k]},`
                                                    }
                                                }
                                                address = address.trim()
                                                // console.log('address', address);
                                                // console.log('addresses list =>', data.address[0] + '' + data.city + ', ' + '' + data.postcode);
                                                addressesList.push(`${address} ${data.postcode}`)
                                                // addressesList.push(`${data.address[0] && data.address[0]} ${data.address[1] && data.address[1]} ${data.address[2] && data.address[2]}, ${data.postcode}`)
                                            })
                                        }
                                        // `${data.address[0]}  ${data.city}, ${data.postcode}`

                                        try {
                                            completePostcodeDetails = await axios.get(`https://api.addressian.co.uk/v1/postcode/${getParsedPostcodesData[i]}`, {
                                                headers: {
                                                    "x-api-key": "LTJOh4wwVT5lQDjQrCwSM5O7P0E9BWIB26GFf9nR",
                                                },
                                            })
                                        } catch (error) {
                                            console.log(error)
                                        }
                                        // console.log('completePostcodeDetails', completePostcodeDetails);
                                        console.log('addressesList.length', addressesList.length);
                                        if (addressesList && addressesList.length) {

                                            for (let j = 0; j < addressesList.length; j++) {

                                                bulkInsertData.push(
                                                    {
                                                        postcode: getParsedPostcodesData[i],
                                                        postcodeAddress: addressesList[j],
                                                        latitude: completePostcodeDetails.data.latitude,
                                                        longitude: completePostcodeDetails.data.longitude,
                                                        addressDetails: addressDetails[j],
                                                        city: addressDetails[j].city,
                                                        street: addressDetails[j].street,
                                                        completePostcodeDetails: completePostcodeDetails.data
                                                    }
                                                )

                                            }
                                            addressesList = []
                                            addressDetails = []
                                        } else {
                                            bulkInsertData.push(
                                                {
                                                    postcode: getParsedPostcodesData[i],
                                                    postcodeAddress: '',
                                                    latitude: completePostcodeDetails.data.latitude,
                                                    longitude: completePostcodeDetails.data.longitude,
                                                    addressDetails: addressDetails,
                                                    city: '',
                                                    street: '',
                                                    completePostcodeDetails: completePostcodeDetails.data
                                                }
                                            )
                                        }

                                        // console.log('bulkInsertData', bulkInsertData);
                                        try {
                                            if (bulkInsertData && bulkInsertData.length) {
                                                await postcodeAddresses.insertMany(bulkInsertData)
                                            }
                                            bulkInsertData = []
                                            // res.send({ status: 200 })
                                        } catch (error) {
                                            console.log('error', error);
                                        }

                                    } //  your code here  
                                    --i
                                    if (i >= 0) myLoop(i);   //  decrement i and call myLoop again if i > 0


                                } catch (error) {
                                    console.log('error =>', error);
                                }





                            }, 1000)
                        } else {
                            --i
                            if (i >= 0) myLoop(i);
                        }
                    } catch (error) {
                        console.log('error =>', error);
                    }
                })(9800);
            }
            return res.send({ status: 200 })
        }

    } catch (error) {
        console.log(error);
    }

}

exports.getOne = async function (req, res) {
    let postcode = req.params.postcode.toUpperCase()
    // console.log('postcode postcode', postcode)
    postcode = postcode.replace(/ +/g, "")
    postcodeAddresses.find({

        postcode: postcode,


    }).then(async data => {
        // console.log('data data', data)
        if (data && data.length) {
            return res.send({
                message: 'Data fetched successfully.',
                data: data
            })
        } else {
            let addressesList = []
            let postcodesList = {}
            let completePostcodeDetails = {}
            let bulkInsertData = []
            let addressDetails = []
            try {
                postcodesList = await axios.get(`https://api.addressian.co.uk/v2/autocomplete/${postcode}`, {
                    headers: {
                        "x-api-key": "LTJOh4wwVT5lQDjQrCwSM5O7P0E9BWIB26GFf9nR",
                    },
                })
            } catch (error) {
                console.log('error', error);
                return res.send({
                    message: 'Unable to fetch data.',
                })
            }
            // console.log('addressesList', addressesList);
            // console.log('postcodesList', postcodesList.data);
            // console.log('postcodesList postcodesList',postcodesList)
            if (postcodesList) {
                postcodesList.data.map(data => {
                    // console.log('data =>', data);
                    addressDetails.push(data)
                    let address = ''
                    for (let k = 0; k < data.address.length; k++) {
                        if (data.address.length >= 1) {
                            address = address + ` ${data.address[k]},`
                        } else if (k == data.address.length - 1) {
                            address = address + ` ${data.address[k]},`
                        } else if (k == 0) {
                            address = `${data.address[k]},`
                        }
                    }
                    address = address.trim()
                    // console.log('address', address);
                    // console.log('addresses list =>', data.address[0] + '' + data.city + ', ' + '' + data.postcode);
                    addressesList.push(`${address} ${data.postcode}`)
                    // addressesList.push(`${data.address[0] && data.address[0]} ${data.address[1] && data.address[1]} ${data.address[2] && data.address[2]}, ${data.postcode}`)
                })
            }
            // `${data.address[0]}  ${data.city}, ${data.postcode}`

            try {
                completePostcodeDetails = await axios.get(`https://api.addressian.co.uk/v1/postcode/${postcode}`, {
                    headers: {
                        "x-api-key": "LTJOh4wwVT5lQDjQrCwSM5O7P0E9BWIB26GFf9nR",
                    },
                })

            } catch (error) {
                console.log('error', error);
                return res.send({
                    message: 'Unable to fetch data.',
                })
            }
            // console.log('completePostcodeDetails', completePostcodeDetails);
            // console.log('addressesList.length', addressesList.length);
            if (addressesList && addressesList.length) {

                for (let j = 0; j < addressesList.length; j++) {

                    bulkInsertData.push(
                        {
                            postcode: postcode,
                            postcodeAddress: addressesList[j],
                            latitude: completePostcodeDetails.data.latitude,
                            longitude: completePostcodeDetails.data.longitude,
                            addressDetails: addressDetails[j],
                            city: addressDetails[j].city,
                            street: addressDetails[j].street,
                            completePostcodeDetails: completePostcodeDetails.data
                        }
                    )

                }
                addressesList = []
                addressDetails = []
            } else {
                bulkInsertData.push(
                    {
                        postcode: postcode,
                        postcodeAddress: '',
                        latitude: completePostcodeDetails.data.latitude,
                        longitude: completePostcodeDetails.data.longitude,
                        addressDetails: addressDetails,
                        city: '',
                        street: '',
                        completePostcodeDetails: completePostcodeDetails.data
                    }
                )
            }

            // console.log('bulkInsertData', bulkInsertData);
            let dataToSend = []
            let createdItem = null
            try {
                if (bulkInsertData && bulkInsertData.length) {
                    createdItem = await postcodeAddresses.insertMany(bulkInsertData)
                }
                bulkInsertData = []
                // console.log('createdItem', createdItem);
                if (createdItem) {
                    dataToSend = await postcodeAddresses.find({ 
                        where: {
                            postcode: createdItem[0].postcode
                        }
                    })
                }
                // res.send({ status: 200 })
            } catch (error) {
                console.log('error', error);
            }
            if (dataToSend) {
                return res.send({
                    message: 'Data fetched successfully.',
                    data: dataToSend
                })
            } else {
                return res.send({
                    message: 'Unable to fetch data.',
                })
            }
        }

    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

// exports.post = async function (req, res) {

//     let postData = new Modal({
//         roleName: req.body.roleName,
//         // isActive: req.body.isActive,
//         // isAgent: req.body.isAgent,
//     })

//     if (req.body.isActive == false || req.body.isActive) {
//         postData.isActive = req.body.isActive
//     }

//     if (req.body.isAgent == false || req.body.isAgent) {
//         postData.isAgent = req.body.isAgent
//     }

//     postData.save().then(postedData => {
//         return res.send({
//             message: 'Role has been added successfully.',
//             data: postedData
//         })
//     }).catch(err => {
//         console.log(err);
//         return respondWithError(req, res, '', null, 500)
//     })
// }

// exports.update = async function (req, res) {

//     let updateData = {
//         roleName: req.body.roleName,
//         // isActive: req.body.isActive
//     }
//     let id = req.body.id

//     if (req.body.isActive == false || req.body.isActive) {
//         updateData.isActive = req.body.isActive
//     }

//     if (req.body.isAgent == false || req.body.isAgent) {
//         updateData.isAgent = req.body.isAgent
//     }

//     Modal.update(updateData, {
//         where: {
//             id: id,
//             roleName: { [Op.not]: 'admin' }
//         },
//     }).then(async data => {
//         if (data && data[0]) {
//             let updatedData = await Modal.findOne({ where: { id: id } })
//             return res.send({
//                 message: 'Data has been updated successfully.',
//                 data: updatedData
//             })
//         } else {
//             return res.status(400).send({
//                 message: 'Unable to update data. Data not found.',
//             })
//         }
//     }).catch(err => {
//         console.log(err);
//         return respondWithError(req, res, '', null, 500)
//     })
// }

// exports.delete = async function (req, res) {
//     let id = req.params.id
//     Modal.destroy({
//         where: {
//             id: id,
//             roleName: { [Op.not]: 'admin' }
//         },
//     }).then(data => {
//         return res.send({
//             message: 'Data has been deleted successfully.',
//         })
//         if (data && data[0]) {
//             return res.send({
//                 message: 'Data has been deleted successfully.',
//             })
//         } else {
//             return res.status(400).send({
//                 message: 'Unable to delete data. Data not found.',
//             })
//         }
//     }).catch(err => {
//         console.log(err);
//         return respondWithError(req, res, '', null, 500)
//     })
// }
