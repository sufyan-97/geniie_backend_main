'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable('vehicle_informations', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},

			userId: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},

			type: {
				type: Sequelize.STRING,
				allowNull: false
			},

			licenseNumber: {
				type: Sequelize.STRING,
				allowNull: false
			},

			manufacturer: {
				type: Sequelize.STRING,
				allowNull: false
			},

			year: {
				type: Sequelize.STRING,
				allowNull: false
			},

			licensePlate: {
				type: Sequelize.STRING,
				allowNull: false
			},

			color: {
				type: Sequelize.STRING,
				allowNull: false
			},

			isValidPHL: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: 0,
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

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
