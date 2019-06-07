const fileManager = require('./file_manager');
const net = require('net');

const memberServer = net.createServer();
const memberClientSocket = [];

memberServer.listen(60000, () => { console.log(`[Member] Server listen on address => ${JSON.stringify(memberServer.address())}`); });

memberServer.on('connection', (memberClient) => {
    console.log(`[Member] Client local address => ${memberClient.localAddress}, local port => ${memberClient.localPort}`);
    console.log(`[Member] Client remote address => ${memberClient.remoteAddress}, remote port => ${memberClient.remotePort}`);

    memberClientSocket.push(memberClient);

    memberClient.on('data', (data) => {
        const [checkType, checkID, checkPW] = String(data).split('#');
        console.log(`${checkType}, ${checkID}, ${checkPW}`);
        if (checkType === 'SignIn') {
            // 파일을 불러오기
            // 탐색을 통해서 ID, PW 조회
            if (checkID === 'hyodol' && checkPW === '1234') memberClient.write('true');
            else memberClient.write('false'); 
        } else if (checkType === 'SignUp') {
            // 파일을 불러와서 탐색을 통해서 ID 조회
            // 이미 존재하면 false
            // 존재하지 않으면 저장..
            memberClient.write('true');
        }
    });

    memberClient.on('close', () => {
        const index = memberClientSocket.indexOf(memberClient);
        if (index !== -1) memberClientSocket.splice(index, 1);
        console.log(`There are ${memberClientSocket.length} connections now.`);
    });
});

memberServer.on('error', (error) => { console.error(JSON.stringify(error)); });

memberServer.on('close', () => { console.log(`[Member] Server socket is closed.`); });