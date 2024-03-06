module.exports = async (req, res, next) => {
    if (req.headers['user-agent']) {
        req.deviceId = req.headers['user-agent']
        next()
    } else {
        return res.status(422).send({
            status: false,
            message: "Error: Invalid User Agent"
        })
    }
}