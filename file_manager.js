const createCSVWriter = require('csv-writer').createObjectCsvWriter;
const crypto = require('crypto');
const fs = require('fs');

let checkMember = 'false';

const csvWriter = createCSVWriter({ 
    path: './member_information.csv',
    header: [ {id:'id', title:'ID'}, {id:'hashPW', title: 'HASHPW'}, {id:'salt', title: 'SALT'} ],
    append: true,
});

const readCSVFile = () => { return fs.readFileSync('./member_information.csv', 'utf-8'); }

const search = async (inputPW, existHashPW, salt) => {
    return new Promise(() => {

    });
    crypto.pbkdf2(inputPW, salt, 108236, 64, 'sha512', (err, hashPW) => { 
        if (existHashPW === hashPW.toString('base64')) checkMember = 'true';
        else checkMember = 'false';
    });
}

const encrypt = (inputPW) => {
    return new Promise((resolve) => {
        crypto.randomBytes(64, (err, buf) => {
            const salt = buf.toString('base64');
            crypto.pbkdf2(inputPW, salt, 108236, 64, 'sha512', (err, hashPW) => { 
                resolve([hashPW.toString('base64'), salt]);
            });
        });
    });
}

const writeCSVFile = async (inputID, inputPW) => {
    const [hashPW, salt] = await encrypt(inputPW);
    csvWriter.writeRecords([{'id': inputID, 'hashPW': hashPW, 'salt': salt}])
        .then(() => { console.log(`The CSV file was written successfully`); });     
}

/////////////// exports ///////////////
module.exports.signUp = (inputID, inputPW) => {
    let isSignUp = true;
    const members = readCSVFile();
    for (const member of members.split('\n')) {
        const existID = member.split(',')[0];
        console.log(`[signUp] inputID : ${inputID}, existID : ${existID}`);
        if (existID === inputID) {
            isSignUp = false;
            break;
        }
    }
    if (isSignUp) writeCSVFile(inputID, inputPW);
    return isSignUp;
}

module.exports.signIn = (inputID, inputPW) => {
    const members = readCSVFile();
    for (const member of members.split('\n')) {
        const [existID, existHashPW, salt] = member.split(',');
        console.log(`[signIn] inputID : ${inputID}, existID : ${existID}`);
        if (existID === inputID) {
            search(inputPW, existHashPW, salt);
            break;
        }
    }
}
