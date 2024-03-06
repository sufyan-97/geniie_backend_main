const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');
const City = require('./City')
const State = require('./State');
const Country = require('./Country')

const BankAccount = sequelize_conn.define('bank_accounts', {

    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    holderName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    accountNumber: {
        type: Sequelize.STRING,
        allowNull: false
    },
    sortCode: {
        type: Sequelize.STRING,
        allowNull: false
    },
    countryId: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    stateId: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    cityId: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    userId: { type: Sequelize.INTEGER },
    street: {
        type: Sequelize.STRING,
        allowNull: true
    },
    postCode: {
        type: Sequelize.STRING,
        allowNull: true
    },
    deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
    },

}, {
    timestamps: true,
    hooks: {
        beforeSave: async function (bankAccount, options) {

            if (bankAccount.cityId) {
                City.findOne({
                    where: {
                        id: bankAccount.cityId
                    },
                    attributes: ['stateId']
                }).then(async city => {
                    if (city && city.stateId) {
                        bankAccount.stateId = city.stateId
                        State.findOne({
                            where: {
                                id: city.stateId
                            },
                            attributes: ['countryId']
                        }).then(state => {
                            if (state && state.countryId) {
                                bankAccount.countryId = state.countryId
                            }
                        })
                    }
                })
            }
        }
    }
})

// BankAccount.belongsTo(User)
// User.haseMany(BankAccount)


module.exports = BankAccount;