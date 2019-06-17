const INITIAL_COIN_AMOUNT = 30
const UNSHUFFLED_CARDS = [1,2,3,4,5,6,7,8,9,10]

class Card {
  constructor() {
    this.set = UNSHUFFLED_CARDS;
  }
  suffle() {
    for (let i = this.set.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.set[i], this.set[j]] = [this.set[j], this.set[i]];
    }
  }
}

class Game {
  constructor(p1, p2, p1soc, p2soc) {
    this.p1 = p1;
    this.p2 = p2;
    
    this.p1soc = p1soc;
    this.p2soc = p2soc;
    
    this.p1Cards = new Card();
    this.p2Cards = new Card();

    this.id = `${p1soc.remotePort}${p2soc.remotePort}`;
    this.p1coin = INITIAL_COIN_AMOUNT;
    this.p2coin = INITIAL_COIN_AMOUNT;
    this.school = 0;
  }
  init() {
    this.p1Cards.shuffle();
    this.p2Cards.shuffle();
  }
}

module.exports = Game;