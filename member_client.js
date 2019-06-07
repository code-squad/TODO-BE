const net = require('net');
const memberClient = net.createConnection({ host: 'localhost', port:60000 });

const send = (data) => { memberClient.write(data); }

const receive = () => {
    return new Promise((resolve) => { 
        memberClient.on('data', (data) => { resolve(Boolean(JSON.stringify(data))); }); 
    });
}

const signIn = async (userID, userPW) => {
    send(userID + '#' + userPW);
    if (!await receive()) return false;
    return true;
}

module.exports = { signIn };
