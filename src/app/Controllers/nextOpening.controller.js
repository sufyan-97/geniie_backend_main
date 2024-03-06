//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

// libraries

const { Op } = require('sequelize')

// // Config
// var redisJwt = require('../../../config/jwt');
// const redisClient = require("../../../config/redis");


// Modals
var NextOpeningTime = require('../SqlModels/NextOpeningTime');
// var { Restaurant } = require('../SqlModels/Restaurant');


exports.getAll = async function (req, res) {
    NextOpeningTime.findAll().then((openingTimes) => {
        return res.status(200).send({
            data: openingTimes
        })
    }).catch((error) => {
        console.log(error);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.save = async function (req, res) {
    try {
        if (req.user && req.user.roles.length && req.user.roles[0].roleName != 'admin') {
            return res.status(401).send({ message: 'Unauthorized Access' })
        }
        let openingTime = req.body.openingTime;
        let openingTimeType = req.body.openingTimeType;

        if (openingTimeType == 'rest_of_the_day' || openingTimeType == 'indefinitely' || openingTimeType == 'other') {
            openingTime = 0;
        }

        let openingTimeExists = await NextOpeningTime.findOne({
            where: {
                openingTime,
                openingTimeType
            }
        })

        if (openingTimeExists) {
            return res.status(400).send({
                message: "Given interval is already exists"
            })
        }

        let nextOpeningTime = await new NextOpeningTime({
            openingTime,
            openingTimeType
        })

        let savedData = await nextOpeningTime.save()

        return res.status(200).send({
            message: "Interval saved successfully",
            data: savedData,
        })
    } catch (error) {
        console.log(error);
        return respondWithError(req, res, '', null, 500)
    }
}


exports.update = async function (req, res) {
    if (req.user && req.user.roles.length && req.user.roles[0].roleName != 'admin') {
        return res.status(401).send({ message: 'Unauthorized Access' })
    }
    return res.send('testing')
}


exports.delete = async function (req, res) {
    try {
        if (req.user && req.user.roles.length && req.user.roles[0].roleName != 'admin') {
            return res.status(401).send({ message: 'Unauthorized Access' })
        }

        let intervalId = req.params.id

        await NextOpeningTime.destroy({
            where: {
                id: intervalId
            }
        })
        return res.status(200).send({
            message: 'Interval deleted successfully'
        })
    } catch (error) {
        console.log(error);
        return respondWithError(req, res, '', null, 500)
    }
}