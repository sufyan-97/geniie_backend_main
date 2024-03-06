'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('service_addresses', {

      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      longitude: {
        type: Sequelize.DECIMAL
      },
      latitude: {
        type: Sequelize.DECIMAL
      },
      userId: {
        type: Sequelize.INTEGER
      },
      userServiceId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      activeAddress: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0
      },
      deleteStatus: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      }
    })
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
