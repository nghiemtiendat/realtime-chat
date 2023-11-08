const form = require('express-form');

module.exports = form(
    form.field('email').trim().required().isEmail(),
    form.field('password').trim().required().minLength(6).is(/^[a-zA-Z0-9]+$/),
);