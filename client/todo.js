const login = require('./login');
const register = require('./register');

class Todo {
    constructor(socket, inputReadline, utils, todoCommand) {
        this.socket = socket;
        this.inputReadline = inputReadline;
        this.utils = utils;
        this.todoCommand = todoCommand;
    }

    init() {
        return new Promise(resolve => {
            this.inputReadline.question('회원인가요? (yes/no)', async answer => {
                if (answer === 'no') {
                    resolve(register(this.inputReadline, this.socket, this.utils));
                } else if (answer === 'yes') {
                    resolve(login(this.inputReadline, this.socket, this.utils));
                } else {
                    this.utils.errorLog('입력값이 올바르지 않습니다. yes / no 중 하나를 입력해주세요');
                    resolve(this.init());
                }
            });
        });
    }

    mainExecutor(login_user_id) {
        this.inputReadline.setPrompt('명령어를 입력하세요(도움말은 help / 종료하려면 q를 누르세요): ');
        this.inputReadline.prompt();
        this.inputReadline.on('line',  (line) => {

            if (line === "q") this.inputReadline.close();
            this.checkCommands(line, login_user_id);

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
                this.todoCommand.usage();
                break;
            case 'new':
                this.todoCommand.newTodo(login_user_id);
                break;
            case 'get':
                this.todoCommand.getTodo(login_user_id);
                break;
            case 'complete':
                this.todoCommand.completeTodo(commandElement, login_user_id);
                break;
            case 'delete':
                this.todoCommand.deleteTodo(commandElement, login_user_id);
                break;
            case 'update':
                this.todoCommand.updateTodo(commandElement, login_user_id);
                break;
            default:
                this.utils.errorLog('invalid command passed');
                this.todoCommand.usage();
        }
    }

}

module.exports = Todo;