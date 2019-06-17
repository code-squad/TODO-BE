const crypto = require('crypto');
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

class AuthManager {
  async userIn (res) {
    let req = {};
    let username = '';
    let password = '';
    let passwordConfirm = '';
    if (res.message) {
      console.log(res.message);
    }
    console.log('로그인 or 회원가입을 해주세요!');
    console.log('===========================');
    console.log(`로그인하려면 '1'을 입력`);
    console.log(`회원가입하려면 '2'를 입력`);
    console.log('===========================');
    while (true) {
      let selection = await input('1 또는 2 입력 >> ');
      if(selection !== '1' && selection !== '2'){
        continue;
      }
      username = await input('username >> ');
      password = await input('password >> ');
      if (selection === '1') {
        req.method = 'logIn';
      } else {
        passwordConfirm = await input('password confirm >> ');
        if (password !== passwordConfirm) {
          console.log('비밀번호 확인이 일치하지 않습니다.');
          continue;
        }
        req.method = 'signIn';
      }
      req.name = username;
      req.password = crypto.createHash('sha512')
        .update(password)
        .digest('base64');
      return req;
    }
  }
}

module.exports = AuthManager;