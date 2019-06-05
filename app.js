const utility = require('./utility');

(async () => {
    let isServiceEnd = false;
    while (!isServiceEnd) {
        console.log(`------------------------------------`);
        console.log(`Welcome to Hyodol's Chat Service!`);
        const mainSelected = await utility.input(`1.Sign in\n2.Sign up\n3.Exit\n>> `);
        switch (mainSelected) {
            case '1':
            {
                const id = await utility.input(`Enter your ID >> `);
                const pw = await utility.input(`Enter your PW >> `);
                // test
                let isSignOut = false;
                while(!isSignOut) {
                    console.log(`------------------------------------`);
                    console.log(`Your ID : ${id}`);
                    const subSelected = await utility.input(`1.Create a chat room\n2.Entry to chat room\n3.Sign out\n>> `);
                    switch (subSelected) {
                        case '1':
                        {
                            console.log(`Create a chat room`);
                            break;
                        }
                        case '2':
                        {
                            console.log(`Entry to chat room`);
                            break;
                        }
                        case '3': isSignOut = true; break;
                    }
                    if (isSignOut) break;
                }
                // 존재하는 회원이면..
                //      1. 채팅 관련
                //      2. 로그아웃
                // 존재하지 않다면..
                break;
            }
            case '2':
            {
                const id = await utility.input(`Please enter the ID to use >> `);
                const pw = await utility.input(`Please enter the PW to use >> `);
                // id, pw 저장 (중복되는 id인지 체크 필요)
                break;
            }
            case '3': isServiceEnd = true; break;
        }
    }
    await utility.close();
})();