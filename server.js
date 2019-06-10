const net = require('net');
const server = net.createServer((c) => {
  // 'connection' listener
  console.log('client connected');

  c.on('data', (data) => {
    const str = data.toString();
    console.log(str);
    //c.write(str);
  });
  
  c.on('end', () => {
    console.log('client disconnected');
  });
  //c.write('hello\r\n');
  c.pipe(c); //connect read and write stream
});
server.on('error', (err) => {
  throw err;
});
server.listen(8124, () => {
  console.log('server bound');
});