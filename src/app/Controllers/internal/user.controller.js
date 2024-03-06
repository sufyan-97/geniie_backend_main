
const { Op } = require('sequelize')

// Models
const User = require('../../SqlModels/User');

// Helpers

// Constants


// ************ GET USERS ************ //
exports.getAll = async function (req, res) {
	try {
		let userIds = req.query.list
		console.log(userIds);

		User.findAll({
			where: {
				id: {
					[Op.in]: JSON.parse(userIds)
				}
			},
			attributes: ['id', 'username', 'email', 'profileImage', 'fullName', 'phoneNumber', "firstName", "lastName"]
		}).then(data => {
			return res.send({
				data: data
			})
		})
	} catch (error) {
		console.log(error)
		return res.status(500).send({
			message: 'Interval server error'
		})
	}

}
