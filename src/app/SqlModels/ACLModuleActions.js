const { sequelize_conn } = require('../../config/database');
const Sequelize = require('sequelize');
// const UserApps = require('./UserApps');

const ModuleActions = sequelize_conn.define('acl_module_actions', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    component_id: {
        type: Sequelize.INTEGER
    },
    title: {
        type: Sequelize.STRING
    },
    action: {
        type: Sequelize.TEXT
    },
    sort: {
        type: Sequelize.INTEGER
    },
    package_name: {
        type: Sequelize.TEXT
    }
}, {
    timestamps: false,
    // underscored: true,
    // hooks: {
    //     beforeValidate: (user, options) => {
    //       user.mood = 'happy';
    //     },
    //     afterValidate: (user, options) => {
    //       user.username = 'Toni';
    //     }
    // }
})

// AppsInfo.addHook('beforeValidate', (user, options) => {
//     user.mood = 'happy';
// });

// AppsInfo.hasMany(UserApps, { onDelete: 'cascade', hooks: true });
// UserApps.belongsTo(AppsInfo);

module.exports = ModuleActions;