const net = require('net');
const client = net.createConnection({ port: 8124 }, () => {
  // 'connect' listener
  console.log('connected to server!');
  client.write('Hello\r\n');
  client.write('World\r\n');
  client.write('bye\r\n');
  client.end();
});
client.on('data', (data) => {    
    console.log(data.toString());
});
client.on('end', () => {
  console.log('disconnected from server');
});