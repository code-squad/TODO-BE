const net = require('net');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const Utils = require('./utils');
const UserManager = require('./user_manager');
const rl = require('readline');

const inputReadline = rl.createInterface({
    input : process.stdin,
    output: process.stdout,
});

// json 파일 db 데이터 초기화
db.defaults({users: []}).write();

const utils = new Utils(db, inputReadline);
const userManager = new UserManager(db,utils);

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



