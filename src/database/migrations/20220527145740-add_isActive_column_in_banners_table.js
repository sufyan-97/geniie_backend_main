'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    queryInterface.addColumn(
      "banners",
      'isActive',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 1
      }
    )
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
