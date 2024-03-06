

module.exports = (req, res, next) => {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send({
        msg: "Authorization failed"
    })
}