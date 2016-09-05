const ws = require('ws');
const replay = require('./replay');

const wsServer = new ws.Server({
    port: 8081
});

let users = Object.create(null);

wsServer.on('connection', (socket) => {
    let userId;

    userId = Math.random();
    users[userId] = socket;

    socket.on('message', (data) => {
        let message = JSON.parse(data);

        switch (message.type) {
            case 'users count': replay.usersCountHandler(); break;
            case 'chat message': replay.chatMessageHandler(message); break;
        }
    });

    socket.on('close', () => {
        delete users[userId];
        usersCountHandler();
    })
});

