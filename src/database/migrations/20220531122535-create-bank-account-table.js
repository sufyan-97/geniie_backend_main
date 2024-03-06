'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('bank_accounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      holderName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      accountNumber: {
        type: Sequelize.STRING
      },
      sortCode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      countryId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      stateId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      cityId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      street: {
        type: Sequelize.STRING,
        allowNull: true
      },
      postCode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

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
