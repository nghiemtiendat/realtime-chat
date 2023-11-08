const chatForm = document.getElementById('chat-form');
const chatMessages = document.getElementById('chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('user-list');
const message = document.getElementById('message');

const socket = io();

socket.emit('joinRoom', {username, room});

socket.on('roomUsers', ({room, onUsers, offUsers}) => {
    outputRoomName(room);
    outputUsers(onUsers, offUsers);
});

socket.on('message', message => {
    if (message.username == username) {
        outputMessage(message, true);
    } else {
        outputMessage(message, false);
    }
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    socket.emit('chatMessage', message.value);
    message.value = '';
    message.focus();
});

function outputMessage(message, self) {
    if (self) {
        chatMessages.innerHTML += `
            <div class="message rounded-4 bg-primary px-3 py-2 my-3 ms-5 me-1">
                <p class="text-white text-end my-0">${message.time} <b>${message.username}</b></p>
                <p class="text-white text-end my-0">${message.text}</p>
            </div>`;
    }
    else {
        chatMessages.innerHTML += `
            <div class="message rounded-4 bg-secondary px-3 py-2 my-3 ms-1 me-5">
                <p class="text-white my-0"><b>${message.username}</b> ${message.time}</p>
                <p class="text-white my-0">${message.text}</p>
            </div>`;
    }
}

function outputRoomName(room) {
    roomName.innerText = room;
}

function outputUsers(onUsers, offUsers) {
    userList.innerHTML = '';
    onUsers.forEach(user => {
        userList.innerHTML += `
            <li class="my-2">
                <p class="badge text-success m-0"><i class="bi bi-circle-fill"></i></p> ${user.username}
            </li>`;
    });
    offUsers.forEach(user => {
        userList.innerHTML += `
            <li class="my-2">
                <p class="badge text-secondary m-0"><i class="bi bi-circle-fill"></i></p> ${user.username}
            </li>`;
    });
}

function searchMessage() {
    let input = document.getElementById('search');
    let filter = input.value.toLowerCase();
    let div = chatMessages.querySelectorAll('.message');

    for (let i = 0; i < div.length; i++) {
        let p = div[i].getElementsByTagName('p')[1];
        if (p) {
            let msg = p.innerText;
            if (msg.toLowerCase().indexOf(filter) > -1) {
                div[i].style.display = '';
            } else {
                div[i].style.display = 'none';
            }
        }
    }
}