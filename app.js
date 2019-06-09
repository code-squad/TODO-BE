const rl = require('readline');
const chalk = require('chalk');
const Utils = require('./client/utils');
const net = require('net');
const TodoApp = require('./client/todo_app');

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
                    resolve(this.register());
                } else if (answer === 'yes') {
                    resolve(this.login());
                } else {
                    utils.errorLog('입력값이 올바르지 않습니다. yes / no 중 하나를 입력해주세요');
                    resolve(this.init());
                }
            });
        });
    }

    register() {
        return new Promise(resolve => {
            this.inputReadline.question('아이디를 입력하세요', async (id) => {
                this.socket.write(`register$id$${id}`); // 서버로 아이디 전송
                const duplicatedID = await utils.getUserData();
                this.socket.removeAllListeners();
                if (duplicatedID) {
                    utils.errorLog('이미 사용중인 아이디 입니다.');
                    resolve(this.register());
                } else {
                    return this.inputReadline.question('비밀번호를 입력하세요', async (pw) => {
                        this.socket.write(`register$pw$${id}&${pw}`); // 서버로 아이디, 비밀번호 전송
                        const register_success = await utils.getUserData();
                        this.socket.removeAllListeners();
                        if (register_success) {
                            console.log('------------- 회원가입이 완료됐습니다. -------------');
                            console.log('------------- 로그인 창으로 이동합니다. ------------');
                            resolve(this.login());
                        } else {
                            utils.errorLog('입력한 정보가 올바르지 않습니다.');
                            resolve(this.register());
                        }
                    });
                }
            })
        })
    }

    login() {
        return new Promise(resolve => {
            this.inputReadline.question('아이디를 입력하세요', (id) => {
                console.log(id);
                return this.inputReadline.question('비밀번호를 입력하세요', async (pw) => {
                    console.log(pw);
                    this.socket.write(`login$id_pw$${id}&${pw}`); // 서버로 아이디, 비밀번호 전송
                    const {login_success, login_user_id} = await utils.getUserData();
                    this.socket.removeAllListeners();
                    if (login_success) {
                        resolve(login_user_id);
                    } else {
                        utils.errorLog('입력한 정보가 올바르지 않습니다.');
                        resolve(this.login());
                    }
                });
            });
        })
    }

    mainExecutor(login_user_id) {
        this.inputReadline.setPrompt('명령어를 입력하세요(도움말은 help / 종료하려면 q를 누르세요): ');
        this.inputReadline.prompt();
        this.inputReadline.on('line', function (line) {

            if (line === "q") this.inputReadline.close();
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
    console.log(`<<< ${login_user_id}님, TODO APP에 오신 걸 환경합니다! >>>`);
    app.mainExecutor(login_user_id);
}

asyncTest();