//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

// libraries
const { Op } = require('sequelize')

// Modals
var SortOption = require('../SqlModels/SortOption');


exports.getAll = async function (req, res) {
    let appName = req.query.appName

    let sortOptions = []
    if (appName) {
        sortOptions = await SortOption.findAll({
            where: {
                appName: appName
            }
        })
    } else {
        sortOptions = await SortOption.findAll()
    }

    if (sortOptions && sortOptions.length) {
        return res.send({
            message: 'sort options fetched successfully.',
            data: sortOptions
        })
    } else {
        return res.send({
            message: 'unable to fetch sort option. sort option not found.',
            data: []
        })
    }
}

exports.getActive = async function (req, res) {
    let appName = req.query.appName

    let sortOptions = []
    if (appName) {
        sortOptions = await SortOption.findAll({
            where: {
                appName: appName,
                isActive: true,
            }
        })
    } else {
        sortOptions = await SortOption.findAll({
            where: {
                isActive: true,
            }
        })
    }

    if (sortOptions && sortOptions.length) {
        return res.send({
            message: 'Sort Options fetched successfully.',
            data: sortOptions
        })
    } else {
        return res.send({
            message: 'Unable to fetch Sort Option. Sort Option not found.',
            data: []
        })
    }
}

exports.getOne = async function (req, res) {
    let id = req.params.id
    SortOption.findOne({
        where: {
            id: id,
            isActive: true,
        }
    }).then(data => {
        if (data) {
            return res.send({
                message: 'Sort Option fetched successfully.',
                data: data
            })
        } else {
            return res.status(400).send({
                message: 'Unable to fetch Sort Option. Sort Option not found.',
            })
        }
    }).catch(err => {
        // console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.post = async function (req, res) {
    let name = req.body.name
    let isActive = req.body.isActive
    let appName = req.query.appName

    let sortOption = null
    // if (appName) {
        sortOption = await SortOption.findOne({
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
    // } // else {
    //     sortOption = await Filter.findOne({
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

    if (sortOption) {
        if (sortOption.name == name) {
            return res.status(500).send({
                message: 'sort option already exist.',
            });
        } else if (sortOption.slug == name) {
            return res.status(500).send({
                message: 'slug already exist.',
            });
        }
    } else {
        let sortOption = new SortOption
        sortOption.name = name
        sortOption.slug = name
        if (isActive || isActive == false)
            sortOption.isActive = isActive
        sortOption.appName = appName

        sortOption.save().then(async data => {

            let createdData = await SortOption.findOne({
                where: {
                    id: data.id
                }
            })

            return res.send({
                message: 'Sort Option has been added successfully.',
                data: createdData
            })

        }).catch(err => {
            // console.log(err);
            return respondWithError(req, res, '', null, 500)
        })
    }

}

exports.update = async function (req, res) {

    let id = req.body.id
    let name = req.body.name
    let isActive = req.body.isActive

    let sortOption = null
    if (name) {
        sortOption = await SortOption.findOne({
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

    if (sortOption) {
        if (sortOption.name == name) {
            return res.status(500).send({
                message: 'sort option already exist.',
            });
        } else if (sortOption.slug == name) {
            return res.status(500).send({
                message: 'slug already exist.',
            });
        }
    }

    SortOption.findOne({
        where: {
            id: id
        }
    }).then(data => {
        if (!data) {
            return res.status(500).send({
                message: 'sort option not found.',
            })
        } else {
            if (name)
                data.name = name
            if (isActive || isActive == false)
                data.isActive = req.body.isActive

            data.save().then(async (sortOption) => {

                let updatedData = await SortOption.findOne({
                    where: {
                        id: sortOption.id
                    }
                })

                return res.send({
                    message: 'sort option has been updated successfully.',
                    data: updatedData
                })

            }).catch(err => {
                // console.log("err:", err);
                return respondWithError(req, res, '', null, 500)
            })
        }
    }).catch(err => {
        // console.log("err:", err);
        return respondWithError(req, res, '', null, 500)
    })

}

exports.delete = async function (req, res) {
    let id = req.params.id
    SortOption.destroy({
        where: {
            id: id
        },
    }).then(data => {
        if (data) {
            return res.send({
                message: 'Sort Option has been deleted successfully.',
            })
        } else {
            return res.status(400).send({
                message: 'Unable to delete Sort Option. Sort Option not found.',
            })
        }
    }).catch(err => {
        // console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}