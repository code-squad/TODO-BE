const model = require('./model');
const signupController = {
    saveUser(id, password) {
        model.updateMemberList(id, password);
    }
}

module.exports = signupController;