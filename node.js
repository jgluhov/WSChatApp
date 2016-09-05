const ws = require('ws');

const wsServer = new ws.Server({
    port: 8081
});

let users = Object.create(null);

wsServer.on('connection', (socket) => {
    let userId;

    userId = Math.random();
    users[userId] = socket;

    console.log(`a user ${userId} connected`);

    socket.on('message', (message) => {
        let ids;

        ids = Object.getOwnPropertyNames(users);

        for(let i = 0; i < ids.length; i++) {
            users[ids[i]].send(message);
        }
    });

    socket.on('close', () => {
        console.log(`a user ${userId} disconnected`);
        delete users[userId];
    })
});
