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
        const worldcups = model.getHeldWorldCup();
        const html = template.home({ userID, worldcups });
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

    if (pathName === '/usersworldcup') {
        const worldcups = util.getUsersWorldCup(userInfo);
        const html = template.usersWorldCup({ userID, worldcups });
        res.end(html);
    }

    if (pathName === '/createworldcup') {
        const { query } = url.parse(req.url);
        const { worldcupName, mainImg } = qs.parse(query);
        let worldcups = util.getUsersWorldCup(userInfo);

        if (worldcupName === '') {
            const html = template.usersWorldCup({ userID, "message": '월드컵 이름을 정해주세요.', worldcups });
            res.end(html);
        }
        else if (mainImg === '') {
            const html = template.usersWorldCup({ userID, "message": '메인이미지를 넣어주세요.', worldcups });
            res.end(html);
        } else {
            if (model.isFileExist({ folder: 'worldcup', file: worldcupName, type: 'json' })) {
                const html = template.usersWorldCup({ userID, "message": `${worldcupName}는 이미 개최되었습니다.`, worldcups });
                res.end(html);
            } else {
                model.createWorldCup({ userID, userInfo, worldcupName, mainImg })
                userInfo = model.takeUserInfo(userID);
                worldcups = util.getUsersWorldCup(userInfo);
                const html = template.usersWorldCup({ userID, "message": `${worldcupName}이 만들어졌습니다. 선수들을 등록해보세요!`, worldcups });
                res.end(html);
            }
        }
    }
    if (pathName === '/deleteworldcup') {
        const { query } = url.parse(req.url);
        const { title } = qs.parse(query);
        model.deleteWorldCup({ userID, userInfo, title });
        let worldcups = util.getUsersWorldCup(userInfo);

        const html = template.usersWorldCup({ userID, "message": `${title}삭제되었습니다.`, worldcups });
        res.end(html);
    }
    if (pathName === '/playermanagement') {
        const { query } = url.parse(req.url);
        const { title } = qs.parse(query);

        const html = template.playerManagement({ userID, "worldcup": userInfo[title] });
        res.end(html);
    }

    if (pathName === '/registerplayer') {
        const { query } = url.parse(req.url);
        const { title, name, imgURL } = qs.parse(query);

        model.registerPlayer({ userID, userInfo, title, name, imgURL });
        userInfo = model.takeUserInfo(userID);
        const html = template.playerManagement({ "id": userID, "worldcup": userInfo[title], "message": `${name} 등록!` });
        res.end(html);
    }

    if (pathName === '/exitplayer') {
        const { query } = url.parse(req.url);
        const { title, name } = qs.parse(query);

        model.exitPlayer({ userID, userInfo, title, name });
        userInfo = model.takeUserInfo(userID);
        const html = template.playerManagement({ "id": userID, "worldcup": userInfo[title], "message": `${name} 퇴장!` });
        res.end(html);
    }
    if (pathName === '/heldworldcup') {
        const { query } = url.parse(req.url);
        const { title } = qs.parse(query);

        if (userInfo[title].players.length < 16) {
            const html = template.playerManagement({ "id": userID, "worldcup": userInfo[title], "message": `선수는 최소 16명이상이어야 합니다.` });
            res.end(html);
        } else {
            model.heldWorldCup({ userInfo, title });
            const html = template.playerManagement({ "id": userID, "worldcup": userInfo[title], "message": `${title} 개최!` });
            res.end(html);
        }
    }

    if (pathName === '/participation') {
        const { query } = url.parse(req.url);
        const { title } = qs.parse(query);

        const { players } = model.getAllPlayers(title);
        util.setGame({ sessionNum, players });
        const [player1, player2] = session[sessionNum].waitList.splice(0, 2);
        const html = template.participateWorldCup({ player1, player2, rounds: session[sessionNum].rounds });
        res.end(html);
    }

    if (pathName === '/worldcup') {
        const { query } = url.parse(req.url);
        const { name, img } = qs.parse(query);
        util.goToWaitingRoom({ name, img, sessionNum });
        if (util.wasLastRound(sessionNum)) {
            if (util.wasFinalRound(sessionNum)) {
                const html = template.champion({ name, img });
                res.end(html);
            } else {
                util.resetGame({ sessionNum });
                const [player1, player2] = session[sessionNum].waitList.splice(0, 2);
                const html = template.participateWorldCup({ player1, player2, rounds: session[sessionNum].rounds });
                res.end(html);
            }
        } else {
            const [player1, player2] = session[sessionNum].waitList.splice(0, 2);
            const html = template.participateWorldCup({ player1, player2, rounds: session[sessionNum].rounds });
            res.end(html);
        }
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
