'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('notifications', "category", {
        type: Sequelize.ENUM,
        values: ['system', 'super_admin'],
        defaultValue: 'system',
        allowNull: false

      }),
      queryInterface.changeColumn('notifications', "appName", {
        type: Sequelize.ENUM,
        values: ['', 'asaap', 'asaap-restaurant', 'asaap-rider', 'rider','super_admin'],
        defaultValue: 'asaap-restaurant',
        allowNull: false

      })
    ])
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
