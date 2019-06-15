const net = require('net');
const memberClient = net.createConnection({ host: 'localhost', port:60000 });

memberClient.setMaxListeners(15);

memberClient.on('close', () => { 
    console.log(`The connection with the server has been terminated.`);
    process.exit();
});

const confirm = (data) => { memberClient.write(data); }

const isPossible = () => {
    return new Promise((resolve) => { 
        memberClient.on('data', (data) => { resolve((String(data) === 'true') ? true : false); }); 
    });
}

module.exports.signIn = async (userID, userPW) => {
    confirm(`SignIn#${userID}#${userPW}`);
    return (await isPossible()) ? true : false;
}

module.exports.signUp = async (newID, newPW) => {
    confirm(`SignUp#${newID}#${newPW}`);
    return (await isPossible()) ? true : false;
}
