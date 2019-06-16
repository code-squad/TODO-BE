
class Util {
    constructor({ session }) {
        this.session = session;
    }

    makeSession(userID) {
        const expires = new Date();
        expires.setMinutes(expires.getMinutes() + 15);
        const randomInt = +new Date();

        Object.entries(this.session).filter(session => session[1].id === userID).map(session => session[0]).forEach(key => {
            delete this.session[key];
        });
        this.session[randomInt] = {
            id: userID,
            expires,
            rounds: 0,
            waitList: [],
            selectedList: []
        };

        return { randomInt, expires };
    }

}

module.exports = Util;