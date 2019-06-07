const net = require('net');
const memberServer = net.createServer();
const memberClientSocket = [];

memberServer.on('connection', (memberClient) => {
    console.log(`Member Client Connect!`);
    console.log(`Member Client local address : ${memberClient.localAddress}, local port : ${memberClient.localPort}`);
    console.log(`Member Client remote address : ${memberClient.remoteAddress}, remote port : ${memberClient.remotePort}`);

    memberClientSocket.push(memberClient);

    memberClient.on('data', (data) => {
        console.log(`Member Server receive data : ${data}`);
        memberClient.write(`true`);
    });

    memberClient.on('close', () => {
        const index = memberClientSocket.indexOf(memberClient);
        if (index !== -1) memberClientSocket.splice(index, 1);
        console.log(`There are ${memberClientSocket.length} connections now.`);
    });
});

memberServer.on('error', (error) => { console.error(JSON.stringify(error)); });

memberServer.on('close', () => { console.log(`Member Server socket is closed.`); });

memberServer.listen(60000, () => { console.log(`TCP Server listen on address ${JSON.stringify(memberServer.address())}`); });