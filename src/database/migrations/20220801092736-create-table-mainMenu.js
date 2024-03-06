'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('main_menu_items', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      image: {
        type: Sequelize.STRING,
        allowNull: false
      },

      slug: {
        type: Sequelize.TEXT,
        allowNull: false
      },

      isWebView: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0
      },

      login_required: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 1
      },

      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 1
      },

      sortOrder: {
        type: Sequelize.DECIMAL(10, 6),
        allowNull: false
      },

      appName: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      deleteStatus: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0
      },

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
