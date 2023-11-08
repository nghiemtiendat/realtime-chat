const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    roomname: {
        type: String,
        require: true,
        unique: true,
    },
    username: {
        type: String,
        require: true,
    }
});

const rooms = new mongoose.model('room', roomSchema);
module.exports = rooms;