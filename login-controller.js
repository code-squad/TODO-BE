const loginController = {
    login(id, password) {
        const memberList = require('./member-list');
        if(memberList[id] === password) return true;
        return false;
    }
}

module.exports = loginController;