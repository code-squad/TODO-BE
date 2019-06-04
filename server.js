const net = require('net');
const server = net.createServer();

server.on('connection', (socket) => {
    console.log(`Client Connect!`);
    console.log(`Client local address : ${socket.localAddress}, local port : ${socket.localPort}`);
    console.log(`Client remote address : ${socket.remoteAddress}, remote port : ${socket.remotePort}`);
});