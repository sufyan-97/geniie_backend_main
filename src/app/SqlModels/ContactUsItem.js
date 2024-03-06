const { sequelize_conn } = require('../../../config/database');
const Sequelize = require('sequelize');

const ContactUsItem = sequelize_conn.define('contact_us_items', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: Sequelize.STRING, allowNull: false },
    image: { type: Sequelize.TEXT, allowNull: false },
    slug: { type: Sequelize.TEXT, allowNull: false },
    deleteStatus: { type: Sequelize.BOOLEAN, defaultValue: 0 }
}, {
    timestamps: true,
    // underscored: true
})

module.exports = ContactUsItem;