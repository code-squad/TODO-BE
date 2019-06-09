class TodoApp {
    constructor(socket, utils, chalk) {
        this.socket = socket;
        this.utils = utils;
        this.chalk = chalk;
    }

    newTodo(login_user_id) {
        const q = this.chalk.blue('Type in your todo\n');

        this.utils.prompt(q).then(async todo => {
            this.socket.write(`newTodo$id$${login_user_id}&${todo}`); // 서버로 id, todo_title 전송
            const new_todo = await this.utils.getUserData();
            this.socket.removeAllListeners();
            console.log(`${new_todo}가 추가 되었습니다.`);
        });
    }

    async getTodo(login_user_id) {
        this.socket.write(`getTodo$id$${login_user_id}`); // 서버로 id 전송
        const todo_list = await this.utils.getUserData();
        this.socket.removeAllListeners();
        let index = 1;
        if (todo_list.length === 0) {
            return this.utils.errorLog('비어있는 리스트 입니다. 새로운 todo를 추가해주세요')
        }
        console.log(this.chalk.cyan(`<<<< ${login_user_id}의 TODO LIST >>>>`));
        todo_list.forEach(todo => {
            let todoText = `${index++}. ${todo.title}`;
            if (todo.complete) {
                todoText += ' ✔ ️';
                console.log(this.chalk.green(todoText))
            } else {
                console.log(this.chalk.yellow(todoText))
            }
        });
    }

    async completeTodo(itemToComplete, login_user_id) {
        const n = Number(itemToComplete);
        // check if the value is a number
        if (isNaN(n)) {
            return this.utils.errorLog("please provide a valid number for complete command");
        }

        // check if correct length of values has been passed
        const isValid_idx = await this.utils.checkValidIdxOfItem(n, login_user_id);
        if (isValid_idx) {
            // update the todo item marked as complete
            this.socket.write(`complete_state$id$${login_user_id}&${n}`); // 서버로 아이디 전송
            const complete_state = await this.utils.getUserData();
            this.socket.removeAllListeners();
            if (complete_state === true) {
                const q = this.chalk.blue('Do you want to uncheck this item from completed list?(yes/no)\n');
                this.utils.prompt(q).then(async (answer) => {
                    if (answer === 'yes') {
                        this.socket.write(`undo_complete_todo$id$${login_user_id}&${n}`); // 서버로 아이디 전송
                        const undo_complete_todo = await this.utils.getUserData();
                        this.socket.removeAllListeners();
                        return console.log(this.chalk.yellow(`${undo_complete_todo} is unchecked from a completed list`));
                    } else if (answer === 'no') {
                        return console.log('명령어를 입력하세요(도움말은 help / 종료하려면 q를 누르세요):');
                    } else {
                        this.utils.errorLog('올바른 입력값이 아닙니다');
                        return console.log('명령어를 입력하세요(도움말은 help / 종료하려면 q를 누르세요):');
                    }
                })
            } else {
                this.socket.write(`completeTodo$id$${login_user_id}&${n}`); // 서버로 아이디 전송
                const complete_todo = await this.utils.getUserData();
                this.socket.removeAllListeners();
                console.log(this.chalk.green(`${complete_todo} is checked as complete`));
            }
        }


    }

    async deleteTodo(itemToDelete, login_user_id) {
        const n = Number(itemToDelete);
        if (isNaN(n)) {
            return this.utils.errorLog("please provide a valid number for complete command");
        }

        // check if correct length of values has been passed
        const isValid_idx = await this.utils.checkValidIdxOfItem(n, login_user_id);

        if (isValid_idx) {
            // delete the item
            this.socket.write(`deleteTodo$id$${login_user_id}&${n}`); // 서버로 아이디 전송
            const deleted_todo = await this.utils.getUserData();
            this.socket.removeAllListeners();
            console.log(this.chalk.red(`${deleted_todo} is deleted`))
        }

    }

    async updateTodo(itemToUpdate, login_user_id) {
        const n = Number(itemToUpdate);

        if (isNaN(n)) {
            return this.utils.errorLog("please provide a valid number for complete command");
        }

        const isValid_idx = await this.utils.checkValidIdxOfItem(n, login_user_id);

        if (isValid_idx) {
            // update the item
            const q = this.chalk.blue('Type the title to update\n');
            this.utils.prompt(q).then(async UpdatedTitle => {
                this.socket.write(`updateTodo$id$${login_user_id}&${n}&${UpdatedTitle}`); // 서버로 아이디 전송
                const {previousTitle, updatedTitle} = await this.utils.getUserData();
                this.socket.removeAllListeners();
                console.log(this.chalk.magenta(`Title is updated: ${previousTitle} => ${updatedTitle}`));
            });
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
}

module.exports = TodoApp;