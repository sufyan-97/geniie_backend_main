//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

var Modal = require('../SqlModels/Notification');
var UserNotification = require('../SqlModels/UserNotification');
const general_helper = require('../../helpers/general_helper');
const constants = require('../Constants/app.constants');

exports.getAll = async function (req, res) {

    let size = req.query.size ? Number(req.query.size) : 10
    let pageNo = req.query.pageNo ? Number(req.query.pageNo) : 1
    let offset = 0
    if (pageNo > 1) {
        offset = size * pageNo - size
    }

    let pagination = {}
    pagination.limit = size
    pagination.offset = offset
    pagination.pageNo = pageNo

    Modal.findAll({
        where:
        {
            deleteStatus: false
        },
        attributes: ['id', 'subject', 'description', 'notificationData', 'image', 'createdAt'],
        include: { model: UserNotification, where: { userId: req.user.id }, attributes: ['status'], required: true },
        order: [['createdAt', 'DESC']],
        ...pagination
    }).then(data => {
        if (data && data.length) {
            let dataToSend = []
            data.map(item => {
                item = item.toJSON()
                item.status = item.user_notifications[0].status
                delete item.user_notifications
                dataToSend.push(item)
            })
            return res.send({
                message: 'Data fetched successfully.',
                data: dataToSend
            })
        } else {
            return res.send({
                message: 'Unable to fetch data. Notification not found.',
                data: []
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.update = async function (req, res) {
    let where = {
        userId: req.user.id,
        deleteStatus: false
    }
    let paramValue = req.params.id

    if (Number(paramValue)) {
        where.notificationId = Number(paramValue)
    } else if (paramValue !== 'all') {
        return res.status(422).send({
            message: 'Invalid Data.',
        })
    }
    console.log(where);

    UserNotification.update({ status: 'read' }, { where }).then(item => {
        console.log(item);
        return res.send({
            message: 'Marked As read.',
        })

    }).catch(error => {
        console.log(error);
        return respondWithError(req, res, '', null, 500)
    })

}