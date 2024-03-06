'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('restaurant_riders', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      restaurant_userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      riderId: {
        type: Sequelize.INTEGER,
        allowNull: false
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
