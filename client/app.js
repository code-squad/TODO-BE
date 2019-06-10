const net = require('net');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const input = (query) => {
  return new Promise((resolve, reject) => {
    rl.question(query, (answer) => {
      resolve(answer)
    })
  })
}
const client = net.connect({port: 5000}, () => {
  client.write(`{"new client" : true}`, () => {

  });
});

client.on('data', async data => {
  const response = JSON.parse(data);
  const request = {}
  let username = '';
  let password = '';
  if (!response.loggedIn) {
    console.log('로그인하세요');
    username = await input('username >> ');
    password = await input('password >> ');
    // hash로 암호화 시켜서 보내줄것.
    request.username = username;
    request.password = password;

    await client.write(`${JSON.stringify(request)}`);
    return;
  }
  console.log(`${data}`);
  const userinput  = await input('입력 >> ');
  request.userinput = userinput
  client.write(`${JSON.stringify(request)}`, () => {
  });
  return;
});

client.on('end', () => {
  console.log('연결이 끊어졌습니다.');
});
