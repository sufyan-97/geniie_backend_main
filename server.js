// Express Modules
// require("express-group-routes");
const express = require("express");

// const cluster = require('cluster');

// if (cluster.isMaster) {
// 	cluster.fork()
// } else {
// 	// childProcess();
// }

// console.log(cluster)
// cluster.on('online', function (worker) {
// 	console.log('Worker ' + worker.process.pid + ' is online.');
// });
// cluster.on('exit', function (worker, code, signal) {
// 	console.log('worker ' + worker.process.pid + ' died.');
// });

const app = express();

// Libraries
const expressSwagger = require('express-swagger-generator')(app);
const momentTz = require("moment-timezone");

const http = require("http");
const path = require('path');
const fs = require('fs');
const pug = require('pug');

const compression = require('compression')
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// Custom Libraries
const translation = require('./src/lib/translation')
const { sendEmailV2 } = require("./src/lib/email");

// Config
const swaggerOptions = require('./config/swaggerOptions');

// Middleware
const basicAuth = require('./src/app/Middleware/basicAuth')

// Constants
const constants = require('./config/constants');


// ===========================================================================//

// ========================= MySQL Configurations ========================= //
const { sequelize_conn } = require('./config/database')


// ========================= MongoDB Configurations ========================= //
const mongoConnection = require('./config/mongoDB')

const models = path.join(__dirname, './src/app/MongoModels');
if (fs.existsSync(models)) {
	fs.readdirSync(models)
		.filter(file => ~file.indexOf('.js'))
		.forEach(file => require(path.join(models, file)));
}


// ========================= App Configurations ========================= //
app.disable("etag");
app.disable('x-powered-by');

// Set timezone for moment Library
momentTz.tz.setDefault(constants.TIME_ZONE);


// ========================= View Engine Setup ========================= //
app.set('views', path.join(__dirname, './src/views'))
app.set('view engine', 'pug');


// ========================= Middleware ========================= //
// url logging
app.use(logger("dev"));

// compression
app.use(compression())

// file uploading max length
app.use(express.json({ limit: "1000gb" }));
app.use(express.urlencoded({
	limit: "1000gb",
	extended: false,
	parameterLimit: 100000000
}));

// cookie Parser
app.use(cookieParser());

// static files
app.use(express.static(path.join(__dirname, '/public')));

// Allow headers
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", req.header('origin'));
	res.header('Access-Control-Allow-Credentials', true);

	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, language, timezone, geolocation");
	res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
	res.header("Accept-Encoding", "gzip, sdch");

	if (req.method === "OPTIONS") {
		return res.status(200).json({});
	}

	next();
});


// ========================= Passport Configurations ========================= //
var jwtPassport = require('./src/app/Providers/jwtStrategy.provider');
app.use(jwtPassport.initialize());


// ========================= Route Configurations ========================= //
app.use('/api-docs', basicAuth, function (req, res, next) {
	next();
})

expressSwagger(swaggerOptions.options);

app.get("/", async (req, res) => {
	// let templateFile = pug.renderFile(path.join(__dirname, './src/views/email/business/promotion.pug'), {
	// 	host: constants.HOST,
	// 	userName: 'test',
	// 	email: 'asdfsdfdsfdsfdsfdsasdlsdfjlsjfalksdjfldsjflskkj@gmail.com',
	// 	password: "323423423"
	// });
	// sendEmailV2("Business Register Successfully", '', 'usmanhafeez147@outlook.com', 'business/welcome.pug', {
	// 	// username: 'Talha',
	// 	// restaurantName: 'Bombay Chapati',
	// 	// deliveryTime: '30 - 40 Minutes',
	// 	// orderNo: '#39057257',
	// 	// orderDate: "2022-11-29 14:19:38",
	// 	// deliveryAddress: 'Home',
	// 	// parseFloat: parseFloat,
	// 	// products: [
	// 	// 	{
	// 	// 		id: 4632,
	// 	// 		quantity: 5,
	// 	// 		instructions: 'Jaan sai sy bnana',
	// 	// 		foodMenuId: 70,
	// 	// 		productNotAvailableValueId: 2,
	// 	// 		productData: {
	// 	// 			id: 91,
	// 	// 			name: 'Tempura Fried Prawns',
	// 	// 			detail: '5 Pieces',
	// 	// 			image: '/file/restaurant-1652699216-354316.png',
	// 	// 			price: '1095.00',
	// 	// 			foodType: 'Pakistani',
	// 	// 			currency: 'GBP',
	// 	// 			currencySymbol: '£',
	// 	// 			deleteStatus: 0,
	// 	// 			isAvailable: true,
	// 	// 			ageRestrictedItem: false,
	// 	// 			variations: []
	// 	// 		}
	// 	// 	},
	// 	// ],
	// 	// subTotal: 5475,
	// 	// deliveryCharges: 10,
	// 	// total: 5485,
	// 	// vat: 0,
	// 	// currencySymbol: '£'
	// 	userName: 'test',
	// 	email: 'asdfsdfdsfdsfdsfdsasdlsdfjlsjfalksdjfldsjflskkj@gmail.com',
	// 	password: "323423423"
	// })
	// return res.send(templateFile)
	// res.cookie('test', 'abc')
	// return res.send(templateFile)
	// console.error('test')
	return res.send('Express')
});

require("./src/routes/index.js")(app);


app.use(function (req, res, next) {
	let responseData = res.locals

	const sendResponse = (contentType) => {
		return (contentType === 'text/html') ? res.status(404).render('error/pageNotFound.pug') : res.status(404).send({
			message: 'Page not found'
		})
	}

	if (!responseData || typeof responseData == 'undefined' || !Object.keys(responseData).length) {
		let contentType = req.headers['content-type']
		return sendResponse(contentType)
	}

	let lngCode = req.headers['language'] ? req.headers['language'] : 'en'
	let statusCode = 404

	if (typeof responseData === 'object' && !Array.isArray(responseData)) {
		statusCode = responseData.statusCode || 404
		responseData.message = (responseData.message) ? translation(responseData.message, responseData.message, lngCode) : 'Page not found'
	}

	return res.status(statusCode).send(responseData)
});

// error handler
app.use(function (err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	console.log(err)
	res.status(err.status || 500);
	return res.send(err);
});



// ========================= gRPC Configurations ========================= //
require('./src/routes/rpc')


// ========================= Server Configurations ========================= //
var APP_PORT = normalizePort(constants.APP_PORT);

app.set("port", APP_PORT);

const httpServer = http.createServer(app);


// ========================= Socket Configurations ========================= //
require('./src/routes/sockets').connect(httpServer, app);


// ========================= Cron Jobs ========================= //
require("./src/crons/index");
// require("../crons/cron.js");


// ========================= Database Configurations ========================= //
function checkDatabases(isMySQL, isMongo) {
	return new Promise(async function (resolve, reject) {
		try {
			if (isMySQL) {
				await sequelize_conn.authenticate()
			}
			if (isMongo) {
				await mongoConnection()
			}
			return resolve()
		} catch (error) {
			reject(error)
			return
		}
	})
}

checkDatabases((constants.DB_HOST && constants.DB_PORT && constants.DB_NAME) ? true : false, (constants.MONGO_HOST && constants.MONGO_PORT && constants.MONGO_NAME) ? true : false).then(function (dbConnected) {
	startServer()
}).catch(error => {
	console.log(error)
	process.exit(1)
})

// ========================= Predefined Functions ========================= //

function startServer() {
	httpServer.listen(APP_PORT);

	httpServer.on("error", function (error) {
		if (error.syscall !== "listen") {
			throw error;
		}

		var bind = typeof APP_PORT === "string" ? `Pipe ${APP_PORT}` : `Port ${APP_PORT}`;

		// handle specific listen errors with friendly messages
		switch (error.code) {
			case "EACCES":
				console.error(`${bind} requires elevated privileges`);
				process.exit(1);
			case "EADDRINUSE":
				console.error(`${bind} is already in use`);
				process.exit(1);
			default:
				throw error;
		}
	});

	httpServer.on("listening", function () {
		var addr = httpServer.address();
		var bind = typeof addr === "string" ? `pipe: ${addr}` : `port: ${addr.port}`;
		console.log(`Listening on ${bind}`);

	});
}

function normalizePort(val) {
	var port = parseInt(val, 10);
	if (isNaN(port)) return val;
	if (port >= 0) return port;
	return false;
}