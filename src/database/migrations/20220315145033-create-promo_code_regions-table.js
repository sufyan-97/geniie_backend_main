'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('promo_code_regions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      type: {
        type: Sequelize.ENUM,
        values: ['country', 'state', 'city'],
        defaultValue: 'country',
        allowNull: false
      },

      countryId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      stateId: {
        type: Sequelize.INTEGER
      },

      cityId: {
        type: Sequelize.INTEGER
      },


      createdAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updatedAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
