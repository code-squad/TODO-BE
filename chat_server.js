const net = require('net');
const chatServer = net.createServer();
const chatClientSockets = [];

chatServer.setMaxListeners(15);

chatServer.listen(50000, () => {
    console.log(`[Chat] Server listen on address -> ${JSON.stringify(chatServer.address())}`);
});

chatServer.on('connection', (chatClient) => {
    console.log(`[Chat] local address -> ${chatClient.localAddress}, local port -> ${chatClient.localPort}`);
    console.log(`[Chat] remote address -> ${chatClient.remoteAddress}, remote port -> ${chatClient.remotePort}`);

    chatClientSockets.push(chatClient);

    chatClientSockets.forEach((otherChatClient) => {
        if (otherChatClient !== chatClient) 
            otherChatClient.write(`--- ${chatClient.remotePort} User entered. ---`);
    });

    chatClient.on('data', (data) => {
        console.log(`${data}`);
        chatClientSockets.forEach((otherChatClient) => {
            if (otherChatClient !== chatClient) otherChatClient.write(data);
        });
    });

    chatClient.on('close', () => {
        const remotePort = chatClient.remotePort;
        const index = chatClientSockets.indexOf(chatClient);
        if (index !== -1) chatClientSockets.splice(index, 1);
        console.log(`There are ${chatClientSockets.length} connections now.`);
        chatClientSockets.forEach((otherChatClient) => { 
            otherChatClient.write(`--- ${remotePort} User exited. ---`);
        });
    });
});

chatServer.on('error', (error) => { console.error(JSON.stringify(error)); });

chatServer.on('close', () => { console.log(`Server socket is closed.`); });
