class Utils {
    constructor(inputReadline, socket, chalk) {
        this.inputReadline = inputReadline;
        this.socket = socket;
        this.chalk = chalk;
    }

    async checkValidIdxOfItem(n, login_user_id) {
        // check if correct length of values has been passed
        this.socket.write(`todosLength$id$${login_user_id}`); // 서버로 아이디 전송
        const todosLength = await this.getUserData();
        this.socket.removeAllListeners();
        if (n > todosLength) {
            this.errorLog("invalid number passed for complete command.");
            return false;
        } else {
            return true;
        }
    }

    // used to log errors to the console in red color
    errorLog(error) {
        const eLog = this.chalk.red(error);
        console.log(eLog)
    }

    prompt(question) {
        return new Promise((resolve, error) => {
            this.inputReadline.question(question, answer => {
                resolve(answer)
            });
        })
    }

    getUserData() {
        return new Promise(resolve => {
            this.socket.setEncoding('utf8');
            this.socket.on('data', function (data) {
                resolve(JSON.parse(data));
            })
        })
    }
}

module.exports = Utils;

