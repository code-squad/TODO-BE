
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

    deleteSession(sessionNum) {
        delete this.session[sessionNum];
    }

    parseCookies(cookie = '') {
        return cookie
            .split(';')
            .map(v => v.split('='))
            .map(([k, ...vs]) => [k, vs.join('=')])
            .reduce((acc, [k, v]) => {
                acc[k.trim()] = decodeURIComponent(v);
                return acc;
            }, {});
    }

    getUsersWorldCup(userInfo) {
        return Object.entries(userInfo).filter(x => x[0] !== 'id' && x[0] !== 'pwd');
    }

    setGame({ sessionNum, players }) {
        this.session[sessionNum].rounds = 16;
        const mixedPlayers = this.mix(players, this.session[sessionNum].rounds);
        const selectedPlayers = this.selectPlayers({ players: mixedPlayers, rounds: 16 });
        this.session[sessionNum].waitList = [...selectedPlayers];
    }

    mix(players, rounds) {
        var count = 0;
        while (count < rounds) {
            players.sort(function () { return Math.random() - 0.5 });
            count += 1;
        }
        return players;
    }

    selectPlayers({ players, rounds }) {
        return players.splice(0, rounds);
    }
}

module.exports = Util;