try {
	// =============== DotEnv =====================//

	let yamlConfigLib = require('node-yaml-config');

	const env = yamlConfigLib.load(__dirname + `/../config.yaml`);


	// ================ Env List =================== //

	// App Info & Configs
	const HOST_NAME = env?.app?.hostName ? env?.app?.hostName : 'localhost';
	const HOST = env?.app?.hostURL ? env?.app?.hostURL : 'http://localhost:3000';
	const WEB_URL = env?.app?.webURL ? env?.app?.webURL : 'https://geniie.uk';

	const panelURL = env?.app?.panelURL ? env?.app?.panelURL : 'https://panel.geniie.uk'
	const PROVIDER_URL = env?.app?.providerURL ? env?.app?.providerURL : 'https://geniie.uk';
	const RIDER_URL = env?.app?.riderURL ? env?.app?.riderURL : 'https://geniie.uk';

	const APP_ENV = env?.app?.env ? env?.app?.env : 'local'
	const APP_TITLE = env?.app?.title ? env?.app?.title : 'Geniie';
	const APP_PORT = env?.app?.port ? env?.app?.port : 3000;
	const API_VERSION = env?.app?.version ? env?.app?.version : 4.1;

	const TIME_ZONE = env?.app?.timezone ? env?.app?.timezone : 'Europe/London'; // "Asia/Karachi";
	const TIME_ZONE_OFFSET = env?.app?.timezoneOffset ? env?.app?.timezoneOffset : '+0:00';

	const IP_INFO_CHECKER = env?.app?.ipInfoChecker ? env?.app?.ipInfoChecker : 'http://ipinfo.io/';
	const DEFAULT_COUNTRY = env?.app?.defaultCountry ? env?.app?.defaultCountry : 'PK';

	// #GRPC
	const RPC_HOST = env?.app?.rpcHost ? env?.app?.rpcHost : 'localhost';
	const RPC_PORT = env?.app?.rpcPort ? env?.app?.rpcPort : 3001

	// App Config & Secrets
	const APP_SECRET = env?.secret?.key ? env?.secret?.key : '';
	const EXPIRE_IN = env?.secret?.expiresIn ? env?.secret?.expiresIn : '';


	// Basic Auth Credentials
	const BASIC_AUTH_USER = env?.basicAuth?.username ? env?.basicAuth?.username : ''
	const BASIC_AUTH_PASSWORD = env?.basicAuth?.password ? env?.basicAuth?.password : ''

	// Support Credentials
	const SUPPORT_BASE_URL = env?.support?.baseURL ? env?.support?.baseURL : 'http://localhost:8000'
	const SUPPORT_HASH = env?.support?.hash ? env?.support?.hash : 'cm9vdDpwd2Q='

	// Support Emails
	const SUPPORT_EMAILS = env?.emails?.support ? env?.emails?.support : [];


	// Social Media URLS
	const FACEBOOK = env?.social?.facebook ? env?.social?.facebook : 'https://facebook.com'
	const TWITTER = env?.social?.twitter ? env?.social?.twitter : 'https://twitter.com'
	const LINKED_IN = env?.social?.linkedIn ? env?.social?.linkedIn : 'https://linkedin.com'
	const INSTAGRAM = env?.social?.instagram ? env?.social?.instagram : 'https://instagram.com'

	// MySQL Database
	const DB_HOST = env?.mysql?.host ? env?.mysql?.host : '';
	const DB_NAME = env?.mysql?.name ? env?.mysql?.name : '';
	const DB_USERNAME = env?.mysql?.username ? env?.mysql?.username : '';
	const DB_PASSWORD = env?.mysql?.password ? env?.mysql?.password : '';
	const DB_PORT = env?.mysql?.port ? env?.mysql?.port : '';
	const DB_SSL = env?.mysql?.ssl ? env?.mysql?.ssl : '';

	// MongoDB
	const MONGO_HOST = env?.mongo?.host ? env?.mongo?.host : '';
	const MONGO_NAME = env?.mongo?.name ? env?.mongo?.name : '';
	const MONGO_USERNAME = env?.mongo?.username ? env?.mongo?.username : '';
	const MONGO_PASSWORD = env?.mongo?.password ? env?.mongo?.password : '';
	const MONGO_PORT = env?.mongo?.port ? env?.mongo?.port : '';
	const MONGO_AUTH_SOURCE = env?.mongo?.authSource ? env?.mongo?.authSource : '';

	// Redis Database
	const REDIS_HOST = env?.redis?.host ? env?.redis?.host : 'localhost'
	const REDIS_PORT = env?.redis?.port ? env?.redis?.port : 6379
	const REDIS_PREFIX = env?.redis?.prefix ? env?.redis?.prefix : ''
	const REDIS_KEY = env?.redis?.key ? env?.redis?.key : ''
	const REDIS_USERNAME = env?.redis?.username ? env?.redis?.username : ''
	const REDIS_PASSWORD = env?.redis?.password ? env?.redis?.password : ''

	const SMTP_HOST = env?.smtp1?.host ? env?.smtp1?.host : '';
	const SMTP_PORT = env?.smtp1?.port ? env?.smtp1?.port : '';
	const SMTP_USERNAME = env?.smtp1?.username ? env?.smtp1?.username : '';
	const SMTP_PASSWORD = env?.smtp1?.password ? env?.smtp1?.password : '';

	// SMTP Credentials2
	const SMTP_HOST2 = env?.smtp2?.host ? env?.smtp2?.host : '';
	const SMTP_PORT2 = env?.smtp2?.port ? env?.smtp2?.port : '';
	const SMTP_USERNAME2 = env?.smtp2?.username ? env?.smtp2?.username : '';
	const SMTP_PASSWORD2 = env?.smtp2?.password ? env?.smtp2?.password : '';

	// SMTP Info
	const SMTP_FROM_EMAIL = env?.smtp1?.fromEmail ? env?.smtp1?.fromEmail : '';
	const SMTP_FROM_EMAIL2 = env?.smtp2?.fromEmail ? env?.smtp2?.fromEmail : '';
	const SMTP_FROM_NAME = env?.smtp1?.fromName ? env?.smtp1?.fromName : '';


	// Auth Credentials
	const TWITTER_CALLBACK_URL = HOST + '/auth/twitter/callback'
	const TWITTER_CONSUMER_KEY = env?.oAuth?.twitter?.clientId ? env?.oAuth?.twitter?.clientId : ''
	const TWITTER_CONSUMER_SECRET = env?.oAuth?.twitter?.clientSecret ? env?.oAuth?.twitter?.clientSecret : ''

	const FACEBOOK_CALLBACK_URL = HOST + '/auth/facebook/callback'
	const FACEBOOK_CLIENT_ID = env?.oAuth?.facebook?.clientId ? env?.oAuth?.facebook?.clientId : ''
	const FACEBOOK_CLIENT_SECRET = env?.oAuth?.facebook?.clientSecret ? env?.oAuth?.facebook?.clientSecret : ''

	const GOOGLE_CALLBACK_URL = HOST + '/auth/google/callback'
	const GOOGLE_CLIENT_ID = env?.oAuth?.google?.clientId ? env?.oAuth?.google?.clientId : ''
	const GOOGLE_CLIENT_SECRET = env?.oAuth?.google?.clientSecret ? env?.oAuth?.google?.clientSecret : ''

	const GITHUB_CALLBACK_URL = HOST + '/auth/github/callback'
	const GITHUB_CLIENT_ID = env?.oAuth?.github?.clientId ? env?.oAuth?.github?.clientId : ''
	const GITHUB_CLIENT_SECRET = env?.oAuth?.github?.clientSecret ? env?.oAuth?.github?.clientSecret : ''

	// Twilio
	const TWILIO_SID = env?.twilio?.sid ? env?.twilio?.sid : ''
	const TWILIO_AUTH_TOKEN = env?.twilio?.authToken ? env?.twilio?.authToken : ''
	const TWILIO_OTP_ATTEMPTS = env?.twilio?.optAttempts ? env?.twilio?.optAttempts : '';
	const TWILIO_MESSAGE_SERVICE_ID = env?.twilio?.messageServiceId ? env?.twilio?.messageServiceId : ''
	const OTP_AUTOFILL_CODE = env?.twilio?.autofillCode ? env?.twilio?.autofillCode : '';

	// stripe
	const STRIPE_PUBLISH_KEY = env?.stripe?.publishKey ? env?.stripe?.publishKey : ''
	const STRIPE_SECRET_KEY = env?.stripe?.secretKey ? env?.stripe?.secretKey : ''

	// stripe
	const PAYPAL_MODE = env?.paypal?.mode ? env?.paypal?.mode : null
	const PAYPAL_CLIENT_ID = env?.paypal?.clientId ? env?.paypal?.clientId : null
	const PAYPAL_CLIENT_SECRET = env?.paypal?.clientSecret ? env?.paypal?.clientSecret : null


	//Coin Payment

	var COIN_PAYMENTS_KEY = env?.coinPayment?.key ? env?.coinPayment?.key : '';
	var COIN_PAYMENTS_SECRET = env?.coinPayment?.secret ? env?.coinPayment?.secret : '';

	// Plugins
	const MICRO_SERVICES = env.plugins

	const RPC_CLIENTS = env.rpcClients

	module.exports = {
		// APP INFO Constants

		HOST_NAME,
		HOST,

		APP_ENV,
		APP_TITLE,
		APP_PORT,
		API_VERSION,

		panelURL,
		WEB_URL,
		PROVIDER_URL,
		RIDER_URL,

		RPC_HOST,
		RPC_PORT,


		IP_INFO_CHECKER,
		DEFAULT_COUNTRY,

		TIME_ZONE,
		TIME_ZONE_OFFSET,

		// App Config & Secrets
		APP_SECRET,
		EXPIRE_IN,

		// Basic Auth Constants
		BASIC_AUTH_USER,
		BASIC_AUTH_PASSWORD,

		// Support Credentials
		SUPPORT_BASE_URL,
		SUPPORT_HASH,

		SUPPORT_EMAILS,

		// Social Media URLS
		FACEBOOK,
		TWITTER,
		LINKED_IN,
		INSTAGRAM,

		// MySQL Database
		DB_HOST,
		DB_NAME,
		DB_USERNAME,
		DB_PASSWORD,
		DB_PORT,
		DB_SSL,

		// MongoDB
		MONGO_HOST,
		MONGO_USERNAME,
		MONGO_PASSWORD,
		MONGO_AUTH_SOURCE,
		MONGO_NAME,
		MONGO_PORT,

		// Redis Database
		REDIS_HOST,
		REDIS_PORT,
		REDIS_PREFIX,
		REDIS_KEY,
		REDIS_USERNAME,
		REDIS_PASSWORD,

		// SMTP Constants
		// SMTP Credentials
		SMTP_HOST,
		SMTP_PORT,
		SMTP_USERNAME,
		SMTP_PASSWORD,

		// SMTP Credentials 2
		SMTP_HOST2,
		SMTP_PORT2,
		SMTP_USERNAME2,
		SMTP_PASSWORD2,

		// SMTP Info
		SMTP_FROM_EMAIL,
		SMTP_FROM_EMAIL2,
		SMTP_FROM_NAME,
		SMTP_COMMON_SUBJECT: `${APP_TITLE} -`,

		TWITTER_CALLBACK_URL,
		TWITTER_CONSUMER_KEY,
		TWITTER_CONSUMER_SECRET,

		FACEBOOK_CALLBACK_URL,
		FACEBOOK_CLIENT_ID,
		FACEBOOK_CLIENT_SECRET,

		GOOGLE_CALLBACK_URL,
		GOOGLE_CLIENT_ID,
		GOOGLE_CLIENT_SECRET,

		GITHUB_CALLBACK_URL,
		GITHUB_CLIENT_ID,
		GITHUB_CLIENT_SECRET,


		// Twilio
		TWILIO_SID,
		TWILIO_AUTH_TOKEN,
		TWILIO_OTP_ATTEMPTS,
		TWILIO_MESSAGE_SERVICE_ID,
		OTP_AUTOFILL_CODE,

		//Stripe
		STRIPE_PUBLISH_KEY,
		STRIPE_SECRET_KEY,

		// Paypal
		PAYPAL_MODE,
		PAYPAL_CLIENT_ID,
		PAYPAL_CLIENT_SECRET,

		//COIN PAYMENT
		COIN_PAYMENTS_KEY,
		COIN_PAYMENTS_SECRET,

		// Plugins
		MICRO_SERVICES,
		RPC_CLIENTS
	}
} catch (error) {
	console.log(error);
	process.exit(1)
}
