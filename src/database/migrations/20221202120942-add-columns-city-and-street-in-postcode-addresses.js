'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('postcode_addresses', 'city', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('postcode_addresses', 'street', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
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
