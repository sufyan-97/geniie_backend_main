//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

// libraries
const { Op } = require('sequelize')

// Modals
var SettingMenuItem = require('../SqlModels/SettingMenuItem');
var SystemApp = require('../SqlModels/SystemApp');

// helpers
const general_helper = require('../../helpers/general_helper');

// Constants
const constants = require('../Constants/app.constants');

exports.getAll = async function (req, res) {
    let lngCode = req.headers['language']
	console.log('settingMenu.lngCode', lngCode)
    // console.log('lngCode=>', lngCode);

    let appName = req.query.app

    let isAppExist = await SystemApp.findOne({ where: { slug: appName, deleteStatus: false } });
    if (!isAppExist) {
        return res.status(400).send({ message: 'app does not exist in system' })
    }

    let additionalCheck = {}
    if (req.user.is_guest_user) {
        additionalCheck.login_required = 0
    }
    if (req.user.roles[0].roleName != 'admin') {
        additionalCheck.isActive = true
    }

    SettingMenuItem.findAll({
        lngCode: lngCode,
        where: {
            deleteStatus: false,
            appName: appName,
            ...additionalCheck
        },
        order: [['sortOrder', 'ASC']]
    }).then(data => {
        // console.log('data=>', data);
        if (data && data.length) {
            return res.send({
                message: 'Menu Item data fetched successfully.',
                menusItems: data
            })
        } else {
            return res.send({
                message: 'Unable to fetch menu item. Menu items not found.',
                menusItems: []
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.getOne = async function (req, res) {
    let id = req.params.id

    let appName = req.query.app

    let isAppExist = await SystemApp.findOne({ where: { slug: appName, deleteStatus: false } });
    if (!isAppExist) {
        return res.status(400).send({ message: 'app does not exist in system' })
    }

    let additionalCheck = {}
    if (req.user.is_guest_user) {
        additionalCheck.login_required = 0
    }

    if (req.user.roles[0].roleName != 'admin') {
        additionalCheck.isActive = true
    }

    SettingMenuItem.findAll({
        where: {
            id: id,
            deleteStatus: false,
            appName: appName,
            ...additionalCheck
        }
    }).then(data => {
        if (data && data.length) {
            return res.send({
                message: 'Menu Item data fetched successfully.',
                menusItem: data[0]
            })
        } else {
            return res.status(400).send({
                message: 'Unable to fetch menu item. Menu item not found.',
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.post = async function (req, res) {

    let appName = req.query.app

    let isAppExist = await SystemApp.findOne({ where: { slug: appName, deleteStatus: false } });
    if (!isAppExist) {
        return res.status(400).send({ message: 'app does not exist in system' })
    }

    let isSettingMenu = await SettingMenuItem.findOne({ where: { slug: req.body.name, deleteStatus: false, appName: appName } });
    if (isSettingMenu) {
        return res.status(400).send({ message: 'setting menu already exist' })
    }

    let settingMenuItem = new SettingMenuItem({
        name: req.body.name,
        slug: req.body.name,
        // image: req.body.image,
        // arrowImage: req.body.arrowImage,
        appName: appName,
    })

    if (req.body.isWebView == false || req.body.isWebView) {
        settingMenuItem.isWebView = req.body.isWebView
    }
    if (req.body.login_required == false || req.body.login_required) {
        settingMenuItem.login_required = req.body.login_required
    }
    if (req.body.isActive == false || req.body.isActive) {
        settingMenuItem.isActive = req.body.isActive
    }


    if (req.files) {
        if (req.files.image) {
            let imageData = await general_helper.uploadImage(req.files.image, 'settingMenu')
            if (imageData.status) {
                settingMenuItem.image = constants.FILE_PREFIX + imageData.imageName;
            } else {
                return res.status(imageData.statusCode).send({
                    message: imageData.message
                })
            }
        } else {
            return res.status(422).send({
                message: 'Invalid Data',
            })
        }

        if (req.files.arrowImage) {
            let imageData = await general_helper.uploadImage(req.files.arrowImage, 'settingMenu')
            if (imageData.status) {
                settingMenuItem.arrowImage = constants.FILE_PREFIX + imageData.imageName;
            } else {
                return res.status(imageData.statusCode).send({
                    message: imageData.message
                })
            }
        } else {
            return res.status(422).send({
                message: 'Invalid Data',
            })
        }
    } else {
        return res.status(422).send({
            message: 'Invalid Data',
        })
    }

    settingMenuItem.save().then(async (settingMenuItemData) => {
        let savedData = await SettingMenuItem.findOne({ where: { id: settingMenuItemData.id } })
        return res.send({
            message: 'Menu item has been added successfully.',
            menuItem: savedData
        })
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.update = async function (req, res) {
    console.log(req.body);

    let appName = req.query.app

    let isAppExist = await SystemApp.findOne({ where: { slug: appName, deleteStatus: false } });
    if (!isAppExist) {
        return res.status(400).send({ message: 'app does not exist in system' })
    }

    let isSettingMenu = await SettingMenuItem.findOne({ where: { slug: req.body.name, deleteStatus: false, appName: appName, [Op.not]: { id: req.body.id } } });
    if (isSettingMenu) {
        return res.status(400).send({ message: 'setting menu already exist' })
    }

    let updateData = {
        id: req.body.id,
        name: req.body.name,
        image: req.body.image,
        arrowImage: req.body.arrowImage,
        // slug: req.body.slug,
        appName: appName,
    }
    // if (req.body.image) {
    //     updateData.image = req.body.image
    //     updateData.arrowImage = req.body.arrowImage
    // }
    if (req.body.isWebView == false || req.body.isWebView) {
        updateData.isWebView = req.body.isWebView
    }
    if (req.body.login_required == false || req.body.login_required) {
        updateData.login_required = req.body.login_required
    }
    if (req.body.isActive == false || req.body.isActive) {
        updateData.isActive = req.body.isActive
    }

    if (req.files) {
        if (req.files.image) {
            let imageData = await general_helper.uploadImage(req.files.image, 'settingMenu')
            if (imageData.status) {
                updateData.image = constants.FILE_PREFIX + imageData.imageName;
            } else {
                return res.status(imageData.statusCode).send({
                    message: imageData.message
                })
            }
        }

        if (req.files.arrowImage) {
            let imageData = await general_helper.uploadImage(req.files.arrowImage, 'settingMenu')
            if (imageData.status) {
                updateData.arrowImage = constants.FILE_PREFIX + imageData.imageName;
            } else {
                return res.status(imageData.statusCode).send({
                    message: imageData.message
                })
            }
        }
    }


    SettingMenuItem.update(updateData, {
        where: {
            id: req.body.id,
            deleteStatus: false
        },
    }).then(async data => {
        if (data && data[0]) {
            let updatedData = await SettingMenuItem.findOne({ where: { id: req.body.id } })
            return res.send({
                message: 'Menu Item has been updated successfully.',
                data: updatedData
            })
        } else {
            return res.status(400).send({
                message: 'Unable to update menu item. Menu Item not found.',
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.delete = async function (req, res) {
    let id = req.params.id

    let appName = req.query.app

    let isAppExist = await SystemApp.findOne({ where: { slug: appName, deleteStatus: false } });
    if (!isAppExist) {
        return res.status(400).send({ message: 'app does not exist in system' })
    }

    SettingMenuItem.update({ deleteStatus: true }, {
        where: {
            deleteStatus: false,
            id: id,
            appName: appName,
        },
    }).then(data => {
        if (data && data[0]) {
            return res.send({
                message: 'Menu item has been deleted successfully.',
            })
        } else {
            return res.status(400).send({
                message: 'Unable to delete menu item. Menu item not found.',
            })
        }
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}
