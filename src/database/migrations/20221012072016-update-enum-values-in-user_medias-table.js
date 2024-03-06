'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('user_medias', 'mediaType', {
      type: Sequelize.ENUM,
      values: [
        'license', 'motorLicense', 'nationalId', 'photoId', 'criminalCheck', 'bagPhoto', 'bankStatement', 'profileImage', 'coverImage', 'motorInsurance'
      ],
      allowNull: true,
      defaultValue: null
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
