const rl = require('readline');
const chalk = require('chalk');
const net = require('net');
const Utils = require('./client/utils');
const TodoApp = require('./client/todo_app');
const login = require('./login');
const register = require('./register');

const inputReadline = rl.createInterface({
    input : process.stdin,
    output: process.stdout,
});

const socket = net.connect(52274, '127.0.0.1', function () {
    console.log('Client on');
});

const utils = new Utils(inputReadline, socket, chalk);
const todoApp = new TodoApp(socket, utils, chalk);

class App {
    constructor(socket, inputReadline) {
        this.socket = socket;
        this.inputReadline = inputReadline;
    }

    init() {
        return new Promise(resolve => {
            this.inputReadline.question('회원인가요? (yes/no)', async answer => {
                if (answer === 'no') {
                    resolve(register(this.inputReadline, this.socket, utils));
                } else if (answer === 'yes') {
                    resolve(login(this.inputReadline, this.socket, utils));
                } else {
                    utils.errorLog('입력값이 올바르지 않습니다. yes / no 중 하나를 입력해주세요');
                    resolve(this.init());
                }
            });
        });
    }

    mainExecutor(login_user_id) {
        this.inputReadline.setPrompt('명령어를 입력하세요(도움말은 help / 종료하려면 q를 누르세요): ');
        this.inputReadline.prompt();
        this.inputReadline.on('line', function (line) {

            if (line === "q") inputReadline.close(); // this 를 붙이면 왜 오류가 날까..?
            app.checkCommands(line, login_user_id);

        })

            .on('close', function () {
                console.log('프로그램이 종료되었습니다.');
                process.exit();
            });
    }

    checkCommands(userInput, login_user_id) {
        const splitUserInput = userInput.split(' ');
        if (userInput.split(' ').length < 1 || userInput.split(' ').length > 2) {
            console.log("입력값을 확인해주세요");
            this.inputReadline.setPrompt('명령어를 입력하세요(종료하려면 q를 누르세요): ');
            this.inputReadline.prompt();
            return;
        }

        const [command, commandElement] = splitUserInput;
        switch (command) {
            case 'help':
                todoApp.usage();
                break;
            case 'new':
                todoApp.newTodo(login_user_id);
                break;
            case 'get':
                todoApp.getTodo(login_user_id);
                break;
            case 'complete':
                todoApp.completeTodo(commandElement, login_user_id);
                break;
            case 'delete':
                todoApp.deleteTodo(commandElement, login_user_id);
                break;
            case 'update':
                todoApp.updateTodo(commandElement, login_user_id);
                break;
            default:
                utils.errorLog('invalid command passed');
                todoApp.usage();
        }
    }

}

const app = new App(socket, inputReadline);

async function asyncTest() {
    const login_user_id = await app.init();
    console.log(`------------- 로그인 되었습니다. -------------`);
    console.log(`<<< ${login_user_id}님, TODO APP에 오신 걸 환영합니다! >>>`);
    app.mainExecutor(login_user_id);
}

asyncTest();