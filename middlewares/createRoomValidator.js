const form = require('express-form');

module.exports = form(
    form.field('roomname').trim().required(),
);