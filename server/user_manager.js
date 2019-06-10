const crypto = require('crypto');

class UserManager {
    constructor(db, dataHandler) {
        this.db = db;
        this.dataHandler = dataHandler;
    }

    register(keyword, value) {
        if (keyword === 'id') {
            return !!this.dataHandler.checkDuplicatedID(value);
        } else if (keyword === 'pw') {
            const [id, pw] = value.split('&');
            const encrypted_pw = crypto.createHash('sha512').update(pw).digest('hex');
            this.db.get('users').push({'id': id, 'info': {id: id, pw: encrypted_pw}, todos: []}).write();
            return !!this.dataHandler.checkID_PW(id, encrypted_pw);
        }
    }

    login(value) {
        const [id, pw] = value.split('&');
        const encrypted_pw = crypto.createHash('sha512').update(pw).digest('hex');
        if (this.dataHandler.checkID_PW(id, encrypted_pw)) {
            return {login_success: true, login_user_id: id};
        } else {
            return false
        }

    }

    parseData(data) {
        const parsedData = data.split('$');
        const command = parsedData[0];
        const keyword = parsedData[1];
        const value = parsedData[2];
        console.log(parsedData);
        return {command, keyword, value};
    }

}

module.exports = UserManager;