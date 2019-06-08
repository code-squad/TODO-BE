const rl = require('readline');
const chalk = require('chalk');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const Utils = require('./utils');
const net = require('net');

// json 파일 db 데이터 초기화
db.defaults({users: []}).write();

const inputReadline = rl.createInterface({
    input : process.stdin,
    output: process.stdout,
});

const utils = new Utils(db, inputReadline);

const socket =net.connect(52274,'127.0.0.1', function () {
    console.log('Client on');
});

class TodoApp {
    constructor(socket){
        this.socket = socket
    }

    getUserData(){
        return new Promise(resolve => {
            socket.setEncoding('utf8');
            socket.on('data', function (data) {
                console.log(JSON.parse(data));
                resolve(JSON.parse(data));
            })
        })
    }

    init() {
        return new Promise(resolve => {
            inputReadline.question('회원인가요? (yes/no)', async answer => {
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
            inputReadline.question('아이디를 입력하세요', async (id) => {
                this.socket.write(`register$id$${id}`); // 서버로 아이디 전송
                const duplicatedID = await this.getUserData();
                this.socket.removeAllListeners();
                if (duplicatedID) {
                    utils.errorLog('이미 사용중인 아이디 입니다.');
                    resolve(this.register());
                } else {
                    return inputReadline.question('비밀번호를 입력하세요', async (pw) => {
                        this.socket.write(`register$pw$${id}&${pw}`); // 서버로 아이디, 비밀번호 전송
                        const register_success = await this.getUserData();
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
            inputReadline.question('아이디를 입력하세요', (id) => {
                console.log(id);
                return inputReadline.question('비밀번호를 입력하세요', async (pw) => {
                    console.log(pw);
                    this.socket.write(`login$id_pw$${id}&${pw}`); // 서버로 아이디, 비밀번호 전송
                    const {login_success, login_user }= await this.getUserData();
                    this.socket.removeAllListeners();
                    if (login_success) {
                        resolve(login_user);
                    } else {
                        utils.errorLog('입력한 정보가 올바르지 않습니다.');
                        resolve(this.login());
                    }
                });
            });
        })
    }

    mainExecutor(login_user) {
        inputReadline.setPrompt('명령어를 입력하세요(도움말은 help / 종료하려면 q를 누르세요): ');
        inputReadline.prompt();
        inputReadline.on('line', function (line) {

            if (line === "q") inputReadline.close();
            todoList.checkCommands(line, login_user);

        })

            .on('close', function () {
                console.log('프로그램이 종료되었습니다.');
                process.exit();
            });
    }

    checkCommands(userInput, login_user) {
        const splitUserInput = userInput.split(' ');
        if (userInput.split(' ').length < 1 || userInput.split(' ').length > 2) {
            console.log("입력값을 확인해주세요");
            inputReadline.setPrompt('명령어를 입력하세요(종료하려면 q를 누르세요): ');
            inputReadline.prompt();
            return;
        }

        const [command, commandElement] = splitUserInput;
        switch (command) {
            case 'help':
                this.usage();
                break;
            case 'new':
                this.newTodo(login_user);
                break;
            case 'get':
                this.getTodos(login_user);
                break;
            case 'complete':
                this.completeTodo(commandElement, login_user);
                break;
            case 'delete':
                this.deleteTodo(commandElement, login_user);
                break;
            case 'update':
                this.updateTodo(commandElement, login_user);
                break;
            default:
                utils.errorLog('invalid command passed');
                this.usage();
        }
    }

    // usage represents the help guide
    usage() {
        const usageText = `
    TODO helps you manage you todo tasks.
    usage: type 'command'
    commands can be:
    new:                   used to create a new todo
    get:                   used to retrieve your todos
    complete + item No.:   used to mark a todo as complete / undo complete
    update + item No.:     used to update the todo title
    help:                  used to print the usage guide
  `;
        console.log(usageText)
    }

    newTodo(login_user) {
        const q = chalk.blue('Type in your todo\n');
        utils.prompt(q).then(todo => {
            const newID = Math.floor(Math.random() * 10000) + 1;
            const ID_fromDB = db.get('users').find({'id': login_user.id}).value();
            const idx = db.get('users').value().indexOf(ID_fromDB);
            console.log((db.get(`users[${idx}]`).value()));

            db.get(`users[${idx}].todos`).push({
                todo_id : newID,
                title   : todo,
                complete: false,
            }).write();
        });
    }

    getTodos(login_user) {
        const todos = db.get('users').find({'id': login_user.id}).value().todos;
        let index = 1;
        if (todos.length === 0) {
            return utils.errorLog('비어있는 리스트 입니다. 새로운 todo를 추가해주세요')
        }
        console.log(chalk.cyan(`<<<< ${login_user.id}의 TODO LIST >>>>`));
        todos.forEach(todo => {
            let todoText = `${index++}. ${todo.title}`;
            if (todo.complete) {
                todoText += ' ✔ ️';
                console.log(chalk.green(todoText))
            } else {
                console.log(chalk.yellow(todoText))
            }
        });
    }

    completeTodo(itemToComplete,login_user) {
        const n = Number(itemToComplete);
        // check if the value is a number
        if (isNaN(n)) {
            return utils.errorLog("please provide a valid number for complete command");
        }

        const ID_fromDB = db.get('users').find({'id': login_user.id}).value();
        const idx = db.get('users').value().indexOf(ID_fromDB);

        // check if correct length of values has been passed
        let todosLength = db.get(`users[${idx}].todos`).value().length;
        if (n > todosLength) {
            return utils.errorLog("invalid number passed for complete command.");
        }

        // update the todo item marked as complete
        const complete_state = db.get(`users[${idx}].todos[${n-1}].complete`).value();
        if (complete_state === true){
            const q = chalk.blue('Do you want to uncheck this item from completed list?(yes/no)\n');
            utils.prompt(q).then((answer)=>{
                if (answer ==='yes'){
                    db.set(`users[${idx}].todos[${n-1}].complete`, false).write();
                    const undo_complete_todo = db.get(`users[${idx}].todos[${n-1}].title`).value();
                    return console.log(chalk.yellow(`${undo_complete_todo} is unchecked from a completed list`));
                } else if(answer ==='no'){
                    return console.log('명령어를 입력하세요(도움말은 help / 종료하려면 q를 누르세요):');
                } else {
                    utils.errorLog('올바른 입력값이 아닙니다');
                    return console.log('명령어를 입력하세요(도움말은 help / 종료하려면 q를 누르세요):');
                }
            })
        } else {
            db.set(`users[${idx}].todos[${n-1}].complete`, true).write();
            const complete_todo = db.get(`users[${idx}].todos[${n-1}].title`).value();
            console.log(chalk.green(`${complete_todo} is checked as complete`));
        }
    }

    deleteTodo(itemToDelete,login_user) {
        const n = Number(itemToDelete);
        if (isNaN(n)) {
            return utils.errorLog("please provide a valid number for complete command");
        }

        const ID_fromDB = db.get('users').find({'id': login_user.id}).value();
        const idx = db.get('users').value().indexOf(ID_fromDB);

        // check if correct length of values has been passed
        let todosLength = db.get(`users[${idx}].todos`).value().length;
        if (n > todosLength) {
            return utils.errorLog("invalid number passed for complete command.");
        }

        // delete the item
        const deletedItem = db.get(`users[${idx}].todos[${n-1}].title`).value();
        const deletedItemID = db.get(`users[${idx}].todos[${n-1}].todo_id`).value();
        db.get(`users[${idx}].todos`).remove({todo_id: deletedItemID}).write();
        console.log(`${deletedItem} is deleted`)
    }

    updateTodo(itemToUpdate,login_user) {
        const n = Number(itemToUpdate);

        if (isNaN(n)) {
            return utils.errorLog("please provide a valid number for complete command");

        }

        const ID_fromDB = db.get('users').find({'id': login_user.id}).value();
        const idx = db.get('users').value().indexOf(ID_fromDB);

        // check if correct length of values has been passed
        let todosLength = db.get(`users[${idx}].todos`).value().length;
        if (n > todosLength) {
            return utils.errorLog("invalid number passed for complete command.");
        }

        // update the item
        const updatedItemTitle = db.get(`users[${idx}].todos[${n - 1}.title]`).value();
        const q = chalk.blue('Type the title to update\n');
        utils.prompt(q).then(UpdatedTitle => {
             db.get(`users[${idx}].todos`).find({title: `${updatedItemTitle}`}).assign({title: UpdatedTitle}).write();
             console.log(chalk.magenta(`Title is updated: ${updatedItemTitle} => ${UpdatedTitle}`));
        });
    }
}

const todoList = new TodoApp(socket);

async function asyncTest() {
    const login_user = await todoList.init();
    console.log(`------------- 로그인 되었습니다. -------------`);
    console.log(`<<< ${login_user.id}님, TODO APP에 오신 걸 환경합니다! >>>`);
    todoList.mainExecutor(login_user);
}

asyncTest();