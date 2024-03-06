'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {


    return Promise.all([
      queryInterface.changeColumn(
        'service_addresses', 'userId', {
        type: Sequelize.DECIMAL,
        allowNull: true
      }),

      queryInterface.changeColumn(
        'service_addresses', 'userId', {
        type: Sequelize.INTEGER,
        allowNull: true
      }),
      queryInterface.changeColumn(
        'service_addresses', 'userServiceId', {
        type: Sequelize.INTEGER,
        allowNull: true
      })

    ])



    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
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
