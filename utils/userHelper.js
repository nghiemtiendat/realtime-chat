const users = [];
const onUsers = [];
const offUsers = [];

module.exports.userJoin = (id, username, room) => {
    let index = onUsers.findIndex(user => user.username == username && user.room == room);
    if (index == -1) {
        onUsers.push({username, room});
    }
    
    index = offUsers.findIndex(user => user.username == username && user.room == room);
    if (index != -1) {
        offUsers.splice(index, 1);
    }

    let user = {id, username, room};
    users.push(user);
    return user;
}

module.exports.userLeave = (id) => {
    let index = users.findIndex(user => user.id == id);
    if (index > -1) {
        let user = users.splice(index, 1)[0];
        index = users.findIndex(u => u.username == user.username && u.room == user.room);
        if (index == -1) {
            index = onUsers.findIndex(u => u.username == user.username && u.room == user.room);
            let leaveUser = onUsers.splice(index, 1)[0];
            offUsers.push(leaveUser);
            return leaveUser;
        }
    }
}

module.exports.getCurrentUser = (id) => {
    return users.find(user => user.id == id);
}

module.exports.getOnUsers = (room) => {
    return onUsers.filter(user => user.room == room);
}

module.exports.getOffUsers = (room) => {
    return offUsers.filter(user => user.room == room);
}