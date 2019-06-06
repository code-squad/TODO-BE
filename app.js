const rl = require('readline');

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
}

const todoList = new TodoApp();
todoList.mainExecutor();