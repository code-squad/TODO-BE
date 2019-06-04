const net = require('net');
const server = net.createServer();
const clientSockets = [];

server.on('connection', (client) => {
    console.log(`Client Connect!`);
    console.log(`Client local address : ${client.localAddress}, local port : ${client.localPort}`);
    console.log(`Client remote address : ${client.remoteAddress}, remote port : ${client.remotePort}`);

    clientSockets.push(client);

    client.on('data', (data) => {
        console.log(`Client send data : ${data}`);
        clientSockets.forEach((otherClient) => {
            if (otherClient !== client) otherClient.write(data);
        });
    });

    client.on('close', () => {
        const index = clientSockets.indexOf(client);
        if (index !== -1) clientSockets.splice(index, 1);
        console.log(`There are ${clientSockets.length} connections now.`);
    });
});

server.on('error', (error) => { console.error(JSON.stringify(error)); });

server.on('close', () => { console.log(`Server socket is closed.`); });

server.listen(50000, () => {
    console.log(`TCP Server listen on address ${JSON.stringify(server.address())}`);
});