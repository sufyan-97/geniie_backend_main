'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.addColumn('users', 'uploadId', {
      type: Sequelize.STRING,
      allowNull: true,
    })
    queryInterface.addColumn('service_categories', 'isSystem', {
      type: Sequelize.BOOLEAN,
      defaultValue:0
    })
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
