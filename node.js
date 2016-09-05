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

    function usersCountHandler() {
        let ids;

        ids = Object.getOwnPropertyNames(users);

        for(let i = 0; i < ids.length; i++) {
            users[ids[i]].send(JSON.stringify({type: 'users count', count: ids.length}));
        }
    }

    function replayMessageHandler(message) {
        let ids;

        ids = Object.getOwnPropertyNames(users);

        message.type = 'chat message';

        for(let i = 0; i < ids.length; i++) {
            users[ids[i]].send(JSON.stringify(message));
        }
    }

    socket.on('message', (data) => {
        let message = JSON.parse(data);

        switch (message.type) {
            case 'users count': usersCountHandler(message); break;
            case 'chat message': replayMessageHandler(message); break;
        }
    });

    socket.on('close', () => {
        console.log(`a user ${userId} disconnected`);
        delete users[userId];
    })
});

