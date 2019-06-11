const net = require('net');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const UserManager = require('./user_manager');
const DataHandler = require('./data_handler');

// json 파일 db 데이터 초기화
db.defaults({users: []}).write();

const dataHandler = new DataHandler(db);
const userManager = new UserManager(db, dataHandler);

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

            case 'completeTodo':
                const complete_todo = dataHandler.completeTodo(value);
                socket.write(`${JSON.stringify(complete_todo)}`);
                break;

            case 'undo_complete_todo':
                const undo_complete_todo = dataHandler.undo_completeTodo(value);
                socket.write(`${JSON.stringify(undo_complete_todo)}`);
                break;

            case 'idxOfUser':
                const idxOfUser = dataHandler.getIdxOfUser(value);
                socket.write(`${JSON.stringify(idxOfUser)}`);
                break;

            case 'todosLength':
                const todosLength = dataHandler.checkTodoLength(value);
                socket.write(`${JSON.stringify(todosLength)}`);
                break;

            case 'complete_state':
                const complete_state = dataHandler.getCompleteState(value);
                socket.write(`${JSON.stringify(complete_state)}`);
                break;
        }
    })
}).listen(52274, function () {
    console.log('Server on');
});



