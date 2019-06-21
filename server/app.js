const net = require('net');
const UserManager = require('./user.js');
const SessionManager = require('./session.js');
const Game = require('./game.js');
const EventEmitter = require('events');
const util = require('util');

function GameEmitter() {
  EventEmitter.call(this);
}
util.inherits(GameEmitter, EventEmitter);
const gameEmitter = new GameEmitter();

const PLAYER_1 = 0;
const PLAYER_2 = 1;
const sockets = [];
const session = new SessionManager();
const games = [];

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec))

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
        socWrite(socket, res);
        return;
      case 'signIn':
        res = await userManager.signIn(req);
        socWrite(socket, res);
        return;
      case 'logIn':
        const user = await userManager.logIn(req);
        if (!user || session.checkInvalidUser(user.name)) {
          console.log(user, session.checkInvalidUser(user.name))
          res.method = 'newClient';
          res.message = '유효하지 않은 logIn입니다.';
          socWrite(socket, res);
          return;
        }
        session.create(socket.remotePort, user.name);
        console.log(session.list);
        res.method = 'loggedIn';
        res.message = '매칭상대를 찾는 중...!';
        socWrite(socket, res);

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
          socWrite(p1socket, res);
          socWrite(p2socket, res);
          game.init();
          await sleep(1000);
          const { p1res, p2res } = await game.startRound();

          await socWrite(p1socket, p1res);
          await socWrite(p2socket, p2res);

          console.log(game.cards[0], game.cards[1]);
          await sleep(1000);

          const { socket, sendRes } = game.yourTurn();
          socket.write(`${JSON.stringify(sendRes)}`);
          return;
        }
        return;
      case 'inGame':
        console.log('before emit', req);
        gameEmitter.emit('inGame', req);
        return;
    }
  });
  socket.on('close', () => {
    const socIdx = sockets.indexOf(socket);
    const gameIdx = games.findIndex(tmpGame => socket in tmpGame.socs);
    games.splice(gameIdx, 1);
    sockets.splice(socIdx, 1);
    session.delete(socket.remotePort);

    console.log(`${socket.remotePort} client disconnected`);
    console.log(session.list);
    console.log(sockets.map(soc => soc.remotePort));
    console.log('games', games);
  });
});
gameEmitter.on('inGame', async req => {
  const { action, gameId } = req;
  console.log('after emit', req);
  const game = await games.find(tmpGame => tmpGame.id === gameId);
  
  switch(action) {
    case 'fold':
      var { p1end, p2end } = await game.fold();
      await socWrite(game.socs[PLAYER_1], p1end);
      await socWrite(game.socs[PLAYER_2], p2end);
      
      await sleep(1000);

      var { p1res, p2res } = await game.startRound();
      await socWrite(game.socs[PLAYER_1], p1res);
      await socWrite(game.socs[PLAYER_2], p2res);
      if (games.findIndex(tmpGame => socket in tmpGame.socs) === -1) {
        return;
      }
      
      await sleep(1000);
      var { socket, sendRes } = await game.yourTurn();
      await socWrite(socket, sendRes);
      return;
    case 'raise':
      const throwCoin = req.throwCoin;
      const { p1msg, p2msg } = await game.raise(throwCoin);
      await socWrite(game.socs[PLAYER_1], p1msg);
      await socWrite(game.socs[PLAYER_2], p2msg);
      await sleep(1000);
      var { socket, sendRes } = await game.yourTurn();
      await socWrite(socket, sendRes);
      return;

    case 'call':
      var { p1end, p2end } = await game.call();
      await socWrite(game.socs[PLAYER_1], p1end);
      await socWrite(game.socs[PLAYER_2], p2end);
      
      await sleep(1000);

      var { p1res, p2res } = await game.startRound();
      await socWrite(game.socs[PLAYER_1], p1res);
      await socWrite(game.socs[PLAYER_2], p2res);
      if (games.findIndex(tmpGame => socket in tmpGame.socs) === -1) {
        return;
      }

      await sleep(1000);

      var { socket, sendRes } = await game.yourTurn();
      await socWrite(socket, sendRes);

      return;
    
    default:
      console.log('Unhandled action in inGame method');
      console.log(req);
  }
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

const socWrite = async (soc, res) => {
  await soc.write(`${JSON.stringify(res)}`);
};