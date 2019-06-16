const http = require('http');
const Template = require('./template');

const server = http.createServer((req, res) => {
    const html = template.loginPage();
    res.end(html);
})

server.listen(8000);
server.on('listening', () => {
    console.log('8000번 포트');
});
server.on('error', (error) => {
    console.error(error);
});

const template = new Template();