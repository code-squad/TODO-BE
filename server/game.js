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
    if (this.roundNumb === 10 || this.coins[PLAYER_1] === 0 || this.coins[PLAYER_2] === 0) {
      this.gameOver();
      return;
    }
    this.roundNumb += 1;
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
      myCoin : this.coins[PLAYER_2],
    }, res);
    return { p1res: p1Res, p2res: p2Res };
  }
  yourTurn() {
    this.turn = this.takeTurn();
    const socket = this.socs[this.turn];
    const sendRes = {  
      method: 'inGame',
      action: 'yourTurn',
      coinToCall: this.coinToCall,
      school: this.school,
      myCoin : this.coins[this.turn],
      gameId : this.id,
    }
    return { socket, sendRes };
  }
  takeTurn() {
    return this.turn === PLAYER_2 ? PLAYER_1 : PLAYER_2;
  }
  fold() {
    const opponent = this.turn === PLAYER_1 ? PLAYER_2 : PLAYER_1;
    this.coins[opponent] += this.school;
    this.school = 0

    const p1end = {
      method: 'inGame',
      action: 'endRound',
      message: this.turn === PLAYER_1 ? 
        '라운드 종료!' : '상대의 fold로 라운드 종료!',
    };
    const p2end = {
      method: 'inGame',
      action: 'endRound',
      message: this.turn === PLAYER_2 ? 
        '라운드 종료!' : '상대의 fold로 라운드 종료!',
    };
    return { p1end, p2end };
  }
  raise(throwCoin) {
    this.school += throwCoin;
    this.coins[this.turn] -= throwCoin;
    this.coinToCall = throwCoin - this.coinToCall;
    const p1msg = {
      method: 'inGame',
      action: 'alert',
      message: this.turn === PLAYER_1 ?
        `${this.coinToCall}만큼 raise하였습니다!` : `상대가 ${this.coinToCall}만큼 raise하였습니다!`,
    }
    const p2msg = {
      method: 'inGame',
      action: 'alert',
      message: this.turn === PLAYER_1 ?
        `상대가 ${this.coinToCall}만큼 raise하였습니다!` : `${this.coinToCall}만큼 raise하였습니다!`,
    }
    return { p1msg, p2msg };
  }
  call() {
    const opponent = this.turn === PLAYER_1 ? PLAYER_2 : PLAYER_1;
    let message = '';
    let winner = 0;
    if (this.coins[this.turn] < this.coinToCall){
      this.school += this.coins[this.turn];
      this.coins[this.turn] = 0;
    } else {
      this.coins[this.turn] -= this.coinToCall;
      this.school += this.coinToCall;
    }
    this.coinToCall = 0;
    
    if (this.pickCards[this.turn] > this.pickCards[opponent]) {
      this.coins[this.turn] += this.school;
      this.school = 0;
      winner = this.turn;  
      message = '무승부입니다! 판돈은 다음 라운드에 누적됩니다.';
    } else if (this.pickCards[this.turn] < this.pickCards[opponent]){
      this.coins[opponent] += this.school;
      this.school = 0;
      winner = opponent;
      message = '무승부입니다! 판돈은 다음 라운드에 누적됩니다.';
    } else {
      message = '무승부입니다! 판돈은 다음 라운드에 누적됩니다.';
    }
    const p1end = {
      method: 'inGame',
      action: 'endRound',
      myCard : this.pickCards[PLAYER_1],
      oppenentCard: this.pickCards[PLAYER_2],
      message: winner === PLAYER_1 ?
        `당신이 이겼습니다!` : `상대가 이겼습니다!`,
    };
    const p2end = {
      method: 'inGame',
      action: 'endRound',
      myCard : this.pickCards[PLAYER_2],
      oppenentCard: this.pickCards[PLAYER_1],
      message: winner === PLAYER_1 ?
        `상대가 이겼습니다!` : `당신이 이겼습니다!`,
    };
    return { p1end, p2end };
  }

  async gameOver() {

  }
}

module.exports = Game;