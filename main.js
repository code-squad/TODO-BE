const http = require('http');
const url = require('url');
const Template = require('./template');

const server = http.createServer((req, res) => {
    const pathName = url.parse(req.url).pathname;

    if (pathName === '/') {
        const html = template.loginPage();
        res.end(html);
    }
    if (pathName === '/home') {
        const html = template.home();
        res.end(html);
    }
})

server.listen(8000);
server.on('listening', () => {
    console.log('8000번 포트');
});
server.on('error', (error) => {
    console.error(error);
});

const template = new Template();