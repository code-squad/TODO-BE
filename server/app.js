const net = require('net');
const fs = require('fs');
const sockets = []
const server = net.createServer(socket => {
  console.dir(socket.remotePort);
  socket.on('data', data => {
    const req = JSON.parse(data)
    const res = {}
    console.log(req)
    if (req.method === 'init') {
      res.method = 'newClient'
      socket.write(`${JSON.stringify(res)}`);
      return
    }
    if (req.method === 'signIn') {
      const user = {}
      console.log(req.method);
      console.log(req.password);
      console.log(req.username);
      user.username = req.username;
      user.password = req.password;
      fs.writeFileSync(`./data/${req.username}.json`, JSON.stringify(user));
      res.method = 'signedIn'
      socket.write(`${JSON.stringify(res)}`);
    }
    if (req.method === 'logIn') {
      console.log(req.method);
      console.log(req.password);
      console.log(req.username);
      
    }
  });

  socket.on('close', () => {
    console.log(`${socket.remotePort} client disconnected`);
  });
});

server.on('connection', socket => {
  sockets.push(socket);
})

server.on('error', err => {
  console.log('err : ' + err);
})

server.listen(5000, () => {
  console.log('opened server on', server.address());
});