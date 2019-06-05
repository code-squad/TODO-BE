const utility = require('./utility');

const executeUserPage = async (id) => {
    let subSelected;
    let isSignOut = false;
    while(!isSignOut) {
        console.log(`--- My ID : ${id} ---`)
        subSelected = await utility.input(`1.Create a chat room\n2.Entry to chat room\n3.Sign out\n>> `);
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
    let id, pw;
    let mainSelected;
    let isProgramExit = false;
    while (!isProgramExit) {
        console.log(`--- Welcome to Hyodol's Chat Service! ---`);
        mainSelected = await utility.input(`1.Sign in\n2.Sign up\n3.Exit\n>> `);
        switch (mainSelected) {
            case '1':
                id = await utility.input(`Enter your ID >> `);
                pw = await utility.input(`Enter your PW >> `);
                // 존재하는 회원이면? -> 1. 채팅 관련 2. 로그아웃
                await executeUserPage(id);
                // 존재하지 않다면?
                break;
            case '2':
                id = await utility.input(`Please enter the ID to use >> `);
                pw = await utility.input(`Please enter the PW to use >> `);
                // id, pw 저장 (중복되는 id인지 체크 필요)
                break;
            case '3': isProgramExit = true; break;
        }
    }
    await utility.close();
}

(async () => { await executeMainPage(); })();