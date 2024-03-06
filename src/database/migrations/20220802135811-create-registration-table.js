"use strict";

module.exports = {
	async up(queryInterface, Sequelize) {
		return queryInterface.createTable("registrations", {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},

			userId: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},

			roleId: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},

			status: {
				type: Sequelize.ENUM,
				values: ["waiting for approval", "approved", "active"],
				defaultValue: "waiting for approval",
				allowNull: false,
			},

			registrationData: {
				type: Sequelize.TEXT
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

	async down(queryInterface, Sequelize) {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
	},
};
