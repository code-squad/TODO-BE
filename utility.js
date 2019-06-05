const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const input = (args) => {
    return new Promise((resolve) => {
        rl.question(`${args}`, (answer) => { resolve(answer) });
    });
}

const close = async () => rl.close();

module.exports = { input, close };