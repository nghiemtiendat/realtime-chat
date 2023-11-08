const messages = require('../models/messages');
const userHelper = require('./userHelper');
const messageHelper = require('./messageHelper');

const {userJoin, userLeave, getCurrentUser, getOnUsers, getOffUsers} = userHelper;
const {formatMessage} = messageHelper;
const botName = 'Chat Bot';

module.exports = (io, socket) => {
    // when user connect
    socket.on('joinRoom', ({username, room}) => {
        let index = getOnUsers(room).findIndex(user => user.username == username && user.room == room);
        if (index == -1) {
            socket.emit('message', formatMessage(botName, 'Welcome to ITChat'));
            socket.broadcast
                .to(room)
                .emit('message', formatMessage(botName, `${username} has joined the chat`));
        }

        let user = userJoin(socket.id, username, room);
        socket.join(user.room);
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            onUsers: getOnUsers(user.room),
            offUsers: getOffUsers(user.room),
        });
    });

    // when user send a message
    socket.on('chatMessage', (msg) => {
        let user = getCurrentUser(socket.id);
        let message = formatMessage(user.username, msg);
        io.to(user.room).emit('message', message);
        new messages({username: user.username, room: user.room, time: message.time, text: message.text})
            .save()
            .catch(error => console.log(error));
    });

    // when user disconnect
    socket.on('disconnect', () => {
        let user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                onUsers: getOnUsers(user.room),
                offUsers: getOffUsers(user.room),
            });
        }
    });
}