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
}

module.exports = Model;