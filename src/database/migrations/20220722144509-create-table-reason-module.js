'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('reason_modules', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      moduleTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      reasonId: {
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
