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
    this.coinToCall = 0;
  }
  init() {
    this.cards[0].shuffle();
    this.cards[1].shuffle();
    const res = {
      method : 'inGame',
      message : '카드들을 섞었습니다!',
    }
    return res;
  }
  async startRound() {
    this.roundNumb += 1;
    this.turn = this.takeTurn();
    this.pickCards = [
      this.cards[PLAYER_1].set.pop(), 
      this.cards[PLAYER_2].set.pop()
    ];
    this.coins[PLAYER_1] -= 1;
    this.coins[PLAYER_2] -= 1;

    this.school += 2;
    const res = {
      method: 'inGame',
      action: 'newRound',
      roundNo: this.roundNumb,
      gameId : this.id,
      school : this.school,
    }
    const p1Res = Object.assign({
      showCards: this.pickCards[PLAYER_2],
      myCoin : this.coins[PLAYER_1],
    }, res);
    const p2Res = Object.assign({
      showCards: this.pickCards[PLAYER_1],
      myCoin : this.coins[PLAYER_1],
    }, res);
    return { p1res: p1Res, p2res: p2Res };
  }
  playRound() {
    this.turn = this.takeTurn();
    const opponent = this.turn === PLAYER_1 ? PLAYER_2 : PLAYER_1;
    const playerSocket = this.socs[this.turn];
    const sendRes = {  
      method: 'inGame',
      action: 'yourTurn',
      coinToCall: this.coinToCall,
      school: this.school,
      myCoin : this.coins[this.turn],
    }
    return { playerSocket, sendRes };
  }
  takeTurn() {
    return this.turn === PLAYER_2 ? PLAYER_1 : PLAYER_2;
  }
}

module.exports = Game;