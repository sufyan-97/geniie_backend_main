//Helper
const general_helper = require('../../helpers/general_helper')

const { respondWithSuccess, respondWithError } = require('../../helpers/httpHelper')

// Modals


exports.getAll = async function (req, res) {

    try {
        let supportResponse = await general_helper.getDepartments()
        if (supportResponse?.data?.data && supportResponse?.data?.data.length) {
            return respondWithSuccess(req, res, 'department fetched successfully', supportResponse.data.data)
        } else {
            return respondWithSuccess(req, res, 'unable to fetch departments, departments not found', [])
        }
    } catch (error) {
        console.log(error)
        return respondWithError(req, res, '', null, 500)
    }
}