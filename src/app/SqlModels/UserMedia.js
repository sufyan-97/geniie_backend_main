// Libraries
const Sequelize = require('sequelize');

// Custom Libraries
const { sequelize_conn } = require('../../../config/database');

const User = require('./User');

// Models
// const Role = require('./Role');

const UserMedia = sequelize_conn.define('user_medias', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},

	userId: {
		type: Sequelize.INTEGER,
		allowNull: false
	},

	mediaType: {
		type: Sequelize.ENUM,
		values: [
			'license', 'motorLicense', 'nationalId', 'photoId', 'criminalCheck', 'bagPhoto', 'bankStatement', 'profileImage', 'coverImage'
		],
		allowNull: true,
		defaultValue: null
	},

	fileName: {
		type: Sequelize.STRING,
		allowNull: false,
	},

	expiryDate: {
		type: Sequelize.DATE,
		defaultValue: null
	},
	vehicleId: {
		type: Sequelize.INTEGER,
		allowNull: true
	},
	deleteStatus: {
		type: Sequelize.BOOLEAN,
		defaultValue: 0
	},
	status: {
		type: Sequelize.ENUM,
		values: ["pending", "active", 'rejected'],
		defaultValue: "pending",
	},
	rejectionReason: {
		type: Sequelize.STRING,
		allowNull: true,
	},

}, {
	timestamps: true,
})

UserMedia.belongsTo(User)
User.hasMany(UserMedia, {
    foreignKey: 'userId',
    sourceKey: 'id'
});

module.exports = UserMedia;
