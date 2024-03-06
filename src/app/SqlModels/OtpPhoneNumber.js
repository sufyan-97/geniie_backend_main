const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');

const OtpPhoneNumber = sequelize_conn.define('OtpPhoneNumber', {
    
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
        allowNull: false,
    },
    
    verifyPhoneNumber: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
        
    },
    
    otpCode: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    
    attempts: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    },

    duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    },

    lastAttempt: {
        type: Sequelize.STRING,
        // defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },

    ipAddress: {
        type: Sequelize.TEXT,
        allowNull: false
    },

    deleteStatus: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
    },
}, {
    timestamps: true,
    tableName: 'otp_phone_number'
    // hooks: {
    //     // beforeFind: function (options) {
    //     //     options.attributes.exclude = ['password', 'refreshToken'];
    //     //     return options;
    //     // }
    // }
    // defaultScope: {
    //     // include: [{
            
    //     // }]
    //     // attributes: {
    //     //     exclude: ['password']
    //     // }
    // }
})

module.exports = OtpPhoneNumber;