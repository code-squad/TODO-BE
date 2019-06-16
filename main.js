const http = require('http');
const url = require('url');
const qs = require('querystring');
const Template = require('./template');
const Model = require('./model');
const Util = require('./util');

const session = {}

const server = http.createServer((req, res) => {
    const pathName = url.parse(req.url).pathname;
    const cookies = util.parseCookies(req.headers.cookie);
    const sessionNum = cookies.session;
    let userID;
    let userInfo;
    if (cookies.session) {
        userID = session[sessionNum].id;
        userInfo = model.takeUserInfo(userID);
    }

    if (pathName === '/') {
        const html = template.loginPage();
        res.end(html);
    }
    if (pathName === '/home') {
        const html = template.home({ userID });
        res.end(html);
    }
    if (pathName === '/signup') {
        const { query } = url.parse(req.url);
        const { id, pwd } = qs.parse(query);

        if (id === '') {
            const html = template.loginPage(`아이디를 입력해 주세요.`);
            res.end(html);
        } else if (pwd === '') {
            const html = template.loginPage(`비밀번호를 입력해 주세요.`);
            res.end(html);
        } else {
            if (model.isFileExist({ folder: 'users', file: id, type: 'json' })) {
                const html = template.loginPage(`${id}는 사용중입니다.`);
                res.end(html);
            } else {
                model.createID({ id, pwd });
                const html = template.loginPage('아이디가 생성되었습니다.');
                res.end(html);
            }
        }
    }

    if (pathName === '/login') {
        const { query } = url.parse(req.url);
        const { id, pwd } = qs.parse(query);

        if (model.isFileExist({ folder: 'users', file: id, type: 'json' })) {
            const userInfo = model.takeUserInfo(id);
            if (pwd === userInfo.pwd) {
                const { randomInt, expires } = util.makeSession(id);
                res.writeHead(302, {
                    Location: '/home',
                    'Set-Cookie': `session=${randomInt}; Expires=${expires.toUTCString()}; HttpOnly; Path=/`,
                });
                res.end();
            } else {
                const html = template.loginPage('비밀번호가 틀렸습니다.');
                res.end(html);
            }
        } else {
            const html = template.loginPage(`${id}는 없는 아이디입니다.`);
            res.end(html);
        }
    }

    if (pathName === '/logout') {
        util.deleteSession(sessionNum);
        res.writeHead(302, {
            Location: '/',
            'Set-Cookie': `session=; Expires=; HttpOnly; Path=/`,
        });
        res.end();
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
const model = new Model();
const util = new Util({ session });
