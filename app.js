const memberClient = require('./member_client');
const chatClient = require('./chat_client');
const utility = require('./utility');

////////////// Sign //////////////
const executeSignPage = async (subText) => {
    console.log(`--- [ Sign ${subText} ] ---`);
    const id = await utility.input(`ID >> `);
    const pw = await utility.input(`PW >> `);
    return [id, pw];
}

////////////// Chat Room //////////////
const executeChatRoomPage = async (userID) => {
    const client = chatClient.getConnection();
    let isChatRoomExit = false;
    while(!isChatRoomExit) {
        const text = await utility.input(``);
        if (text === 'exit') {
            isChatRoomExit = true;
            chatClient.end(client);
        } else chatClient.write(client, `[ ${userID} ] ${text}`);
    }
}

////////////// User //////////////
const handleUserTask = async (select, userID) => {
    let isSignOut = false;
    switch (select) {
        case '1': break;
        case '2': await executeChatRoomPage(userID); break;
        case '3': isSignOut = true; break;
    }
    return isSignOut;
}

const executeUserPage = async (userID) => {
    let select, isSignOut = false;
    while (!isSignOut) {
        console.log(`--- [ User ID : ${userID} ] ---`);
        select = await utility.input(`1.Create a chat room\n2.Entry to chat room\n3.Sign out\n>> `);
        isSignOut = await handleUserTask(select, userID);
    }
}

////////////// Main //////////////
const handleMainTask = async (select) => {
    let isExit = false;
    switch (select) {
        case '1':
            const [userID, userPW] = await executeSignPage('in');
            if (await memberClient.signIn(userID, userPW)) await executeUserPage(userID);
            else console.log(`***** This member does not exist. *****`);
            break;
        case '2':
            const [newID, newPW] = await executeSignPage('up');
            if (await memberClient.signUp(newID, newPW)) console.log(`***** Completed sign up! *****`);
            else console.log(`***** It is member information already existing. *****`);
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
    process.exit();
})();