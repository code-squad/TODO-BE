const net = require('net');
const ora = require('ora');
const AuthManager = require('./auth.js');

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec))

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
        console.log(res.message);
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

client.on('end', () => {
  console.log('연결이 끊어졌습니다.');
});
