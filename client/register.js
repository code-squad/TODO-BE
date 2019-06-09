const login = require('./login');

module.exports = register = function (inputReadline, socket, utils) {
    return new Promise(resolve => {
        inputReadline.question('아이디를 입력하세요', async (id) => {
            socket.write(`register$id$${id}`); // 서버로 아이디 전송
            const duplicatedID = await utils.getUserData();
            socket.removeAllListeners();
            if (duplicatedID) {
                utils.errorLog('이미 사용중인 아이디 입니다.');
                resolve(this.register(inputReadline, socket, utils));
            } else {
                return inputReadline.question('비밀번호를 입력하세요', async (pw) => {
                    socket.write(`register$pw$${id}&${pw}`); // 서버로 아이디, 비밀번호 전송
                    const register_success = await utils.getUserData();
                    socket.removeAllListeners();
                    if (register_success) {
                        console.log('------------- 회원가입이 완료됐습니다. -------------');
                        console.log('------------- 로그인 창으로 이동합니다. ------------');
                        resolve(login(inputReadline, socket, utils));
                    } else {
                        utils.errorLog('입력한 정보가 올바르지 않습니다.');
                        resolve(this.register(inputReadline, socket, utils));
                    }
                });
            }
        })
    })
};