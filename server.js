const rl = require('readline');
const net = require('net');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const Utils = require('./utils');
const UserManager = require('./user_manager');
const DataHandler = require('./data_handler');

const inputReadline = rl.createInterface({
    input : process.stdin,
    output: process.stdout,
});

// json 파일 db 데이터 초기화
db.defaults({users: []}).write();

const utils = new Utils(db, inputReadline);
const userManager = new UserManager(db, utils);
const dataHandler = new DataHandler(db);

net.createServer(function (socket) {
    socket.setEncoding('utf8');
    socket.on('data', function (data) {
        console.log('Received data: ' + data);
        const {command, keyword, value} = userManager.parseData(data);

        switch (command) {
            case 'register':
                socket.write(`${JSON.stringify(userManager.register(keyword, value))}`);
                break;

            case 'login':
                socket.write(`${JSON.stringify(userManager.login(value))}`);
                break;

            case 'getTodo':
                const todo_list = dataHandler.getTodo(value);
                socket.write(`${JSON.stringify(todo_list)}`);
                break;

            case 'newTodo':
                const new_todo = dataHandler.newTodo(value);
                socket.write(`${JSON.stringify(new_todo)}`);
                break;

            case 'deleteTodo':
                const deleted_todo = dataHandler.deleteTodo(value);
                socket.write(`${JSON.stringify(deleted_todo)}`);
                break;

            case 'updateTodo':
                const updated_todo = dataHandler.updateTodo(value);
                socket.write(`${JSON.stringify(updated_todo)}`);
                break;

            case 'idxOfUser':
                const idxOfUser = dataHandler.getIdxOfUser(value);
                socket.write(`${JSON.stringify(idxOfUser)}`);
                break;

            case 'todosLength':
            const todosLength = dataHandler.checkTodoLength(value);
            socket.write(`${JSON.stringify(todosLength)}`);
            break;
        }
    })
}).listen(52274, function () {
    console.log('Server on');
});



