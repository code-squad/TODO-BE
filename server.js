const net = require('net');
const server = net.createServer();

server.on('connection', (socket) => {
    console.log(`Client Connect!`);
    console.log(`Client local address : ${socket.localAddress}, local port : ${socket.localPort}`);
    console.log(`Client remote address : ${socket.remoteAddress}, remote port : ${socket.remotePort}`);
});

server.listen(50000, () => {
    console.log(`TCP Server listen on address ${JSON.stringify(server.address())}`);
});