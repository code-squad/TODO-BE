const net = require('net');

module.exports.getConnection = (userID) => {
    const chatClient = net.createConnection({ host: 'localhost', port: 50000 }, () => {
        chatClient.setMaxListeners(15);

        chatClient.on('data', (data) => { console.log(`${data}`); });
    });
    return chatClient;
}

module.exports.write = (chatClient, text) => { chatClient.write(text); }

module.exports.end = (chatClient) => { chatClient.end(); }