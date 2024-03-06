'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
    queryInterface.addColumn('service_addresses',"cityId", {type: Sequelize.INTEGER});
    queryInterface.addColumn("service_addresses","countryId",{type:Sequelize.INTEGER});
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
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
