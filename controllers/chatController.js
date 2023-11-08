const rooms = require('../models/rooms');
const messages = require('../models/messages');

exports.showIndexPage = (req, res) => {
    rooms.find()
    .then(rooms => res.render('index', {username: req.session.username, rooms}))
    .catch(error => console.log(error));
}

exports.showCreatePage = (req, res) => {
    res.render('create');
}

exports.showChatPage = (req, res) => {
    let username = req.session.username;
    let room = req.query.room;
    
    let html = '';
    messages.find()
    .then(result => {
        result.forEach(msg => {
            if (msg.room == room) {
                if (msg.username == username) {
                    html += `
                    <div class="message rounded-4 bg-primary px-3 py-2 my-3 ms-5 me-1">
                        <p class="text-white text-end my-0">${msg.time} <b>${msg.username}</b></p>
                        <p class="text-white text-end my-0">${msg.text}</p>
                    </div>`;
                }
                else {
                    html += `
                    <div class="message rounded-4 bg-secondary px-3 py-2 my-3 ms-1 me-5">
                        <p class="text-white my-0"><b>${msg.username}</b> ${msg.time}</p>
                        <p class="text-white my-0">${msg.text}</p>
                    </div>`;
                }
            }
        });
        req.session.room = room;
        res.render('chat', {username, room, html});
    })
    .catch(error => console.log(error));
}

exports.leaveRoomHandle = (req, res) => {
    res.redirect('/');
}

exports.createRoomHandle = (req, res) => {
    if (!req.form.isValid) {
        req.session.flash = req.form.errors[0];
        return res.redirect('/login');
    }

    let roomname = req.body.roomname;
    let username = req.session.username;
    rooms.findOne({roomname})
    .then(room => {
        if (room) {
            req.session.flash = {
                type: 'danger',
                message: 'Room already has been existed.',
            }
            res.redirect('/create');
        }

        new rooms({roomname, username}).save()
        .then(() => {
            req.session.flash = {
                type: 'success',
                message: 'Create new room successfully.'
            }
            res.redirect('/');
        })
        .catch(error => console.log(error));
    })
    .catch(error => console.log(error));
}