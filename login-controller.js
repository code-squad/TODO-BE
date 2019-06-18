const model = require('./model');

const loginController = {
    login(id, password) {
        const memberList = require('./member-list');
        if(memberList[id] === password) {
            model.updateLoginUser(id);
            return true;
        }
        return false;
    },

    logout() {
        model.deleteLoginUser();
    }
}

module.exports = loginController;