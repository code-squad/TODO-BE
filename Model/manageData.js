const fs = require('fs');

function doubleCheck(data, user) {
  let {
    name,
    id,
    password,
    phone,
    email
  } = user;

  for (let i = 0; i < data.length; i++) {
    if (data[i]['id'] === id && data[i]['phone'] && data[i]['email'] === email) {
      return true;
    }
  }
  return false;
}

async function storeSignupData(input_From_singup) {
  return new Promise((resolve, reject) => {
    fs.readFile('../Model/user.json', 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      }

      let userData = JSON.parse(data);

      let double_Check_Singup_Data = doubleCheck(userData['user'], input_From_singup);

      if (double_Check_Singup_Data) {
        resolve(false);
      } else {
        userData['user'].push(input_From_singup);
        fs.writeFile('../Model/user.json', JSON.stringify(userData), 'utf-8', (err) => {
          if (err) {
            reject(err);
          }

          resolve(true);
        });
      }
    });
  })
}

async function checkLoginData(login) {
  return new Promise((resolve, reject) => {
    fs.readFile('../Model/user.json', 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      }

      let userJSONdata = JSON.parse(data);
      let {
        id,
        password
      } = login;

      let userData = userJSONdata['user'];

      for (let i = 0; i < userData.length; i++) {
        if ((userData[i].id === id) && (userData[i].password === password)) {
          resolve(true);
        }
      }

      resolve(false);
    });
  });
}

async function storeUser() {
  return new Promise((resolve, reject) => {
    fs.readFile('../Model/user.json', 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      }

      let userJSONdata = JSON.parse(data);
      let userData = userJSONdata['user'];
      let user_Id_array = userData.map((data) => {
        return {
          userId: data.id
        }
      });

      resolve(user_Id_array);
    })
  })
}

async function storeTodoData(userTodoData, userId) {
  return new Promise((resolve, reject) => {
    fs.readFile('../Model/user.json', 'utf-8', (err, data) => {

      let userJSONdata = JSON.parse(data);
      let userInfo = userJSONdata['user'];
      let parse_userTodoData = JSON.parse(userTodoData);

      for (i = 0; i < userInfo.length; i++) {
        if (userInfo[i].id == userId) {
          userInfo[i].todolist = parse_userTodoData;
        }
      }
      fs.writeFile('../Model/user.json', JSON.stringify(userJSONdata), 'utf-8', (err) => {
        if (err) {
          reject(err);
        }

        resolve(true);
      });
    })
  });
}

async function getStoredTodoData(userId) {
  return new Promise((resolve, reject) => {
    fs.readFile('../Model/user.json', 'utf-8', (err, data) => {
      if (err) {
        reject(err);
      }

      let userJSONdata = JSON.parse(data);
      let userInfo = userJSONdata['user'];
      for (let i = 0; i < userInfo.length; i++) {
        if (userInfo[i].id === userId) {
          resolve(userInfo[i].todolist);
        }
      }
    })
  })
}

module.exports = {
  storeSignupData,
  checkLoginData,
  storeUser,
  storeTodoData,
  getStoredTodoData
}