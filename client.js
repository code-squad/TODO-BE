const readLine = require('readline');
const rl = readLine.createInterface({ input:process.stdin });

const net = require('net');
const client = net.createConnection({ host: 'localhost', port: 50000 }, () => {
    console.log(`local address : ${client.localAddress}, local port : ${client.localPort}`);
    console.log(`remote address : ${client.remoteAddress}, remote port : ${client.remotePort}`);
});

client.on('data', (data) => {
    console.log(`server send data : ${data}`);
});

client.on('close', () => {
    console.log(`The connection with the server has been terminated. Please close the program`);
});

rl.on('line', (input) => {
    if (input == 'exit') rl.close();
    client.write(input);
}).on('close', () => { process.exit(); });