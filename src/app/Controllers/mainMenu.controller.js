//Helper
const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

// libraries
const { Op } = require('sequelize')

// Modals
var MainMenuItem = require('../SqlModels/MainMenuItem');
var SystemApp = require('../SqlModels/SystemApp');

// helpers
const general_helper = require('../../helpers/general_helper');

// Constants
const constants = require('../Constants/app.constants');

exports.getAll = async function (req, res) {
    let lngCode = req.headers['language']
	console.log('mainMenu.lngCode', lngCode)

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

    MainMenuItem.findAll({
        lngCode: lngCode,
        where: {
            deleteStatus: false,
            appName: appName,
            ...additionalCheck
        },
        attributes: ['id', 'name', 'image', 'slug', 'isWebView', 'login_required', 'isActive'],
        order: [['sortOrder', 'ASC']]
    }).then(data => {
        if (data && data.length) {
            return res.send({
                message: 'Menu Items data fetched successfully.',
                menusItems: data
            })
        } else {
            return res.send({
                message: 'Unable to fetch menu items. Menu items not found.',
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
    MainMenuItem.findAll({
        where: {
            id: id,
            deleteStatus: false,
            appName: appName,
            ...additionalCheck
        },
        attributes: ['id', 'name', 'image', 'slug', 'isWebView', 'login_required', 'isActive'],
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

    let isMainMenu = await MainMenuItem.findOne({ where: { slug: req.body.name, deleteStatus: false, appName: appName } });
    if (isMainMenu) {
        return res.status(400).send({ message: 'main menu already exist' })
    }
    // console.log('req.body.slug=>', req.body.slug);

    let mainMenuItem = new MainMenuItem({
        name: req.body.name,
        slug: req.body.name,
        // image: req.body.image,
        appName: appName,
    })

    if (req.body.isWebView == false || req.body.isWebView) {
        mainMenuItem.isWebView = req.body.isWebView
    }
    if (req.body.login_required == false || req.body.login_required) {
        mainMenuItem.login_required = req.body.login_required
    }
    if (req.body.isActive == false || req.body.isActive) {
        mainMenuItem.isActive = req.body.isActive
    }
    // if (req.files && req.files.image) {
    //     let imageData = await general_helper.uploadImage(req.files.image, 'mainMenu')
    //     if (imageData.status) {
    //         mainMenuItem.image = app_constants.FILE_PREFIX + imageData.imageName;
    //     } else {
    //         return res.status(imageData.statusCode).send({
    //             message: imageData.message
    //         })
    //     }
    // }
    // console.log('mainMenuItem=>', mainMenuItem);
    if (req.files && req.files.image) {
        let imageData = await general_helper.uploadImage(req.files.image, 'mainMenu')
        if (imageData.status) {
            mainMenuItem.image = constants.FILE_PREFIX + imageData.imageName;
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

    mainMenuItem.save().then(async (mainMenuItemData) => {
        let menuItem = await MainMenuItem.findOne({ where: { id: mainMenuItemData.id } });
        return res.send({
            message: 'Menu item has been added successfully.',
            menuItem: menuItem
        })
    }).catch(err => {
        console.log(err);
        return respondWithError(req, res, '', null, 500)
    })
}

exports.update = async function (req, res) {
    let appName = req.query.app

    let isAppExist = await SystemApp.findOne({ where: { slug: appName, deleteStatus: false } });
    if (!isAppExist) {
        return res.status(400).send({ message: 'app does not exist in system' })
    }

    let isMainMenu = await MainMenuItem.findOne({ where: { slug: req.body.name, deleteStatus: false, appName: appName, [Op.not]: { id: req.body.id } } });
    if (isMainMenu) {
        return res.status(400).send({ message: 'main menu already exist' })
    }

    let updateData = {
        id: req.body.id,
        name: req.body.name,
        // slug: req.body.slug,
        // image: req.body.image ? req.body.image : null,
        appName: appName
    }
    if (req.body.isWebView == false || req.body.isWebView) {
        updateData.isWebView = req.body.isWebView
    }
    if (req.body.login_required == false || req.body.login_required) {
        updateData.login_required = req.body.login_required
    }
    if (req.body.isActive == false || req.body.isActive) {
        updateData.isActive = req.body.isActive
    }

    if (req.files && req.files.image) {
        let imageData = await general_helper.uploadImage(req.files.image, 'mainMenu')
        if (imageData.status) {
            updateData.image = constants.FILE_PREFIX + imageData.imageName;
        } else {
            return res.status(imageData.statusCode).send({
                message: imageData.message
            })
        }
    }

    MainMenuItem.update(updateData, {
        where: {
            id: req.body.id,
            deleteStatus: false,
            appName: appName
        },
    }).then(async data => {
        if (data && data[0]) {
            let updatedData = await MainMenuItem.findOne({ where: { id: req.body.id } })
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

    MainMenuItem.update({ deleteStatus: true }, {
        where: {
            deleteStatus: false,
            id: id,
            appName: appName
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
