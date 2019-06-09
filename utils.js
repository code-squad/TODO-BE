class Utils {
    constructor(db, inputReadline, socket, chalk) {
        this.db = db;
        this.inputReadline = inputReadline;
        this.socket = socket;
        this.chalk = chalk;
    }

    checkDuplicatedID(id) {
        const ID_fromDB = this.db.get('users').find({'id': id}).value();
        return ID_fromDB !== undefined;
    }

    checkID_PW(id, pw) {
        const ID_fromDB = this.db.get('users').find({'id': id}).value();
        if (ID_fromDB === undefined || ID_fromDB.info.id !== id) return false;
        else return ID_fromDB.info.pw === pw;
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
                console.log(JSON.parse(data));
                resolve(JSON.parse(data));
            })
        })
    }
}

module.exports = Utils;

