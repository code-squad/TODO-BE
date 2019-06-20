const net = require('net');
const ora = require('ora');
const AuthManager = require('./auth.js');

const Game = require('./gameUtils');
const game = new Game();

let spinner;

const client = net.connect({port: 5000}, () => {
  const req ={}
  req.method = 'init'
  client.write(JSON.stringify(req));
});

const authManager = new AuthManager();


client.on('data', async data => {
  try{
    const res = await JSON.parse(data);
    let req = {}
    switch(res.method) {
      case 'init':
        console.log('=======================Indian Poker=======================')
      case 'newClient':
        req = await authManager.userIn(res);
        client.write(`${JSON.stringify(req)}`);
        break;
      case 'loggedIn':
        spinner = ora(res.message);
        spinner.start();
        break;
      case 'getInGame':
        spinner.stop();
        console.log(res.message);
        break;
      case 'inGame':
        const action = res.action;
        process.emit('inGame', action, res);
        break;
      default:
        console.log('Unhandled method');
        console.log(res.method);
        break;
    }
    return;
  } catch (e) {
    console.log(e)
  }
});

process.on('inGame', async (action, res) => {
  let req = {};
  switch(action){
    case 'newRound':
      var { roundNo, school, myCoin, showCards, gameId } = res;
      console.log(`====================================================`);
      console.log(`Round ${ roundNo } 시작합니다!`);
      console.log(`상대의 카드는 ${ showCards } 입니다.`);
      console.log(`현재 판돈은 ${school}이고, 잔여 coin은 ${myCoin}입니다.`);
      console.log(`====================================================`);
      return;
    case 'yourTurn':
      var { school, myCoin, coinToCall } = res;
      console.log(`현재 판돈 : ${school}`);
      console.log(`보유 코인 : ${myCoin}`);
      console.log(`call에 필요한 coin : ${coinToCall}`);
      console.log(`fold는 '1'입력`);
      console.log(`raise는 '2'입력`);
      if (school === 2){
        console.log(`call은 '3'입력`);
      }
      req.gameId = gameId;
      let reqData = await game.myTurn(school, myCoin, coinToCall);
      Object.assign(req, reqData);
      client.write(`${JSON.stringify(req)}`);
      return;

    default:
      console.log('unhandled action====');
      console.log(action, res);
      console.log('====================');
      return;
  }
})

client.on('end', () => {
  console.log('연결이 끊어졌습니다.');
  console.log('client를 종료합니다.');
  process.exit();
});
