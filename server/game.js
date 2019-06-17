class Game {
  constructor(p1, p2, p1soc, p2soc) {
    this.p1 = p1;
    this.p2 = p2;
    this.p1soc = p1soc;
    this.p2soc = p2soc;
    this.id = `${p1soc.remotePort}${p2soc.remotePort}`;
  }
}

module.exports = Game;