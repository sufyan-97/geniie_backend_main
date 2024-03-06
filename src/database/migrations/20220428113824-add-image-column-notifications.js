'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'notifications',
        'image',
        {
          type: Sequelize.STRING
        }
      )
      ,
      queryInterface.addColumn(
        'notifications',
        'type',
        {
          type: Sequelize.ENUM,
          values: ['general', 'user'],
          defaultValue: 'general',
          allowNull: false
        }
      )
    ])
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
