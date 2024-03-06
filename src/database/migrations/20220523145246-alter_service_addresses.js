'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn(
        'service_addresses', 'longitude', {
          type: Sequelize.DECIMAL,
        allowNull: true
      }),
      queryInterface.changeColumn(
        'service_addresses', 'latitude', {
          type: Sequelize.DECIMAL,
        allowNull: true
      })

    ])

    // queryInterface.addColumn('service_addresses',"cityId", {type: Sequelize.INTEGER});
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
