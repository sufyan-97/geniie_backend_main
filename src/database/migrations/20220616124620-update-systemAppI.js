'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'notifications',
        'systemAppId',
        {
          type: Sequelize.INTEGER,
        }
      ),
      queryInterface.changeColumn(
        'notifications',
        'appName',
        {
          type: Sequelize.ENUM,
          values: ['', 'asaap', 'asaap-restaurant', 'asaap-rider'],
          defaultValue: 'asaap-restaurant',
          allowNull: false
        }
      ),
    ]);
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
