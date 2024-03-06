//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

const { Op } = require('sequelize')

// Modals
var Language = require('../SqlModels/Language');
var UserLanguage = require('../SqlModels/UserLanguage');

exports.getAll = async function (req, res) {
    Language.findAll({
        where:
        {
            deleteStatus: false
        },
        order: ["id"],
        include: [
            {
                model: UserLanguage,
                where: {
                    userId: req.user.id
                },
                required: false
            }
        ]
    }).then(data => {
        if (data && data.length) {
            let requiredData = []
            data.map(item => {
                let itemData = {
                    id: item.id,
                    name: item.name,
                    isSelected: false
                }
                if (item.user_language) {
                    itemData.isSelected = true
                    requiredData.unshift(itemData)
                } else {
                    requiredData.push(itemData)
                }
            })

            return res.send({
                message: 'Languages data fetched successfully.',
                languages: requiredData
            })

        } else {
            return res.status(200).send({
                message: 'Unable to fetch notification setting. Notification Settings not found.',
                languages: []
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.update = async function (req, res) {

    Language.findOne({
        where: {
            [Op.and]: [
                {
                    deleteStatus: false
                },
                {
                    id: req.body.languageId
                }
            ]
        }
    }).then(languageData => {
        if (languageData) {

            UserLanguage.findOne({
                where: {
                    userId: req.user.id
                }
            }).then(async data => {
                if (data) {
                    data.languageId = req.body.languageId
                    data.save()
                    return res.send({
                        message: 'Language has been changed successfully.',
                    })
                } else {
                    let userLanguage = new UserLanguage({
                        languageId: req.body.languageId,
                        userId: req.user.id
                    })
                    await userLanguage.save()
                    return res.send({
                        message: 'Language has been changed successfully.',
                    })
                }
            }).catch(err => {
                console.log(err);
                return respondWithError(req, res, '', null, 500)
            })
        } else {
            return res.status(400).send({
                message: 'Unable to find language.',
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}
