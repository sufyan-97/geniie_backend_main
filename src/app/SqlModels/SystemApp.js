// Libraries
const Sequelize = require('sequelize');

// Custom Libraries
const { sequelize_conn } = require('../../../config/database');
const City = require('./City');

// Models
// const Role = require('./Role');

const SystemApp = sequelize_conn.define('system_apps', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    name: { type: Sequelize.STRING, allowNull: false },

    slug: { type: Sequelize.STRING, allowNull: false },

    packageName: { type: Sequelize.STRING, allowNull: false },

    image: { type: Sequelize.STRING, allowNull: true },

    fireBaseToken: { type: Sequelize.TEXT, allowNull: true },

    deleteStatus: { type: Sequelize.BOOLEAN, defaultValue: 0 },
}, {
    timestamps: true,
    // hooks: {
    //     beforeCreate: async function (systemApp, options) {
    //         let slug = systemApp.name.replace(/\s/g, `-`);
    //         systemApp.slug = slug;

    //         // function(value, next) {
    //         let value = await SystemApp.findOne({
    //             where: { slug: slug },
    //             attributes: ['id']
    //         });
    //         if (value) {
    //             let key = Date.now()
    //             systemApp.slug = `${slug}-${key}`;
    //         }

    //     }
    // }
})

module.exports = SystemApp;