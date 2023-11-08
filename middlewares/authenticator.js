module.exports.authenticate = (req, res, next) => {
    if (!req.session.username) {
        return res.redirect('/login');
    }
    next();
}

module.exports.authenticated = (req, res, next) => {
    if (req.session.username) {
        return res.redirect('/');
    }
    next();
}