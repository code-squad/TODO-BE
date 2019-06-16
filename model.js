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
    }

    deleteWorldCup({ userID, userInfo, title }) {
        delete userInfo[title];
        let jsonFile = JSON.stringify(userInfo);
        fs.writeFileSync(`users/${userID}.json`, jsonFile);
    }

    registerPlayer({ userID, userInfo, title, name, imgURL }) {
        userInfo[title].players.push({ "name": name, "img": imgURL });
        let jsonFile = JSON.stringify(userInfo);

        fs.writeFileSync(`users/${userID}.json`, jsonFile);
    }

    exitPlayer({ userID, userInfo, title, name }) {
        userInfo[title].players = userInfo[title].players.filter(x => x.name !== name);
        let jsonFile = JSON.stringify(userInfo);

        fs.writeFileSync(`users/${userID}.json`, jsonFile);
    }

    heldWorldCup({ userInfo, title }) {
        let jsonFile = JSON.stringify(userInfo[title]);
        fs.writeFileSync(`worldcup/${title}.json`, jsonFile);
    }
}

module.exports = Model;