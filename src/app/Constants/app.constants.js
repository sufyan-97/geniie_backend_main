module.exports = {
	FIELDS: {
		USER: ['id', 'username', 'email', 'profileImage', 'fullName', 'phoneNumber', 'dob', 'firstName', 'lastName', 'status', 'geniieCommission']
	},

	TIMESTAMP_FORMAT: "YYYY-MM-DD HH:mm:ss",
	TIMESTAMP_FORMAT_NOT_SEC: "YYYY-MM-DD HH:mm",

	DATE_FORMAT: "YYYY-MM-DD",

	TIME_FORMAT: "HH:mm:ss",
	TIME_FORMAT_HM: "HH:mm",

	FILE_PREFIX: "/file/",
	NO_AUTH_FILE_PREFIX: "/file/noAuth/",

	IMAGE_SUPPORTED_FORMATS: [
		"image/*",
		"image/gif",
		"image/x-icon",
		"image/jpg",
		"image/jpeg",
		"image/x-ms-bmp",
		"image/x-portable-graymap",
		"image/tif",
		"image/tiff",
		"image/png",
		"image/webp",
		"image/x-portable-anymap",
		"image/x-xbitmap",

		"font/otf",
		"font/ttf",
		"font/woff",
		"font/woff2",
	],

	PDF_SUPPORTED_FORMATS: [
		"pdf",
		"application/pdf",
		"application/vnd.ms-powerpoint",
		"application/vnd.ms-excel",
		"application/vnd.ms-excel",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	],

	APK_SUPPORTED_FORMATS: [
		"application/vnd.android.package-archive",
		"application/octet-stream",
	],

	SOCKET_EVENTS: {
		// SOCKET DEFAULT EVENTS
		DISCONNECT: 'disconnect',
		CONNECT_ERROR: 'connect_error',
		CONNECT_TIMEOUT: 'connect_timeout',
		ERROR: 'error',
		RECONNECT:'reconnect',
		RECONNECT_ATTEMPT:'reconnect_attempt',
		RECONNECTING:'reconnecting',
		RECONNECT_ERROR:'reconnect_error',
		RECONNECT_FAILED:'reconnect_failed',
		PING:'ping',
		PONG:'pong',

		ORDER_CANCELLED: "ORDER_CANCELLED",
		BOOKING_CANCELLED: "BOOKING_CANCELLED",
		BROADCAST_ADMIN_NOTIFICATION: 'broadcastAdminNotification',
		BROADCAST_PROVIDER_NOTIFICATION: 'broadcastProviderNotification',
		BROADCAST_RIDER_NOTIFICATION: 'broadcastRiderNotification',
		BROADCAST_RESTAURANT_NOTIFICATION: 'broadcastRestaurantNotification',
		MESSAGE_RECEIVED: 'CHAT_MESSAGE_RECEIVED',
		MESSAGE_DELETED: 'CHAT_MESSAGE_DELETED',
		USER_TYPEING: 'CHAT_USER_TYPING',
		USER_STOPPED_TYPING: 'CHAT_USER_STOPPED_TYPING',
		I_AM_TYPING: 'CHAT_I_AM_TYPING',
		I_STOPPED_TYPING: 'CHAT_I_STOPPED_TYPING',
		CONVERSATION_DELETED: 'CHAT_CONVERSATION_DELETED',
		MESSAGE_DELETED: 'CHAT_MESSAGE_DELETED',
		RESTRICT_RIDER_ON_REJECTION_RATE: "RESTRICT_RIDER_ON_REJECTION_RATE",

		UPDATE_LOCATION: 'UPDATE_LOCATION',
		RIDER_LOCATION: 'RIDER_LOCATION'
	},

	TRANSACTION_OF: {
		ORDER: 'order',
		TOP_UP: 'topUp',
		BOOKING: 'booking',
		CASH_PAID: 'cashPaid',
		REFUND: 'refund',
		PAYROLL: 'payroll',
	}
};
