const net = require('net');
const UserManager = require('./user.js');
const SessionManager = require('./session.js');
const Game = require('./game.js');
const sockets = [];
const session = new SessionManager();
const games = [];

const server = net.createServer(socket => {
  console.dir(socket.remotePort);
  socket.on('data', async data => {
    const userManager = new UserManager();
    const req = JSON.parse(data)
    let res = {}
    console.log(req)
    switch (req.method) {
      case 'init':
        res.method = 'newClient'
        socket.write(`${JSON.stringify(res)}`);
        return;
      case 'signIn':
        res = await userManager.signIn(req);
        socket.write(`${JSON.stringify(res)}`);
        return;
      case 'logIn':
        const user = await userManager.logIn(req);
        if (!user || session.checkInvalidUser(user.name)) {
          console.log(user, session.checkInvalidUser(user.name))
          res.method = 'newClient';
          res.message = '유효하지 않은 logIn입니다.';
          socket.write(`${JSON.stringify(res)}`);
          return;
        }
        session.create(socket.remotePort, user.name);
        console.log(session.list);
        res.method = 'loggedIn';
        res.message = '매칭상대를 찾는 중...!';
        socket.write(`${JSON.stringify(res)}`);

        const queueingUsers = session.getQueueingUsers();
        if (queueingUsers.length === 2) {
          session.list.map(ses => ses.status = 'inGame');
          const p1socket = sockets.find(soc => soc.remotePort === queueingUsers[0].remotePort);
          const p2socket = sockets.find(soc => soc.remotePort === queueingUsers[1].remotePort);
          const game = new Game(
            queueingUsers[0],
            queueingUsers[1], 
            p1socket, 
            p2socket,
          );
          games.push(game);
          console.dir(game.players[0], game.players[1]);
          res.method = 'getInGame';
          res.message = '게임을 이제 시작합니다!';
          p1socket.write(`${JSON.stringify(res)}`);
          p2socket.write(`${JSON.stringify(res)}`);
          game.init();
          const { p1res, p2res } = game.startRound();
          p1socket.write(`${JSON.stringify(p1res)}`);
          p2socket.write(`${JSON.stringify(p2res)}`);
          
          console.log(game.cards[0], game.cards[1]);
          return;
        }
        return;
    }
  });

  socket.on('close', () => {
    const socIdx = sockets.indexOf(socket)
    sockets.splice(socIdx, 1);
    session.delete(socket.remotePort);

    console.log(`${socket.remotePort} client disconnected`);
    console.log(session.list);
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