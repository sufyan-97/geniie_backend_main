// Libraries
const Sequelize = require('sequelize');

// Custom Libraries
const { sequelize_conn } = require('../../../config/database');

// Models
const Role = require('./Role');
const Gender = require('./Gender');
const UserAccountBalance = require('./UserAccountBalance');
const FinancialAccountTransaction = require('./FinancialAccountTransaction')
const Language = require('./Language')
const UserGeneralInformation = require('./UserGeneralInformation')
const VehicleInformation = require('./VehicleInformation');
const BankAccount = require('./BankAccount');

const User = sequelize_conn.define('users',
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		socketId: {
			type: Sequelize.STRING,
			defaultValue: null
		},
		username: {
			type: Sequelize.STRING
		},
		email: {
			type: Sequelize.STRING
		},
		newEmail: {
			type: Sequelize.STRING,
			defaultValue: null
		},
		password: {
			type: Sequelize.STRING
		},

		emailVerificationCode: {
			type: Sequelize.TEXT
		},

		forgotPasswordCode: {
			type: Sequelize.TEXT
		},

		deleteStatus: {
			type: Sequelize.BOOLEAN,
			defaultValue: 0
		},
		refreshToken: {
			type: Sequelize.TEXT,
			defaultValue: null
		},
		profileImage: {
			type: Sequelize.STRING,
			defaultValue: null
		},
		profileImageByte: {
			type: Sequelize.INTEGER,
			defaultValue: null
		},
		profileImageSize: {
			type: Sequelize.STRING,
			defaultValue: null
		},
		fullName: {
			type: Sequelize.STRING,
			defaultValue: null
		},
		firstName: {
			type: Sequelize.STRING,
		},
		lastName: {
			type: Sequelize.STRING
		},
		isOnline: {
			type: Sequelize.BOOLEAN, defaultValue: false
		},
		parentId: {
			type: Sequelize.INTEGER
		},
		dob: {
			type: Sequelize.STRING,
			defaultValue: null
		},
		genderId: {
			type: Sequelize.INTEGER,
			defaultValue: null
		},

		countryCode: {
			type: Sequelize.STRING,
			defaultValue: null
		},

		number: {
			type: Sequelize.STRING,
			defaultValue: null
		},

		phoneNumber: {
			type: Sequelize.STRING,
			defaultValue: null
		},

		verifyPhoneNumber: {
			type: Sequelize.BOOLEAN,
			defaultValue: null
		},

		facebookId: {
			type: Sequelize.STRING,
			defaultValue: null
		},
		googleId: {
			type: Sequelize.STRING,
			defaultValue: null
		},
		twitterId: {
			type: Sequelize.STRING,
			defaultValue: null
		},
		githubId: {
			type: Sequelize.STRING,
			defaultValue: null
		},
		appleId: {
			type: Sequelize.STRING,
			defaultValue: null
		},
		deviceId: {
			type: Sequelize.STRING,
			defaultValue: null
		},

		stripeId: {
			type: Sequelize.STRING,
			defaultValue: null
		},

		verifyNewPhoneNumber: {
			type: Sequelize.BOOLEAN,
			defaultValue: false
		},

		selectedCardId: {
			type: Sequelize.STRING,
			defaultValue: null
		},

		paymentMethodId: {
			type: Sequelize.INTEGER,
			defaultValue: null
		},
		roleName: {
			type: Sequelize.VIRTUAL
		},

		isEmailVerified: {
			type: Sequelize.BOOLEAN,
			defaultValue: 0
		},

		isVerified: {
			type: Sequelize.BOOLEAN,
			defaultValue: false
		},

		status: {
			type: Sequelize.ENUM,
			values: ["pending", "suspended", "active"],
			defaultValue: "pending",
		},

		firstTimeChangedPass: {
			type: Sequelize.BOOLEAN,
			defaultValue: false
		},

		geniieCommission: {
			type: Sequelize.INTEGER,
			defaultValue: 10,
			allowNull: false
		},

		suspendedBy: {
			type: Sequelize.ENUM,
			values: ["", "system", "super_admin", "provider"],
			defaultValue: ""
		},

		suspendSlug: {
			type: Sequelize.STRING,
			defaultValue: null
		},

		suspendReason: {
			type: Sequelize.STRING,
			defaultValue: null
		},
		stripeAccountId: {
			type: Sequelize.TEXT,
			defaultValue: null
		},
		isLogin: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		}
	}, {
	timestamps: true,
	defaultScope: {
	},
	hooks: {
		afterFind: async function (user, options) {
			if (user && user.length > 0) {
				user.map(item => {
					try {
						item.profileImage = item.profileImage ? item.profileImage : 'defaultProfile.png'
					} catch (error) {
						console.log(error);
					}
				})
			} else if (user && Object.keys(user).length > 0) {
				try {
					user.profileImage = user.profileImage ? user.profileImage : 'defaultProfile.png'
				} catch (error) {
					console.log(error);
				}
			}
		},
		beforeCreate: async function (user, options) {
			if (!user.profileImage) {
				user.profileImage = 'defaultProfile.png'
			}
		},
	}
})

// Gender Relation
Gender.hasMany(User, {
	foreignKey: 'genderId',
	sourceKey: 'id'
});
User.belongsTo(Gender, {
	foreignKey: 'genderId',
	targetKey: 'id'
})

// Roles Relation
User.belongsToMany(Role, {
	through: 'user_roles'
})
Role.belongsToMany(User, {
	through: 'users_roles'
})

// Account Balance Relation
User.hasOne(UserAccountBalance, {
	as: 'accountBalance',
	foreignKey: 'userId'
})

User.hasMany(FinancialAccountTransaction, { foreignKey: 'userId' });
User.hasMany(UserGeneralInformation, { foreignKey: 'userId' });
User.hasOne(VehicleInformation, { foreignKey: 'userId' });
UserAccountBalance.belongsTo(User)

// Language Relation
User.belongsToMany(Language, {
	through: 'user_languages'
})

Language.belongsToMany(User, {
	through: 'user_languages'
})


// Financial Account Transactions Relation
User.hasMany(FinancialAccountTransaction, {
	as: 'transactions',
	foreignKey: 'userId'
})
FinancialAccountTransaction.belongsTo(User)

User.hasOne(BankAccount)

module.exports = User;