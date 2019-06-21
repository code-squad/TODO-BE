const input = require('./userInput');

class Game {
  async myTurn(school, myCoin, coinToCall) {
    let reqData = { method : 'inGame' };
    while (true) {
      const selection = await input('행동을 선택하세요! >> ');
      switch (selection) {
        case '1':
          console.log('fold하겠습니다!');
          reqData.action = 'fold';
          return reqData;

        case '2':
          if (coinToCall > myCoin) {
            console.log('올인합니다.');
            reqData.action = 'allIn';
            return reqData;
          }
          const raiseCoinInput = await input('얼마를 raise하시겠습니까? >> ');
          const raiseCoin = Number(raiseCoinInput);
          if (!Number.isInteger(raiseCoin)){
            console.log('숫자를 입력해주세요.');
            continue;
          }
          if (raiseCoin + coinToCall > myCoin) {
            console.log('코인이 모자랍니다.');
            continue;
          }
          reqData.action = 'raise';
          reqData.throwCoin = raiseCoin + coinToCall;
          return reqData;
          
        case '3':
          if (school == 2) {
            console.log('지금은 call할 수 없습니다.');
            continue;
          }
          console.log('Call 합니다.');
          reqData.action = 'call';
          return reqData;
        default:
          console.log('잘못된 입력입니다.');
      }
    }
  }
}

module.exports = Game;