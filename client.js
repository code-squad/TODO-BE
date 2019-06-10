const net = require('net');
const client = net.createConnection({ port: 8124 }, () => {
  // 'connect' listener
  console.log('connected to server!');
  client.write('Hello\r\n');
  client.write('World\r\n');
  client.write('bye\r\n');
  //client.end();
});
client.on('data', (data) => {    
    const str = data.toString();
    console.log(str);
    if(str.indexOf('bye') !== -1) {
        client.end();
    }
});
client.on('end', () => {
  console.log('disconnected from server');
});