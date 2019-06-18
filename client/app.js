const net = require('net');
const ora = require('ora');
const AuthManager = require('./auth.js');


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

process.on('inGame', (action, res) => {
  switch(action){
    case 'newRound':
      const { roundNo, school, myCoin, showCards } = res;
      console.log(res);
      console.log(`====================================================`);
      console.log(`Round ${ roundNo } 시작합니다!`);
      console.log(`상대의 카드는 ${ showCards } 입니다.`);
      console.log(`현재 판돈은 ${school}이고, 잔여 coin은 ${myCoin}입니다.`);
      console.log(`====================================================`);
      return;
    case 'yourTurn':
      
      return;
  }
})

client.on('end', () => {
  console.log('연결이 끊어졌습니다.');
});
