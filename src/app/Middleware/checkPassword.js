// Libraries
const bcrypt = require('bcrypt');
const { Op } = require('sequelize')

// Models
var User = require('../SqlModels/User');


module.exports = async (req, res, next) => {
    let authUser = req.user

    let user = await User.findOne({
        where: {
            [Op.and]: [
                {
                    id: authUser.id
                },
                {
                    deleteStatus: false
                }
            ]
        }
    })
    if (!user) {
        return res.status(400).json({ message: `Invalid request.` })
	}

	if (user.password) {

		let password = req.headers['password'];
		if (!password) {
			return res.status(422).json({ message: `Error: Password is required` })
		}
		
		let isMatched = await bcrypt.compare(password, user.password);

		if (!isMatched) {
			return res.status(400).json({ message: `Error: Password is not matched` })
		}
	}

    next()
}