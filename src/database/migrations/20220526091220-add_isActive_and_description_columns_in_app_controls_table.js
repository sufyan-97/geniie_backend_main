'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return [
      queryInterface.addColumn('app_controls', 'isActive', {
        type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: 1
      }),
      queryInterface.addColumn('app_controls', 'description', {
        type: Sequelize.TEXT,
        allowNull: true,
      })
    ];
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
