const rl = require('readline');
const chalk = require('chalk');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const Utils = require('./utils');
const User = require('./user_manager');

// json 파일 db 데이터 초기화
db.defaults({todos: [], users: []}).write();

const inputReadline = rl.createInterface({
    input : process.stdin,
    output: process.stdout,
});

const utils = new Utils(db, inputReadline);

class TodoApp {
    init() {
        return new Promise(resolve => {
            inputReadline.question('회원인가요? (yes/no)', answer => {
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
            inputReadline.question('아이디를 입력하세요', (id) => {
                if (utils.checkDuplicatedID(id)) {
                    utils.errorLog('이미 사용중인 아이디 입니다.');
                    resolve(this.register());
                } else {
                    return inputReadline.question('비밀번호를 입력하세요', (pw) => {
                        db.get('users').push({'id': id, 'info': {id: id, pw: pw}, todos: []}).write();
                        if (utils.checkID_PW(id, pw)) {
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
                return inputReadline.question('비밀번호를 입력하세요', (pw) => {
                    console.log(pw);
                    if (utils.checkID_PW(id, pw)) {
                        const user = new User(db, id);
                        resolve(user);
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
    complete + item No.:   used to mark a todo as complete
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

            // db.get('users').find({'id': login_user.id}).assign({
            //     todos: [{
            //         todo_id : newID,
            //         title   : todo,
            //         complete: false,
            //     }]
            //
            // }).write();

            db.get('todos')
                .push({
                    id      : newID,
                    title   : todo,
                    complete: false,
                })
                .write();
        });
    }

    getTodos(login_user) {
        const todos = db.get('users').find({'id': login_user.id}).value().todos;
        let index = 1;
        if (todos.length === 0) {
            return utils.errorLog('비어있는 리스트 입니다. 새로운 todo를 추가해주세요')
        }
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

    completeTodo(itemToComplete) {
        const n = Number(itemToComplete);
        // check if the value is a number
        if (isNaN(n)) {
            utils.errorLog("please provide a valid number for complete command");
            return
        }

        // check if correct length of values has been passed
        let todosLength = db.get('todos').value().length;
        if (n > todosLength) {
            utils.errorLog("invalid number passed for complete command.");
            return
        }

        // update the todo item marked as complete
        db.set(`todos[${n - 1}].complete`, true).write();
        const complete_todo = db.get(`todos[${n - 1}].title`).value();
        console.log(`${complete_todo} is checked as complete`)
    }

    deleteTodo(itemToDelete) {
        const n = Number(itemToDelete);
        if (isNaN(n)) {
            utils.errorLog("please provide a valid number for complete command");
            return
        }

        // check if correct length of values has been passed
        let todosLength = db.get('todos').value().length;
        if (n > todosLength) {
            utils.errorLog("invalid number passed for complete command.");
            return
        }

        // delete the item
        const deletedItem = db.get(`todos[${n - 1}].title`).value();
        const deletedItemID = db.get(`todos[${n - 1}].id`).value();
        db.get(`todos`).remove({id: deletedItemID}).write();
        console.log(`${deletedItem} is deleted`)
    }

    updateTodo(itemToUpdate) {
        const n = Number(itemToUpdate);

        if (isNaN(n)) {
            utils.errorLog("please provide a valid number for complete command");
            return
        }

        // check if correct length of values has been passed
        let todosLength = db.get('todos').value().length;
        if (n > todosLength) {
            utils.errorLog("invalid number passed for complete command.");
            return
        }

        // update the item
        const updatedItemTitle = db.get(`todos[${n - 1}.title]`).value();
        const q = chalk.blue('Type the title to update\n');
        utils.prompt(q).then(UpdatedTitle => {
            console.log(db.get('todos').find({title: `${updatedItemTitle}`}).assign({title: UpdatedTitle}).write());
        });
    }
}

const todoList = new TodoApp();

async function asyncTest() {
    const login_user = await todoList.init();
    console.log(`------------- 로그인 되었습니다. -------------`);
    console.log(`<<< ${login_user.id}님, TODO APP에 오신 걸 환경합니다! >>>`);
    todoList.mainExecutor(login_user);
}

asyncTest();