const fileManager = require('./file_manager');
const net = require('net');

const memberServer = net.createServer();
const memberClientSocket = [];

memberServer.setMaxListeners(15);

memberServer.listen(60000, () => { console.log(`Server listen on address -> ${JSON.stringify(memberServer.address())}`); });

memberServer.on('connection', (memberClient) => {
    console.log(`local address -> ${memberClient.localAddress}, local port -> ${memberClient.localPort}`);
    console.log(`remote address -> ${memberClient.remoteAddress}, remote port -> ${memberClient.remotePort}`);

    memberClientSocket.push(memberClient);

    memberClient.on('data', (data) => {
        const [type, id, pw] = String(data).split('#');
        if (type === 'SignIn') {
            fileManager.signIn(id, pw);
            setTimeout(() => memberClient.write(fileManager.isMember()), 100);
        } else if (type === 'SignUp') {
            fileManager.signUp(id, pw);
            memberClient.write(fileManager.isMember());
        }
    });

    memberClient.on('close', () => {
        const index = memberClientSocket.indexOf(memberClient);
        if (index !== -1) memberClientSocket.splice(index, 1);
        console.log(`There are ${memberClientSocket.length} connections now.`);
    });
});

memberServer.on('error', (error) => { console.error(JSON.stringify(error)); });

memberServer.on('close', () => { console.log(`[Member] Server socket is closed.`); });