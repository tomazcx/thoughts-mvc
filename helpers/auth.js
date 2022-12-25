const checkAuth = (req, res, next) => {
    const userId = req.session.userId

    if (!userId) {
        return res.redirect("/login")
    }

    return next()
}

module.exports = checkAuth