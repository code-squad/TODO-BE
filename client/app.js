const net = require('net');
const ora = require('ora');
const AuthManager = require('./auth.js');

const sleep = msec => new Promise(resolve => setTimeout(resolve, msec))

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

    if (res.method === 'newClient') {
      req = await authManager.userIn(res);
      client.write(`${JSON.stringify(req)}`);
      return;
    }
    const spinner = ora(res.message)
    if (res.method === 'loggedIn') {
      spinner.start();
    }
    if (res.method === 'getInGame') {
      spinner.stop();
      console.log(res.message);
    }
    return;
  } catch (e) {
    console.log(e)
  }
});

client.on('end', () => {
  console.log('연결이 끊어졌습니다.');
});
