'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('promo_codes', 'promoType', {
        type: Sequelize.ENUM,
        values: ['area', 'user'],
        defaultValue: 'area',
        allowNull: false
      }),
    ]);
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
