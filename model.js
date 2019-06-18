const fs = require("fs");

const model = {
    updateMemberList(id, password) {
        const memberList = require('./member-list.json');
        memberList[id] = password;
        fs.writeFile('./member-list.json', JSON.stringify(memberList), (err) => {
            if (err) {
                console.error(err);
            }
        });
    },

    updateLoginUser(id) {
        const objUser = {'user': id};
        fs.writeFile('./login-user.json', JSON.stringify(objUser), (err) => {
            if (err) {
                console.error(err);
            }
        });
    },

    deleteLoginUser(id) {
        fs.writeFile('./login-user.json', '{}', (err) => {
            if (err) {
                console.error(err);
            }
        });
    },

    updateItemList(id, items) {
        const itemList = require('./item-list');
        itemList[id] = items;
        fs.writeFile('./item-list.json', JSON.stringify(itemList), (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
}

module.exports = model;