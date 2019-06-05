const utility = require('./utility');

////////////// Sign //////////////
const executeSignPage = async (subText) => {
    console.log(`--- [ Sign ${subText} ] ---`);
    const id = await utility.input(`ID >> `);
    const pw = await utility.input(`PW >> `);
    return [id, pw];
}

////////////// User //////////////
const handleUserTask = async (select) => {
    let isSignOut = false;
    switch (select) {
        case '1': break;
        case '2': break;
        case '3': isSignOut = true; break;
    }
    return isSignOut;
}

const executeUserPage = async (userID) => {
    let select, isSignOut = false;
    while(!isSignOut) {
        console.log(`--- [ User ID : ${userID} ] ---`);
        select = await utility.input(`1.Create a chat room\n2.Entry to chat room\n3.Sign out\n>> `);
        isSignOut = await handleUserTask(select);
    }
}

////////////// Main //////////////
const handleMainTask = async (select) => {
    let isExit = false;
    switch (select) {
        case '1':
            const [userID, userPW] = await executeSignPage('in');
            await executeUserPage(userID);
            break;
        case '2':
            const [newID, newPW] = await executeSignPage('up');
            break;
        case '3': isExit = true; break;
    }
    return isExit;
}

const executeMainPage = async () => {
    let select, isExit = false;
    while (!isExit) {
        console.log(`--- [ Welcome to Hyodol's Chat Service! ] ---`);
        select = await utility.input(`1.Sign in\n2.Sign up\n3.Exit\n>> `);
        isExit = await handleMainTask(select);
    }
}

////////////// App //////////////
(async () => { 
    await executeMainPage();
    await utility.close();
})();