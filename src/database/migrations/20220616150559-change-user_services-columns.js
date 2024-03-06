module.exports = {
	up: async (queryInterface, Sequelize) => {
		/**
		 * Add altering commands here.
		 *
		 * Example:
		 */
		await queryInterface.changeColumn('user_services', 'status', {
			type: Sequelize.ENUM,
			values: ['pending', 'request_for_approval', 'approved', 'rejected', 'active'],
			defaultValue: 'pending',
			allowNull: false
		});
	},

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
	}
};
