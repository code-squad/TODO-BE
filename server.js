const net = require('net');
const server = net.createServer();

server.on('connection', (socket) => {
    console.log(`Client Connect!`);
    console.log(`Client local address : ${socket.localAddress}, local port : ${socket.localPort}`);
    console.log(`Client remote address : ${socket.remoteAddress}, remote port : ${socket.remotePort}`);

    socket.on('data', (data) => {
        console.log(`Client send data : ${data}`);
        socket.write(data);
    });
});

server.on('error', (error) => { console.error(JSON.stringify(error)); });

server.on('close', () => { console.log(`Server socket is closed.`); });

server.listen(50000, () => {
    console.log(`TCP Server listen on address ${JSON.stringify(server.address())}`);
});