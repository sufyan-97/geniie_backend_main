//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

const { Op } = require('sequelize');
const { saveRecentSearch } = require('../../helpers/general_helper');
// Modals
var Modal = require('../SqlModels/RecentSearch');

exports.getAll = async function (req, res) {

    let uid = req.user ? req.user.id : null;

    if (uid) {
        Modal.findAll({
            where: {
                deletedAt: null,
                userId: uid
            },
            attributes: ["id", "key", "location", "createdAt"],
        }).then(data => {
            if (data && data.length) {
                return res.send({
                    message: 'Data fetched successfully.',
                    data: data
                })
            } else {
                return res.send({
                    message: 'No data found.',
                    data: []
                })
            }
        }).catch(err => {
            // console.log(err);
            return respondWithError(req, res, '', null, 500)
        })
    }

}

exports.bulkPost = async function (req, res) {

    let uid = req.user ? req.user.id : null;
    let data = req.body;
    // console.log(data);
    data = data.map(x => (x = { ...x, userId: uid }))
    // console.log(data[0]);
    let isSaved = await saveRecentSearch(data[0])
    if (isSaved) {
        return res.send({ message: "Recent searches successfully created." });
    } else {
        return respondWithError(req, res, '', null, 500)
    }
}

exports.delete = async function (req, res) {

    let id = req.params.id
    let dt = Date.now();

    Modal.update({ deletedAt: dt }, {
        where: {
            id: id,
            deletedAt: null
        },
    }).then(data => {
        if (data && data[0]) {
            return res.send({
                message: 'Service has been deleted successfully.',
            })
        } else {
            return res.status(400).send({
                message: 'Unable to delete data. Data not found.',
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })

}

exports.bulkDelete = async function (req, res) {

    let uid = req.user ? req.user.id : null
    let dt = Date.now();

    if (uid) {
        Modal.update({ deletedAt: dt }, {
            where: {
                userId: uid,
                deletedAt: null
            },
        }).then(data => {
            if (data && data[0]) {
                return res.send({
                    message: 'Data has been deleted successfully.',
                })
            } else {
                return res.status(400).send({
                    message: 'No Data found.',
                })
            }
        }).catch(err => {
            return respondWithError(req, res, '', null, 500)
        })
    } else {
        return respondWithError(req, res, '', null, 500)
    }


}


// ************ SAVE RECENT SEARCH FROM RPC ************ //
exports.saveRecentSearchRpc = async function (call, callback) {
    try {
        // console.log(call);
        let isSaved = await saveRecentSearch(call.request)
        callback(null, { success: isSaved })
    } catch (error) {
        callback({
            message: 'Interval server error'
        })
    }

}
