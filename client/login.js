module.exports = login = function (inputReadline, socket, utils) {
    return new Promise(resolve => {
        inputReadline.question('아이디를 입력하세요', (id) => {
            console.log(id);
            return inputReadline.question('비밀번호를 입력하세요', async (pw) => {
                console.log(pw);
                socket.write(`login$id_pw$${id}&${pw}`); // 서버로 아이디, 비밀번호 전송
                const {login_success, login_user_id} = await utils.getUserData();
                socket.removeAllListeners();
                if (login_success) {
                    resolve(login_user_id);
                } else {
                    utils.errorLog('입력한 정보가 올바르지 않습니다.');
                    resolve(this.login(inputReadline, socket, utils));
                }
            });
        });
    })
};