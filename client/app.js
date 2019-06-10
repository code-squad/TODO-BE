const net = require('net');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const crypto = require('crypto');
const hash = crypto.createHash('sha256');




const input = (query) => {
  return new Promise((resolve, reject) => {
    rl.question(query, (answer) => {
      resolve(answer)
    })
  })
}

const client = net.connect({port: 5000}, () => {
  client.write(`{"method" : "init"}`, () => {

  });
});

client.on('data', async data => {
  try{
    const res = await JSON.parse(data);
    const req = {}

    if (res.method === 'newClient') {
      let username = '';
      let password = '';
      console.log('로그인 or 회원가입을 해주세요!');
      console.log('===========================');
      console.log(`로그인하려면 '1'을 입력`);
      console.log(`회원가입하려면 '2'를 입력`);
      console.log('===========================');
      while (true){
        let selection = await input('1 또는 2 입력 >> ');
        if(selection !== '1' && selection !== '2'){
          continue;
        }
        if (selection === '1') {
          username = await input('username >> ');
          password = await input('password >> ');
          req.method = 'logIn';
          
        } else if (selection === '2') {
          username = await input('username >> ');
          password = await input('password >> ');
          passwordConfirm = await input('password confirm >> ');
          if (password !== passwordConfirm) {
            console.log('비밀번호 확인이 일치하지 않습니다.');
            continue;
          }
          req.method = 'signIn';
        }
        req.username = username;
        hash.update(password);
        req.password = hash.digest('hex'); 
        await client.write(`${JSON.stringify(req)}`);
        return;
      }
        
    }


    console.log(`${data}`);
    const userinput  = await input('입력 >> ');
    req.userinput = userinput
    client.write(`${JSON.stringify(req)}`, () => {
    });
    return;
  } catch (e) {
    console.log(e)
  }
});

client.on('end', () => {
  console.log('연결이 끊어졌습니다.');
});
