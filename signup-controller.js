const model = require('./model');
const signupController = {
    saveUser(id, password) {
        const memberList = require('./member-list');
        if(id in memberList) {
            alert("이미 존재하는 아이디입니다. 다른 아이디를 사용해주세요.");
            return;
        }
        model.updateMemberList(id, password);
    }
}

module.exports = signupController;