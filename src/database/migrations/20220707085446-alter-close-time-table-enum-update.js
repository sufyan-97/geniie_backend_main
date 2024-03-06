'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.changeColumn('next_opening_times', 'openingTimeType', {
      type: Sequelize.ENUM,
      values: ['minutes', 'hours', 'days', 'weeks', 'rest_of_the_day', 'indefinitely', 'other']
    })
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
