const rl = require('readline');
const chalk = require('chalk');
const net = require('net');
const Utils = require('./client/utils');
const TodoCommand = require('./client/command');
const Todo = require('./client/todo');

const inputReadline = rl.createInterface({
    input : process.stdin,
    output: process.stdout,
});

const socket = net.connect(52274, '127.0.0.1', function () {
    console.log('Client on');
});

const utils = new Utils(inputReadline, socket, chalk);
const todoCommand = new TodoCommand(socket, utils, chalk);
const todo = new Todo(socket, inputReadline, utils, todoCommand);

async function asyncTest() {
    const login_user_id = await todo.init();
    console.log(`------------- 로그인 되었습니다. -------------`);
    console.log(`<<< ${login_user_id}님, TODO APP에 오신 걸 환영합니다! >>>`);
    todo.mainExecutor(login_user_id);
}

asyncTest();