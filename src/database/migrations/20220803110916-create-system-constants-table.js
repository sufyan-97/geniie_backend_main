'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("system_constants", {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},

			key: {
				type: Sequelize.STRING,
				allowNull: false,
			},

			value: {
				type: Sequelize.TEXT,
				allowNull: false,
			},

			description: {
				type: Sequelize.TEXT,
			},

			isActive: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: 1,
			},

			deleteStatus: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: 0,
			},

			createdAt: {
				type: "TIMESTAMP",
				defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
			},

			updatedAt: {
				type: "TIMESTAMP",
				defaultValue: Sequelize.literal(
					"CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
				),
			},
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
