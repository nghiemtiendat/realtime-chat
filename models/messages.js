const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    username: {
        type: String,
        require: true,
    },
    room: {
        type: String,
        require: true,
    },
    time: {
        type: String,
        require: true,
    },
    text: {
        type: String,
        require: true,
    },
});

const messsages = new mongoose.model('messages', messageSchema);
module.exports = messsages;