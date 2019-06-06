const rl = require('readline');
const chalk = require('chalk');

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);

// json 파일 db 데이터 초기화
db.defaults({todos: [], users: []}).write();

const inputReadline = rl.createInterface({
    input : process.stdin,
    output: process.stdout,
});

class TodoApp{
    mainExecutor() {
        inputReadline.setPrompt('명령어를 입력하세요(도움말은 help / 종료하려면 q를 누르세요): ');
        inputReadline.prompt();
        inputReadline.on('line', function (line) {

            if (line === "q") inputReadline.close();
            todoList.checkCommands(line);

            if (line === 'no') {
                todoList.register()
            }
        })

            .on('close', function () {
                console.log('프로그램이 종료되었습니다.');
                process.exit();
            });
    }

    checkCommands(userInput) {
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
                this.newTodo();
                break;
            case 'get':
                this.getTodos();
                break;
            case 'complete':
                this.completeTodo(commandElement);
                break;
            case 'delete':
                this.deleteTodo(commandElement);
                break;
            case 'update':
                this.updateTodo(commandElement);
                break;
            default:
                this.errorLog('invalid command passed');
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

    newTodo() {
        const q = chalk.blue('Type in your todo\n');
        this.prompt(q).then(todo => {
            const newID = Math.floor(Math.random() * 10000) + 1;
            db.get('todos')
                .push({
                    id      : newID,
                    title   : todo,
                    complete: false,
                })
                .write();
        });
    }
}

const todoList = new TodoApp();
todoList.mainExecutor();