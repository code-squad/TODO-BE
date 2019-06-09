const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

module.exports.input = (args) => {
    return new Promise((resolve) => {
        rl.question(`${args}`, (answer) => { resolve(answer) });
    });
}

module.exports.close = async () => rl.close();