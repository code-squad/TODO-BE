const http = require('http');

const server = http.createServer((req, res) => {
    console.log('hello world')
})

server.listen(8000);
server.on('listening', () => {
    console.log('8000번 포트');
});
server.on('error', (error) => {
    console.error(error);
});