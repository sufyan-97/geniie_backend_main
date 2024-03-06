'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('service_categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {type: Sequelize.STRING, allowNull:false},
      description:{type:Sequelize.TEXT},
      isMultiple:{type:Sequelize.BOOLEAN, defaultValue:1},
      status:{type:Sequelize.BOOLEAN, defaultValue:1},
      serviceId:{ type:Sequelize.INTEGER, allowNull:false},

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ServiceCategories');
  }
};