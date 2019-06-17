const fs = require('fs');

class UserManager {
  async signIn(req) {
    const data = fs.readFileSync(`./data/user.json`)
    const users = JSON.parse(data);
    const user = {}
    let res = {};
    
    user.name = req.name;
    user.password = req.password;
    console.log('wtf is going on?')
    const checkValidUsername = users.filter(tmpuser => tmpuser.name === user.name);
    if (checkValidUsername.length !== 0) {
      console.log(checkValidUsername)
      res.method = 'newClient';
      res.message = '중복된 username입니다.'
      return res;
    }
    users.push(user)
    fs.writeFileSync(`./data/user.json`, JSON.stringify(users));
    res.method = 'newClient';
    res.message = '회원가입이 정상처리되었습니다.';
    
    return res;
  }
  async logIn(req) {
    const data = await fs.readFileSync(`./data/user.json`)
    const users = JSON.parse(data);
    const username = req.name;
    const password = req.password;
    let user = users.filter(tmpuser => tmpuser.name === username)[0];
    if (!user) {
      return false;
    }
    if (password === undefined){
      return false;
    }
    if (user.password !== password) {
      return false;
    }
    return user;
  }
}

module.exports = UserManager;

