//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

const { Op } = require('sequelize')

// Modals
var Modal = require('../SqlModels/RejectionReason');
var ReasonModuleModal = require('../SqlModels/ReasonModule');
var ModuleType = require('../SqlModels/ModuleType');

exports.getAll = async function (req, res) {

    let moduleType = req.query.moduleType;
    let include = [];

    if (req.user.roles[0].roleName != 'admin') {
        if (moduleType) {
            include.push({
                model: ModuleType,
                where: {
                    type: moduleType,
                    deleteStatus: false,
                },
                attributes: ['id', 'type']
            })
        }
    } else {
        if (!moduleType) {
            include.push({
                model: ModuleType,
                where: {
                    deleteStatus: false,
                },
                attributes: ['id', 'type']
            })
        } else {
            include.push({
                model: ModuleType,
                where: {
                    type: moduleType,
                    deleteStatus: false,
                },
                attributes: ['id', 'type']
            })
        }
    }

    Modal.findAll({
        where: {
            deletedAt: null,
        },
        attributes: ['id', 'text'],
        include: include
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
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.getOne = async function (req, res) {
}

exports.post = async function (req, res) {

    // console.log(req.body);
    let text = req.body.text;
    let moduleTypes = req.body.module_types;

    let isReasonExist = await Modal.findOne({
        where: {
            text,
            deletedAt: null,
        },
        attributes: ['id']
    })
    if (isReasonExist) {
        return res.status(400).send({
            message: 'rejection reason already exist.'
        })
    }

    let postData = new Modal({
        text
    })

    postData.save().then(async (postedData) => {

        for (let i = 0; i < moduleTypes.length; i++) {
            let item = moduleTypes[i].id
            await ReasonModuleModal.create({
                moduleTypeId: item,
                reasonId: postedData.id,
            })
        }
        // console.log(postedData.id);

        let returnData = await Modal.findOne({
            where: {
                id: postedData.id,
            },
            attributes: ['id', 'text'],
            include: [{
                model: ModuleType,
                attributes: ['id', 'type']
            }]
        })

        return res.send({
            message: 'Data item has been added successfully.',
            data: returnData
        })
    }).catch(err => {
        return respondWithError(req, res, '', null, 500)
    })

}

exports.update = async function (req, res) {

    let id = req.body.id;
    let text = req.body.text;
    let moduleTypes = req.body.module_types;

    let isReasonExist = await Modal.findOne({
        where: {
            text,
            deletedAt: null,
            [Op.not]: {
                id
            }
        },
        attributes: ['id']
    })
    if (isReasonExist) {
        return res.status(400).send({
            message: 'rejection reason already exist.'
        })
    }

    Modal.findOne({
        where: {
            id,
            deletedAt: null
        }
    }).then(async data => {
        data.text = text;
        data.save().then(async (postedData) => {
            let savedReasonModules = await ReasonModuleModal.findAll({ where: { reasonId: id } })
            for (let i = 0; i < savedReasonModules.length; i++) {
                let savedReasonModule = savedReasonModules[i]
                let index = moduleTypes.findIndex(a => a.id == savedReasonModule.moduleTypeId);
                if (index >= 0) {
                    moduleTypes.splice(index, 1);
                } else {
                    await savedReasonModule.destroy();
                }
            }

            for (let i = 0; i < moduleTypes.length; i++) {
                let item = moduleTypes[i].id
                await ReasonModuleModal.create({
                    moduleTypeId: item,
                    reasonId: id,
                })
            }

            let rejectionReason = await Modal.findOne({
                where: {
                    id: id
                }
            })

            return res.status(200).send({
                message: "data item successfully updated.",
                data: rejectionReason,
            })
        });

    }).catch(err => {
        return respondWithError(req, res, '', null, 500)
    })
}

exports.delete = async function (req, res) {
    let id = req.params.id
    let date = Date.now()

    Modal.update({ deletedAt: date }, {
        where: {
            id: id,
            deletedAt: null
        },
    }).then(data => {
        if (data && data[0]) {
            return res.status(200).send({
                message: 'Item has been deleted successfully.',
            })
        } else {
            return res.status(400).send({
                message: 'Item not found.',
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}