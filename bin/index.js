// Libraries
var Table = require('cli-table');
let CountryList = require('country-state-city').Country;
let States = require('country-state-city').State;
let Cities = require('country-state-city').City;


const Currency = require('../src/app/SqlModels/Currency');
const Country = require('../src/app/SqlModels/Country');
const paypal = require('../src/lib/paypal')
const State = require('../src/app/SqlModels/State');
const City = require('../src/app/SqlModels/City');

// Custom Libraries
// const { sql } = require('../config/database');
// var app = require("../src/index.js");


// Helpers
// const sim_helpers = require('../helper/sim_helpers');
// const helpers = require('./command_helper');

//***************** Validations **********************//
// const accountValidators = require('../app/Validators/account');

// Constants
// var app_constants = require('../config/constants');
// const constants = require('../constants/Application');


exports.config = function (args) {
    let username = args.u || args.username;
    let password = args.p || args.password;
    if (username && password) {
        console.log("hi! config", args)
    }
}

// exports.allRoutes = async function () {
//     var routes = [];
//     app._router.stack.forEach(function (middleware) {
//         if (middleware.route) { // routes registered directly on the app
//             let methods = ''
//             for (key in middleware.route.methods) {
//                 if (middleware.route.methods[key] === true) {
//                     methods += key + ','
//                 }
//             }
//             routes.push([
//                 middleware.route.path,
//                 methods
//             ]);
//         } else if (middleware.name === 'router') { // router middleware

//             middleware.handle.stack.forEach(function (handler) {
//                 route = handler.route;
//                 if (route) {
//                     let methods = ''
//                     for (key in route.methods) {
//                         if (route.methods[key] === true) {
//                             methods += key + ','
//                         }
//                     }
//                     routes.push([
//                         route.path,
//                         methods
//                     ]);
//                 }
//             });
//         }
//     });
//     // console.log(routes)
//     var table = new Table({
//         // head: ['Path', 'Method'],
//         colWidths: [100, 50]
//     });
//     table.push(...routes)
//     console.log(table.toString());
//     process.exit(1)
// }

exports.relateCurrencyToCountry = async function (args) {
    try {

        let currencyCode = args.c || args.currency;
        let countryCode = args.t || args.country;

        if (!currencyCode || !countryCode) {
            console.error('params required')
            process.exit(1)
            // return;
        }

        let currencyData = await Currency.findOne({
            where: {
                currencyCode: currencyCode
            }
        })

        if (!currencyData) {
            console.info('Currency not available');
            process.exit(1)
        }

        let countryData = await Country.findOne({
            where: {
                countryCode: countryCode
            }
        })

        if (!countryData) {
            console.info('Currency not available');
            process.exit(1)
        }

        countryData.currencyId = currencyData.id;

        await countryData.save()

        console.info('data is mapped successfully')
    } catch (error) {
        console.error(error)
        process.exit(1)
    }

}


exports.saveCountryState = async function (args) {
    try {

        let allCurrencies = await Currency.findAll();
        let allCurrenciesObject = {}

        allCurrencies.map(item => {
            allCurrenciesObject[item.currencyCode] = item
        })

        let allCountries = CountryList.getAllCountries()
        let bulkInsertCountries = []

        allCountries.map(country => {

            let currencyId = allCurrenciesObject[country.currency]?.id

            let data = {
                currencyId: currencyId ? currencyId : null,
                countryCode: country.isoCode,
                countryName: country.name,
                dialCode: country.phonecode,
                latitude: country.latitude,
                longitude: country.longitude,
                timeZones: JSON.stringify(country.timezones),
                flag: country.flag,
                states: []
            }

            let states = States.getStatesOfCountry(country.isoCode)

            states.map(state => {

                let stateData = {
                    name: state.name,
                    countryCode: country.isoCode,
                    stateCode: state.isoCode,
                    longitude: state.longitude,
                    latitude: state.latitude,
                    cities: []
                }


                data.states.push(stateData)
            })
            bulkInsertCountries.push(data)
        })

        console.log(bulkInsertCountries.length);
        await Country.bulkCreate(bulkInsertCountries, { include: { model: State, include: City }, })

        process.exit(1)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }


}

exports.saveStateCities = async function (args) {
    try {

        let states = await State.findAll()


        for (let i = 0; i < states.length; i++) {
            let item = states[i]
            let cities = Cities.getCitiesOfState(item.countryCode, item.stateCode)
            let bulkInsertCities = []
            cities.map(city => {
                bulkInsertCities.push({
                    stateId: item.id,
                    name: city.name,
                    countryCode: item.countryCode,
                    stateCode: item.stateCode,
                    longitude: city.longitude,
                    latitude: city.latitude
                })
            })
            await City.bulkCreate(bulkInsertCities)
        }

        process.exit(1)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }


}


