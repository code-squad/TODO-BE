const createCSVWriter = require('csv-writer').createObjectCsvWriter;
const crypto = require('crypto');
const fs = require('fs');

const csvWriter = createCSVWriter({ 
    path: './member_information.csv',
    header: [ {id:'id', title:'ID'}, {id:'hashPW', title: 'HASHPW'}, {id:'salt', title: 'SALT'} ],
    append: true,
});

const readCSVFile = () => { return fs.readFileSync('./member_information.csv', 'utf-8'); }

const search = (inputPW, existHashPW, salt) => {
    return new Promise((resolve) => {
        crypto.pbkdf2(inputPW, salt, 108236, 64, 'sha512', (err, hashPW) => {
            resolve((existHashPW === hashPW.toString('base64')) ? true : false); 
        });
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

signUp = async (inputID, inputPW) => {
    let isSignUp = true;
    const members = readCSVFile();
    for (const member of members.split('\n')) {
        const existID = member.split(',')[0];
        if (existID === inputID) {
            console.log(`[signUp] inputID : ${inputID}, existID : ${existID}`);
            isSignUp = false;
            break;
        }
    }
    if (isSignUp) writeCSVFile(inputID, inputPW);
    return isSignUp;
}

signIn = async (inputID, inputPW) => {
    let isSignIn = false;
    const members = readCSVFile();
    for (const member of members.split('\n')) {
        const [existID, existHashPW, salt] = member.split(',');
        if (existID === inputID) {
            console.log(`[signIn] inputID : ${inputID}, existID : ${existID}`);
            isSignIn = await search(inputPW, existHashPW, salt);
        }
    }
    return isSignIn;
}

/////////////// exports ///////////////
module.exports.sign = async (type, inputID, inputPW) => {
    if(type === 'SignIn') return await signIn(inputID, inputPW);
    if(type === 'SignUp') return await signUp(inputID, inputPW);
}
