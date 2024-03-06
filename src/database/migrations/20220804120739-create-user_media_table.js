'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.createTable('user_medias', {
				id: {
					type: Sequelize.INTEGER,
					primaryKey: true,
					autoIncrement: true
				},
				userId: {
					type: Sequelize.INTEGER,
					allowNull: false
				},

				mediaType: {
					type: Sequelize.ENUM,
					values: [
						'license', 'motorLicense', 'nationalId', 'photoId', 'criminalCheck', 'bagPhoto', 'bankStatement', 'profileImage', 'coverImage'
					],
					allowNull: true,
					defaultValue: null
				},

				fileName: {
					type: Sequelize.STRING,
					allowNull: false,
				},

				deleteStatus: {
					type: Sequelize.BOOLEAN,
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
		])
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
