//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

// libraries
const { Op } = require('sequelize')

// Modals
const Filter = require('../SqlModels/Filter');

exports.getAll = async function (req, res) {
    let appName = req.query.appName

    let filters = []
    if (appName) {
        filters = await Filter.findAll({
            where: {
                appName: appName
            }
        })
    } else {
        filters = await Filter.findAll()
    }

    if (filters && filters.length) {
        return res.send({
            message: 'Filters fetched successfully.',
            data: filters
        })
    } else {
        return res.send({
            message: 'Unable to fetch Filter. Filter not found.',
            data: []
        })
    }
}

exports.getActive = async function (req, res) {
    let appName = req.query.appName

    let filters = [];
    if (appName) {
        filters = await Filter.findAll({
            where: {
                appName: appName,
                isActive: true,
            }
        })
    } else {
        filters = await Filter.findAll({
            where: {
                isActive: true,
            }
        })
    }

    if (filters && filters.length) {
        return res.send({
            message: 'Filters fetched successfully.',
            data: filters
        })
    } else {
        return res.status(500).send({
            message: 'Unable to fetch Filter. Filter not found.',
            data: []
        })
    }
}

exports.getOne = async function (req, res) {
    let id = req.params.id
    Filter.findOne({
        where: {
            id: id,
            isActive: true,
        }
    }).then(data => {
        if (data) {
            return res.send({
                message: 'filter Option fetched successfully.',
                data: data
            })
        } else {
            return res.status(400).send({
                message: 'Unable to fetch filter. filter not found.',
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.post = async function (req, res) {
    let name = req.body.name
    let isActive = req.body.isActive
    let appName = req.query.appName

    let filter = null
    // if (appName) {
    filter = await Filter.findOne({
        where: {
            // appName: appName,
            [Op.or]: [
                {
                    name: name
                },
                {
                    slug: name
                }
            ],
        }
    })
    // } else {
    //     filter = await Filter.findOne({
    //         where: {
    //             appName: null,
    //             [Op.or]: [
    //                 {
    //                     name: name
    //                 },
    //                 {
    //                     slug: name
    //                 }
    //             ],
    //         }
    //     })
    // }

    if (filter) {
        if (filter.name == name) {
            return res.status(500).send({
                message: 'filter already exist.',
            });
        } else if (filter.slug == name) {
            return res.status(500).send({
                message: 'slug already exist.',
            });
        }
    } else {
        let filter = new Filter()
        filter.name = name
        filter.slug = name
        if (isActive || isActive == false)
            filter.isActive = isActive
        filter.appName = appName
        filter.save().then(async data => {

            let createdData = await Filter.findOne({
                where: {
                    id: data.id
                }
            })

            return res.send({
                message: 'Filter has been added successfully.',
                data: createdData
            })

        }).catch(err => {
            console.log(err);
            return respondWithError(req, res, '', null, 500)
        })
    }

}

exports.update = async function (req, res) {

    let id = req.body.id
    let name = req.body.name
    let isActive = req.body.isActive

    let filter = null
    if (name) {
        filter = await Filter.findOne({
            where: {
                [Op.or]: [
                    {
                        name: name
                    },
                    {
                        slug: name
                    }
                ],
                [Op.not]: {
                    id: id
                },
            }
        })
    }

    if (filter) {
        if (filter.name == name) {
            return res.status(500).send({
                message: 'filter already exist.',
            });
        } else if (filter.slug == name) {
            return res.status(500).send({
                message: 'slug already exist.',
            });
        }
    }

    Filter.findOne({
        where: {
            id: id
        }
    }).then(data => {
        if (!data) {
            return res.status(500).send({
                message: 'filter not found.',
            })
        } else {
            if (name)
                data.name = name
            if (isActive || isActive == false)
                data.isActive = isActive

            data.save().then(async (filter) => {

                let updatedData = await Filter.findOne({
                    where: {
                        id: filter.id
                    }
                })

                return res.send({
                    message: 'filter has been updated successfully.',
                    data: updatedData
                })

            }).catch(err => {
                console.log("err:", err);
                return respondWithError(req, res, '', null, 500)
            })
        }
    }).catch(err => {
        console.log("err:", err);
        return respondWithError(req, res, '', null, 500)
    })

}

exports.delete = async function (req, res) {
    let id = req.params.id
    console.log(id);
    Filter.destroy({
        where: {
            id: id
        },
    }).then(data => {
        if (data) {
            return res.send({
                message: 'Filter has been deleted successfully.',
            })
        } else {
            return res.status(400).send({
                message: 'Unable to delete Filter. Filter not found.',
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}