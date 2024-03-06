//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

// libraries
const { Op } = require('sequelize')

// Config

// Custom Libraries
const { sendEmail } = require('../../lib/email');

// Modals
var Gender = require('../SqlModels/Gender');

// helpers
// const general_helpers = require('../../helpers/general_helper');

// Constants
// const constants = require('../../../config/constants');
// const { APP_SECRET } = require('../../../config/constants');

exports.getAll = async function (req, res) {
    let lngCode = req.headers['language']

    Gender.findAll({
        lngCode: lngCode,
        where: {
            deleteStatus: false
            
        },
    }).then(genders => {
        if (genders && genders.length) {
            return res.send({
                message: 'Gender data fetched successfully.',
                data: genders
            })
        } else {
            return res.status(400).send({
                message: 'Unable to fetch gender. genders not found.',
                data: []
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.getOne = async function (req, res) {
    let id = req.params.id
    Gender.findOne({
        where: {
            [Op.and]: [
                {
                    id: id
                },
                {
                    deleteStatus: false
                }
            ]
        }
    }).then(data => {
        if (data) {
            return res.send({
                message: 'Gender data fetched successfully.',
                address: data
            })
        } else {
            return res.status(400).send({
                message: 'Unable to fetch Gender. Gender not found.',
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.post = async function (req, res) {
    let gender = req.body.gender
    console.log('gender', gender)
    let genderData = new Gender
    genderData.gender = gender

    genderData.save().then(async newGender => {


        let updatedGenderData = await Gender.findOne({
            where: {
                id: newGender.id
            }
        })

        return res.send({
            message: 'Address has been added successfully.',
            data: updatedGenderData
        })

    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.update = async function (req, res) {

    let genderId = req.body.id

    Gender.findOne({
        where: {
            deleteStatus: false,
            id: genderId
        }
    }).then(genderData => {
        if (!genderData) {
            return res.status(400).send({
                message: 'Gender Not Found.',
            })
        }

        genderData.gender = req.body.gender

        genderData.save().then((gender) => {
            return res.send({
                message: 'Gender has been Updated successfully.',
                data: gender
            })

        }).catch(err => {
            console.log("err:", err);
            return respondWithError(req, res, '', null, 500)
        })
    }).catch(err => {
        console.log("err:", err);
        return respondWithError(req, res, '', null, 500)
    })

}

exports.delete = async function (req, res) {
    let id = req.params.id
    Gender.update({ deleteStatus: true }, {
        where: {
            // [Op.and]: [
            //     {
            // userId: req.user.id
            // },
            // {
            id: id
            //     }
            // ]
        },
    }).then(genderData => {
        if (genderData && genderData[0]) {
            return res.send({
                message: 'Gender has been deleted successfully.',
            })
        } else {
            return res.status(400).send({
                message: 'Unable to delete gender. Gender not found.',
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}