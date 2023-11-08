const bcrypt = require('bcrypt');
const users = require('../models/users');

exports.showLoginPage = (req, res) => {
    let {email, password} = req.cookies;
    res.render('login', {email, password});
}

exports.showRegisterPage = (req, res) => {
    res.render('register');
}

exports.showUpdatePage = (req, res) => {
    users.findOne({username: req.session.username})
    .then(result => {
        let {email, username} = result;
        res.render('update', {email, username});
    })
    .catch(error => console.log(error));
}

exports.loginHandle = (req, res) => {
    if (!req.form.isValid) {
        req.session.flash = {
            type: 'danger',
            message: req.form.errors[0],
        }
        return res.redirect('/login');
    }

    let {email, password, remember} = req.body;
    users.findOne({email})
    .then(user => {
        if (!user) {
            req.session.flash = {
                type: 'danger',
                message: 'Email or password is not correct.',
            }
            return res.redirect('/login');
        }

        let match = bcrypt.compareSync(password, user.password);
        if (!match) {
            req.session.flash = {
                type: 'danger',
                message: 'Email or password is not correct.',
            }
            return res.redirect('/login');
        }

        if (remember) {
            res.cookie('email', email);
            res.cookie('password', password);
        }
        req.session.username = user.username;
        res.redirect('/');
    })
    .catch(error => console.log(error));
}

exports.logoutHandle = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
}

exports.registerHandle = (req, res) => {
    if (!req.form.isValid) {
        req.session.flash = {
            type: 'danger', 
            message: req.form.errors[0],
        }
        return res.redirect('/register');
    }

    let {username, email, password} = req.body;
    users.findOne({$or: [{username}, {email}]})
    .then(user => {
        if (user) {
            req.session.flash = {
                type: 'danger',
                message: 'Username or email already has been used.',
            }
            res.redirect('/register');
        }

        let hash = bcrypt.hashSync(password, 8);
        new users({username, email, password: hash}).save()
        .then(() => {
            req.session.flash = {
                type: 'success',
                message: 'Register successfully. Please login to continue.'
            }
            res.redirect('/login')
        })
        .catch(error => console.log(error));
    });
}

exports.updateHandle = (req, res) => {
    if (!req.form.isValid) {
        req.session.flash = {
            type: 'danger', 
            message: req.form.errors[0],
        }
        return res.redirect('/update');
    }
    
    let username = req.session.username;
    users.findOne({username})
    .then(user => {
        let password = req.body.password;
        let match = bcrypt.compareSync(password, user.password);
        if (match) {
            req.session.flash = {
                type: 'danger',
                message: 'New password is similar to old password.',
            };
            return res.redirect('/update');
        }

        let hash = bcrypt.hashSync(password, 8);
        users.findOneAndUpdate({username}, {password: hash})
        .then(() => {
            req.session.flash = {
                type: 'success',
                message: 'Change password successfully.',
            }
            res.redirect('/');
        })
        .catch(error => console.log(error));
    })
    .catch(error => console.log(error));
}