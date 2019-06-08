class UserManager {
    constructor(db, utils) {
        this.db = db;
        this.utils = utils;
    }

    register(keyword, value) {
        if (keyword === 'id') {
            return !!this.utils.checkDuplicatedID(value);
        } else if (keyword === 'pw') {
            const [id, pw] = value.split('&');
            this.db.get('users').push({'id': id, 'info': {id: id, pw: pw}, todos: []}).write();
            return !!this.utils.checkID_PW(id, pw);
        }
    }

    login(value) {
        const [id, pw] = value.split('&');
        if (this.utils.checkID_PW(id, pw)) {
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