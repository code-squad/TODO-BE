module.exports = class Player{
    constructor(userInfo,readlineSync,deck,rule){
        this.readlineSync = readlineSync;
        this.id = userInfo.id;
        this.money = userInfo.money;
        this.hand = [];
        this.deck = deck;
        this.rule = rule;
    }

    betMoney(){
        const bettingMoney = Number(this.readlineSync.question(`베팅할 금액을 입력하세요. 소지금 : ${this.money}> `));
        if(bettingMoney > this.money){
            console.log(`베팅금액은 소지금보다 적어야합니다.`);
            this.betMoney(bettingMoney);
        }else{
            this.money -= bettingMoney;
            return bettingMoney;
        }
    }

    takeCard(){
        this.hand.push(this.deck.dealCard());
    }

    choiceAction() {
        if (this.rule.countSum(this.hand) >= 21) {
            return false;
        }
        const action = this.readlineSync.question('Hit? or Stay?\n< 1. Hit >   < 2. Stay > ');
        if (action === '1') {
            this.takeCard();
            return true;
        }
        if (action === '2') {
            return false;
        }
        console.log('다시 입력해주세요.');
        return true;
    }
}