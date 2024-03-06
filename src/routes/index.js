var multipart = require('connect-multiparty');
var path = require('path');

// routes
var internalUserRoutes = require('./internal/user');

var authRoutes = require('./auth');

var chatRoutes = require('./chat');

var profileRoutes = require('./profile')


var businessRoutes = require("./business");

var addressRoutes = require('./address')

var sortOptionRoutes = require('./sortOption')

var addressLabelRoutes = require('./addressLabel')

var fileRoutes = require('./file')

var genderRoutes = require('./gender')

var moduleTypeRoutes = require('./moduleType')

var termAndCondition = require('./termAndCondition.routes')

var languageRoutes = require('./language')

var appControlRoutes = require('./appControl')

var userLanguageRoutes = require('./userLanguage')

var problemRoutes = require('./problem')

var contactUsRoutes = require('./contactUs')

var roleRoutes = require('./role')

var superAdminRolePermissionRoutes = require('./superAdminPermission.routes')

var recentSearchRoute = require('./recentSearch')

//* SPRINT 3 */
const paymentMethodRoutes = require('./paymentMethod')

const servicesRoutes = require('./service')

const serviceCategoryRoutes = require('./serviceCategory');
const serviceSubCategoryRoutes = require('./serviceSubCategory');

const aclRoutes = require('./acl')
const userRoutes = require('./user.routes');

const billingRoutes = require('./billing')
const rejectionRoute = require('./rejectionReason')

//* SPRINT 4 */
const regionRoutes = require('./region')
const promoCodeRoutes = require('./promoCode')
const promotionRoutes = require('./promotion.routes')
const emailTemplateRoutes = require('./emailTemplate.routes')
const onboardingRoutes = require('./onboarding');
const supportDepartmentRoutes = require('./supportDepartment');

const bannerRoutes = require('./banner');

const mainMenuRoutes = require('./mainMenu');

const notificationSettingRoutes = require('./notificationSetting.routes');
const userNotificationSettingRoutes = require('./userNotificationSetting.routes');

const settingMenuRoutes = require('./settingMenu');

const systemConstantRoutes = require('./systemConstant');

const notificationRoutes = require('./notification');
const userNotificationRoutes = require('./userNotification');
const filterRoutes = require('./filter.routes.js')
const deviceRoutes = require('./device')
const systemAppRoutes = require('./systemApp')
const searchByPostcodeRoutes = require('./searchByPostcode')
const waitingListRoutes = require('./waitingList');


// IPN Routes
const ipnRoutes = require('./ipn.routes')

const webRoutes = require('./web.routes')

const nextOpeningTimeRoutes = require('./nextOpeningTime.routes')


// Provider
var jwtPassport = require('../app/Providers/jwtStrategy.provider')

// Middleware
const microServiceMiddleware = require('../app/Middleware/microService');
const aclMiddleware = require('../app/Middleware/aclMiddleware');
const addHeadersMiddleware = require('../app/Middleware/addHeadersMiddleware');
const basicAuth = require('../app/Middleware/basicAuth');

// Webhooks
const { MICRO_SERVICES } = require('../../config/constants')

// Constants
const jwtOptions = {
	session: false,
	failWithError: true
}

module.exports = function (app) {


	app.use('/ipn', ipnRoutes)

	app.use('/web', webRoutes)

	// app.use('/rider', riderRoutes);

	// app.use('/internal/user', basicAuth, internalUserRoutes);


	app.use('/auth', addHeadersMiddleware, aclMiddleware, authRoutes);

	app.use('/business', businessRoutes);

	app.use('/recentSearch', jwtPassport.authenticate('jwt', jwtOptions), aclMiddleware, recentSearchRoute);
	app.use('/emailTemplate', jwtPassport.authenticate('jwt', jwtOptions), addHeadersMiddleware, aclMiddleware, emailTemplateRoutes)
	app.use('/rejectionReason', jwtPassport.authenticate('jwt', jwtOptions), addHeadersMiddleware, aclMiddleware, rejectionRoute)
	app.use('/banner', jwtPassport.authenticate('jwt', jwtOptions), addHeadersMiddleware, aclMiddleware, multipart(), bannerRoutes);
	app.use('/mainMenu', jwtPassport.authenticate('jwt', jwtOptions), addHeadersMiddleware, aclMiddleware, multipart(), mainMenuRoutes);
	app.use('/notificationSettings', jwtPassport.authenticate('jwt', jwtOptions), addHeadersMiddleware, aclMiddleware, notificationSettingRoutes);
	app.use('/userNotificationSettings', jwtPassport.authenticate('jwt', jwtOptions), addHeadersMiddleware, aclMiddleware, userNotificationSettingRoutes);
	app.use('/settingMenu', jwtPassport.authenticate('jwt', jwtOptions), addHeadersMiddleware, aclMiddleware, multipart(), settingMenuRoutes);
	app.use('/systemConstant', addHeadersMiddleware, aclMiddleware, systemConstantRoutes);
	app.use('/acl', jwtPassport.authenticate('jwt', jwtOptions), addHeadersMiddleware, aclMiddleware, multipart(), aclRoutes);
	app.use('/language', addHeadersMiddleware, aclMiddleware, languageRoutes)
	app.use('/appControl', addHeadersMiddleware, aclMiddleware, multipart(), appControlRoutes);
	app.use('/profile', jwtPassport.authenticate('jwt', jwtOptions), aclMiddleware, profileRoutes);
	app.use('/address/label', jwtPassport.authenticate('jwt', jwtOptions), aclMiddleware, addressLabelRoutes);
	app.use('/address', jwtPassport.authenticate('jwt', jwtOptions), aclMiddleware, addressRoutes);
	app.use('/sortOption', aclMiddleware, sortOptionRoutes);
	app.use('/file', aclMiddleware, multipart(), fileRoutes);
	// app.use('//file', aclMiddleware, multipart(), fileRoutes);
	// app.use('/noAuth/file',  aclMiddleware, multipart(), fileRoutes);
	app.use('/gender', jwtPassport.authenticate('jwt', jwtOptions), aclMiddleware, genderRoutes)
	app.use('/moduleType', jwtPassport.authenticate('jwt', jwtOptions), aclMiddleware, moduleTypeRoutes)
	app.use('/termAndCondition', jwtPassport.authenticate('jwt', jwtOptions), aclMiddleware, termAndCondition)
	app.use('/userLanguage', jwtPassport.authenticate('jwt', jwtOptions), aclMiddleware, userLanguageRoutes)
	app.use('/problem', jwtPassport.authenticate('jwt', jwtOptions), aclMiddleware, multipart(), problemRoutes)
	app.use('/contactUs', jwtPassport.authenticate('jwt', jwtOptions), aclMiddleware, multipart(), contactUsRoutes)

	app.use('/billing', jwtPassport.authenticate('jwt', jwtOptions), aclMiddleware, billingRoutes)

	//** SPRINT 3 **

	app.use('/paymentMethod', jwtPassport.authenticate('jwt', jwtOptions), aclMiddleware, multipart(), paymentMethodRoutes)
	app.use('/service', jwtPassport.authenticate('jwt', jwtOptions), aclMiddleware, multipart(), servicesRoutes)
	app.use('/serviceCategory', jwtPassport.authenticate('jwt', jwtOptions), multipart(), serviceCategoryRoutes);
	app.use('/serviceSubCategory', jwtPassport.authenticate('jwt', jwtOptions), multipart(), serviceSubCategoryRoutes);
	app.use('/user', jwtPassport.authenticate('jwt', jwtOptions), addHeadersMiddleware, aclMiddleware, multipart(), userRoutes);

	app.use('/region', addHeadersMiddleware, jwtPassport.authenticate('jwt', jwtOptions), aclMiddleware, regionRoutes)
	app.use('/promoCode', addHeadersMiddleware, jwtPassport.authenticate('jwt', jwtOptions), aclMiddleware, multipart(), promoCodeRoutes)
	app.use('/promotion', addHeadersMiddleware, jwtPassport.authenticate('jwt', jwtOptions), aclMiddleware, promotionRoutes)
	app.use('/role', jwtPassport.authenticate('jwt', jwtOptions), aclMiddleware, roleRoutes)
	app.use('/rolePermission', jwtPassport.authenticate('jwt', jwtOptions), aclMiddleware, superAdminRolePermissionRoutes)
	app.use('/onboarding', aclMiddleware, multipart(), onboardingRoutes);
	app.use('/supportDepartment', aclMiddleware, multipart(), supportDepartmentRoutes);


	app.use('/userNotification', jwtPassport.authenticate('jwt', jwtOptions), aclMiddleware, multipart(), userNotificationRoutes);

	app.use('/notification', jwtPassport.authenticate('jwt', jwtOptions), aclMiddleware, multipart(), notificationRoutes);

	app.use('/filter', aclMiddleware, filterRoutes);

	app.use('/device', aclMiddleware, deviceRoutes);

	app.use('/systemApp', jwtPassport.authenticate('jwt', jwtOptions), aclMiddleware, multipart(), systemAppRoutes);


	app.use('/nextOpeningTime', jwtPassport.authenticate('jwt', jwtOptions), aclMiddleware, nextOpeningTimeRoutes)


	app.use('/chat', jwtPassport.authenticate('jwt', jwtOptions), aclMiddleware, multipart(), chatRoutes)

	app.use('/searchByPostcode', aclMiddleware, multipart(), searchByPostcodeRoutes)


	app.get('/webview/file/:name', aclMiddleware, function (req, res) {
		let fileName = req.params.name === 'main' ? 'webview.png' : "logo.png"
		let pathRoute = path.join(__dirname, `../views/${fileName}`)
		console.log(pathRoute);
		return res.sendFile(pathRoute)
	});

	app.get('/webview', aclMiddleware, function (req, res) {
		let pathRoute = path.join(__dirname, '../views/webview.html')
		return res.sendFile(pathRoute)
	})

	// * waiting List route
	app.use('/waitingList', waitingListRoutes);

	//** MICRO SERVICES ROUTES **
	// console.log(MICRO_SERVICES)
	MICRO_SERVICES.map(item => {
		app.use(`/${item.endPoint}`, addHeadersMiddleware, jwtPassport.authenticate('jwt', jwtOptions), aclMiddleware, multipart(), microServiceMiddleware);
		// app.use(`/${item.endPoint}/verified`, microServiceMiddleware);
		// app.use(`/${item.endPoint}`, multipart(), microServiceMiddleware);
	})
}
