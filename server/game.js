const INITIAL_COIN_AMOUNT = 30;
const UNSHUFFLED_CARDS = [1,2,3,4,5,6,7,8,9,10];
const PLAYER_1 = 0;
const PLAYER_2 = 1;

class Card {
  constructor() {
    this.set = Array.from(UNSHUFFLED_CARDS);
  }
  shuffle() {
    for (let i = this.set.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.set[i], this.set[j]] = [this.set[j], this.set[i]];
    }
  }
}

class Game {
  constructor(p1, p2, p1soc, p2soc) {
    this.players = [p1, p2];
    this.socs = [p1soc, p2soc];
    this.cards = [new Card(), new Card()];
    this.coins = [INITIAL_COIN_AMOUNT, INITIAL_COIN_AMOUNT];
    this.school = 0;
    this.id = `${p1soc.remotePort}${p2soc.remotePort}`;
    this.turn = PLAYER_1;
    this.pickCards = [];
    this.roundNumb = 0;
  }
  init() {
    this.cards[0].shuffle();
    this.cards[1].shuffle();
    const res = {
      method = 'inGame',
      message = '카드들을 섞었습니다!',
    }
    return res;
  }
  startRound() {
    this.roundNumb += 1;
    this.turn = takeTurn();
    this.pickCards = [
      this.cards[PLAYER_1].pop(), 
      this.cards[PLAYER_2].pop()
    ];
    const res = {
      method: 'inGame',
      action: 'newRound',
      roundNo: this.roundNumb,
    }
    const p1Res = Object.assign(res, {
      showCards: this.pickCards[PLAYER_2],
    });
    const p2Res = Object.assign(res, {
      showCards: this.pickCards[PLAYER_1],
    });
    return { p1res: p1Res, p2res: p2Res };
  }
  playRound() {
    this.turn = takeTurn();
    const opponent = this.turn === PLAYER_1 ? PLAYER_2 : PLAYER_1;
    const sendRes = {
      soc : this.socs[this.turn],
      method: 'inGame',
      action: 'newRound',
      showCard: pickCards[opponent],
    }
  }
  takeTurn() {
    return this.turn === PLAYER_2 ? PLAYER_1 : PLAYER_2;
  }
}

module.exports = Game;