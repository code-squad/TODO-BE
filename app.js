const utility = require('./utility');

const executeSignPage = async (subText) => {
    console.log(`--- [ Sign ${subText} ] ---`);
    const id = await utility.input(`ID >> `);
    const pw = await utility.input(`PW >> `);
    return [id, pw];
}

const executeUserPage = async (userID) => {
    let isSignOut = false;
    while(!isSignOut) {
        console.log(`--- [ User ID : ${userID} ] ---`);
        const subSelected = await utility.input(`1.Create a chat room\n2.Entry to chat room\n3.Sign out\n>> `);
        switch (subSelected) {
            case '1':
                console.log(`Create a chat room`);
                break;
            case '2':
                console.log(`Entry to chat room`);
                break;
            case '3': isSignOut = true; break;
        }
        if (isSignOut) break;
    }
}

const executeMainPage = async () => {
    let isProgramExit = false;
    while (!isProgramExit) {
        console.log(`--- [ Welcome to Hyodol's Chat Service! ] ---`);
        const mainSelected = await utility.input(`1.Sign in\n2.Sign up\n3.Exit\n>> `);
        switch (mainSelected) {
            case '1':
                const [userID, userPW] = await executeSignPage('in');
                // 존재하는 회원이면? -> 1. 채팅 관련 2. 로그아웃
                await executeUserPage(userID);
                // 존재하지 않다면?
                break;
            case '2':
                const [newID, newPW] = await executeSignPage('up');
                // id, pw 저장 (중복되는 id인지 체크 필요)
                break;
            case '3': isProgramExit = true; break;
        }
    }
    await utility.close();
}

(async () => { await executeMainPage(); })();