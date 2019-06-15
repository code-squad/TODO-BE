const fileManager = require('./file_manager');
const net = require('net');

const memberServer = net.createServer();
const memberClientSocket = [];

memberServer.listen(60000, () => { 
    console.log(`[Member] Server listen on address -> ${JSON.stringify(memberServer.address())}`); 
});

memberServer.on('connection', (memberClient) => {
    console.log(`[Member] local address -> ${memberClient.localAddress}, local port -> ${memberClient.localPort}`);
    console.log(`[Member] remote address -> ${memberClient.remoteAddress}, remote port -> ${memberClient.remotePort}`);

    memberClientSocket.push(memberClient);

    memberClient.on('data', (data) => { sign(memberClient, data); });

    memberClient.on('close', () => {
        const index = memberClientSocket.indexOf(memberClient);
        if (index !== -1) memberClientSocket.splice(index, 1);
        console.log(`There are ${memberClientSocket.length} connections now.`);
    });
});

memberServer.on('error', (error) => { console.error(JSON.stringify(error)); });

memberServer.on('close', () => { console.log(`[Member] Server socket is closed.`); });

const sign = async (memberClient, data) => {
    const [type, id, pw] = String(data).split('#');
    memberClient.write(String(await fileManager.sign(type, id, pw)));
} 