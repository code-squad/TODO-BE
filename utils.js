const chalk = require('chalk');

class Utils {
    constructor(db, inputReadline){
        this.db = db;
        this.inputReadline = inputReadline;
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
        const eLog = chalk.red(error);
        console.log(eLog)
    }

    prompt(question) {
        return new Promise((resolve, error) => {
            this.inputReadline.question(question, answer => {
                resolve(answer)
            });
        })
    }
}

module.exports = Utils;

