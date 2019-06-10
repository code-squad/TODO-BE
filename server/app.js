const net = require('net');
const sockets = []
const server = net.createServer(socket => {
  console.dir(socket.remotePort);
  socket.on('data', data => {
    const request = JSON.parse(data)
    const response = {}
    console.log(request)
    if (!request.user) {
      response.loggedIn = false
      socket.write(`${JSON.stringify(response)}`);
      return
    }
  });

  socket.on('close', () => {
    console.log(`${socket.remotePort} client disconnected`);
  });
});

server.on('connection', socket => {
  const response = {}
  response.loggedIn = false
  sockets.push(socket);
  console.log(JSON.stringify(response));
  socket.write(`${JSON.stringify(response)}`)
})

server.on('error', err => {
  console.log('err : ' + err);
})

server.listen(5000, () => {
  console.log('opened server on', server.address());
});