const net = require('net');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const Utils = require('./utils');
const User = require('./user_manager');
const rl = require('readline');

const inputReadline = rl.createInterface({
    input : process.stdin,
    output: process.stdout,
});

// json 파일 db 데이터 초기화
db.defaults({users: []}).write();

const utils = new Utils(db, inputReadline);



net.createServer(function (socket) {
    socket.setEncoding('utf8');
    socket.on('data', function (data) {
        console.log('Received data: ' + data);
        const {command, keyword, value} = userManager.parseData(data);

        if (command === 'login') {
            const answer = userManager.login(value);
            socket.write(`${JSON.stringify(answer)}`);

        } else if (command === 'register') {
            const answer = userManager.register(keyword, value);
            socket.write(`${JSON.stringify(answer)}`);
        }
    })
}).listen(52274, function () {
    console.log('Server on');
});


class UserManager {
    register(keyword, value) {
        if (keyword === 'id') {
            return !!utils.checkDuplicatedID(value);
        } else if (keyword === 'pw') {
            const [id, pw] = value.split('&');
            db.get('users').push({'id': id, 'info': {id: id, pw: pw}, todos: []}).write();
            return !!utils.checkID_PW(id, pw);
        }
    }

    login(value) {
        const [id, pw] = value.split('&');
        if (utils.checkID_PW(id, pw)) {
            const login_user = new User(db, id);
            return {login_success : true, login_user : login_user};
        } else {
            return false
        }

    }

    parseData(data) {
        const parsedData = data.split('$');
        const command = parsedData[0];
        const keyword = parsedData[1];
        const value = parsedData[2];
        console.log(parsedData);
        return {command, keyword, value};
    }

}

const userManager = new UserManager();




