const net = require('net');
const fs = require('fs');
const sockets = [];
const sessions = [];

const server = net.createServer(socket => {
  console.dir(socket.remotePort);
  socket.on('data', async data => {
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
      res.method = 'newClient';
      res.message = '회원가입이 정상처리되었습니다.';
      socket.write(`${JSON.stringify(res)}`);
      return;
    }

    if (req.method === 'logIn') {
      const data = fs.readFileSync(`./data/user.json`)
      const users = JSON.parse(data);
      const username = req.name;
      const password = req.password;
      const user = users.filter(tmpuser => tmpuser.name === username)[0];
      if (user.password === password) {
        if (sessions.find(session => session.name === username) !== undefined) {
          res.method = 'newClient';
          res.message = '다른 곳에서 이미 사용중인 username입니다.';
          socket.write(`${JSON.stringify(res)}`);
          return;
        }
        const session = {
          remotePort : socket.remotePort,
          name : username,
          status : 'inQueue',
        };
        sessions.push(session);
        console.log(sessions);
        res.method = 'loggedIn';
        res.message = '매칭상대를 찾는 중...!';
        socket.write(`${JSON.stringify(res)}`);
        const inQueue = sessions.filter(ses => ses.status === 'inQueue')
        if (inQueue.length === 2) {
          const p1socket = sockets.find(soc => soc.remotePort === inQueue[0].remotePort);
          const p2socket = sockets.find(soc => soc.remotePort === inQueue[1].remotePort);
          sessions.map(ses => ses.status = 'inGame');
          const game = {
            player1 : inQueue[0],
            player2 : inQueue[1],
            p1socket : p1socket,
            p2socket : p2socket,
          }
          res.method = 'getInGame';
          res.message = '게임을 이제 시작합니다!';
          console.log(p1socket.remotePort, p2socket.remotePort);
          p1socket.write(`${JSON.stringify(res)}`);
          p2socket.write(`${JSON.stringify(res)}`);
          return;
        }
        return;
      }
      res.method = 'newClient';
      res.message = '잘못된 username 또는 password입니다.';
      socket.write(`${JSON.stringify(res)}`);
      return;
    }
  });

  socket.on('close', () => {
    const socIdx = sockets.indexOf(socket)
    const sesIdx = sessions.findIndex(session => session.remotePort === socket.remotePort);
    sockets.splice(socIdx, 1);
    sessions.splice(sesIdx, 1);

    console.log(`${socket.remotePort} client disconnected`);
    console.log(sessions);
    console.log(sockets.map(soc => soc.remotePort));
  });
});

server.on('connection', socket => {
  sockets.push(socket);
});

server.on('error', err => {
  console.log('err : ' + err);
});

server.listen(5000, () => {
  console.log('opened server on', server.address());
});