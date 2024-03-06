'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('waiting_list', 'promoCodeId', {
        type: Sequelize.INTEGER,
        allowNull: false,
      }),
      queryInterface.changeColumn('waiting_list', 'firstName', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn('waiting_list', 'lastName', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn('waiting_list', 'email', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn('waiting_list', 'mobileNumber', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn('waiting_list', 'whatsappNumber', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
