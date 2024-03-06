'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
		return queryInterface.createTable('postcode_addresses', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},

			postcode: {
				type: Sequelize.TEXT,
				allowNull: true,
			},

			postcodeAddress: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			addressDetails: {
				type: Sequelize.TEXT,
				allowNull: true,
			},

			latitude: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			longitude: {
				type: Sequelize.TEXT,
				allowNull: true,
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
