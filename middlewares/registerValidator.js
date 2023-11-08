const form = require('express-form');

module.exports = form(
    form.field('username').trim().required().minLength(6),
    form.field('email').trim().required().isEmail(),
    form.field('password').trim().required().minLength(6).is(/^[a-zA-Z0-9]+$/),
    form.field('repassword').trim().required().equals('field::password'),
);