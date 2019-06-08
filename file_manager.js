const createCSVWriter = require('csv-writer').createObjectCsvWriter;
const crypto = require('crypto');
const fs = require('fs');

let isMemberOK = false;

const csvWriter = createCSVWriter({ 
    path: './member_information.csv',
    header: [ {id:'id', title:'ID'}, {id:'hashPW', title: 'HASHPW'}, {id:'salt', title: 'SALT'} ],
    append: true,
});

const readCSVFile = () => { return fs.readFileSync('./member_information.csv', 'utf-8'); }

const isExist = (id) => {
    const members = readCSVFile();
    for (const member of members.split('\n')) {
        if (member.split(',')[0] === id) return true;
    }
    return false;
}

const encrypt = (pw) => {
    return new Promise((resolve) => {
        crypto.randomBytes(64, (err, buf) => {
            const salt = buf.toString('base64');
            crypto.pbkdf2(pw, salt, 108236, 64, 'sha512', (err, hashPW) => { 
                resolve([hashPW.toString('base64'), salt]);
            });
        });
    });
}

const writeCSVFile = async (id, pw) => {
    const [hashPW, salt] = await encrypt(pw);
    csvWriter.writeRecords([{'id': id, 'hashPW': hashPW, 'salt': salt}])
        .then(() => { console.log(`The CSV file was written successfully`); });     
}

/////////////// exports ///////////////
module.exports.signUp = (id, pw) => {
    if (isExist(id)) return false;
    writeCSVFile(id, pw); 
    return true;
}

module.exports.isMember = () => { return isMemberOK; }

module.exports.signIn = (id, pw) => {
    const members = readCSVFile();
    for (const member of members.split('\n')) {
        const [existID, existHashPW, salt] = member.split(',');
        if (existID === id) {
            crypto.pbkdf2(pw, salt, 108236, 64, 'sha512', (err, hashPW) => { 
                if (existHashPW === hashPW.toString('base64')) {
                    console.log(`Passwords match.`);
                    isMemberOK = true;
                } else {
                    console.log(`Passwords do not match`);
                    isMemberOK = false;
                }
            });
        }
    }
}
