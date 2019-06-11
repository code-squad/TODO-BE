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
      return;
    }

    if (req.method === 'signIn') {
      const data = fs.readFileSync(`./data/user.json`)
      const users = JSON.parse(data);
      const user = {}
      
      user.name = req.name;
      user.password = req.password;
      
      const checkValidUsername = users.filter(tmpuser => tmpuser.name === user.name)
      if (checkValidUsername.length !== 0) {
        console.log(checkValidUsername)
        res.method = 'newClient';
        res.message = '중복된 username입니다.'
        socket.write(`${JSON.stringify(res)}`);
        return;
      }
      users.push(user)
      fs.writeFileSync(`./data/user.json`, JSON.stringify(users));
      res.method = 'signedIn';
      socket.write(`${JSON.stringify(res)}`);
      return;
    }

    if (req.method === 'logIn') {
      
    }
  });

  socket.on('close', () => {
    const index = sockets.indexOf(socket)
    sockets.splice(index, 1);
    console.log(`${socket.remotePort} client disconnected`);
    console.log(sockets.map(soc => soc.remotePort));
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