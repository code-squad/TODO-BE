const fs = require('fs');


class Model {
    isFileExist({ folder, file, type }) {
        return fs.existsSync(`${folder}/${file}.${type}`);
    }

    createID({ id, pwd }) {
        fs.writeFile(`users/${id}.json`, `{ "id": "${id}", "pwd": "${pwd}" }`, (err, fd) => {
            if (err) throw err;
        });
    }

    takeUserInfo(userID) {
        return JSON.parse(fs.readFileSync(`users/${userID}.json`).toString());
    }

    createWorldCup({ userID, userInfo, worldcupName, mainImg }) {
        userInfo[worldcupName] = { "title": worldcupName, "mainImg": mainImg, "players": [] };
        let jsonFile = JSON.stringify(userInfo);
        fs.writeFileSync(`users/${userID}.json`, jsonFile);
        return userInfo;
    }
}

module.exports = Model;