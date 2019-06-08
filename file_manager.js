const createCSVWriter = require('csv-writer').createObjectCsvWriter;
const crypto = require('crypto');
const fs = require('fs');

const csvWriter = createCSVWriter({ 
    path: './member_information.csv',
    header: [ {id:'id', title:'ID'}, {id:'pw', title: 'PW'}, {id:'key', title: 'KEY'} ],
    append: true,
});

const readCSVFile = () => { return fs.readFileSync('./member_information.csv', 'utf-8'); }

const checkID = (member, id) => { return member.split(',')[0] === id; }

const isExistMember = (id) => {
    const members = readCSVFile();
    for (const member of members.split('\n')) {
        if (checkID(member, id)) return true;
    }
    return false;
}

const writeCSVFile = (id, pw) => {
    const byteLength = 64, loopCount = 108236;
    crypto.randomBytes(byteLength, (err, buf) => {
        const key = buf.toString('base64');
        crypto.pbkdf2(pw, key, loopCount, byteLength, 'sha512', (err, encryptedPW) => {
            csvWriter.writeRecords([{'id': id, 'pw': encryptedPW.toString('base64'), 'key': key}])
                        .then(() => { console.log(`The CSV file was written successfully`); });     
        });
    });
}

const save = (id, pw) => {
    if (isExistMember(id)) return false;
    writeCSVFile(id, pw); 
    return true;
}

module.exports = { save };
