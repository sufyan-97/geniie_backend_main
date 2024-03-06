'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('super_admin_route_permissions', {

      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING, allowNull: false, },
      route: { type: Sequelize.STRING, allowNull: false },
      icon: { type: Sequelize.STRING, allowNull: false },
      hasChild: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: 0 },
      parentRoute: { type: Sequelize.STRING, allowNull: true },
      roleId: { type: Sequelize.INTEGER, allowNull: false },
      isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: 1 }, 

      createdAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updatedAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      }
    })
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
