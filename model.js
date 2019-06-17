const fs = require("fs");

const model = {
    updateMemberList(id, password) {
        const memberList = require('./member-list.json');
        memberList[id] = password;
        fs.writeFile('./member-list.json', JSON.stringify(memberList), (err) => {
            if (err) {
                console.error(err);
            }
            console.log("memberList was updated");
        });
    },

    updateLoginUser(id) {
        const objUser = {'user': id};
        fs.writeFile('./login-user.json', JSON.stringify(objUser), (err) => {
            if (err) {
                console.error(err);
            }
            console.log("login-user was updated");
        });
    }
}

module.exports = model;