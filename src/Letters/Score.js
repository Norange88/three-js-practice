import EventEmitter from '../utils/EventEmitter';

export default class Score extends EventEmitter {
  constructor({ winScore }) {
    super();

    this.winScore = winScore;
    this.misses = 0;
    this.currentScore = 0;
  }

  addHit(amount = 1) {
    this.currentScore += amount;

    this.trigger('change');

    this.checkGameOver();
  }

  addMiss(amount = 1) {
    this.misses += amount;

    this.checkGameOver();
  }

  checkGameOver() {
    // console.log(this.currentScore, this.misses, this.winScore);

    if (this.currentScore >= this.winScore) {
      setTimeout(() => {
        alert('Победа!');
      }, 1000);
      return;
    }

    if (this.currentScore + this.misses >= this.winScore) {
      setTimeout(() => {
        alert(`Ваш счёт: ${this.currentScore} из ${this.winScore}`);
      }, 1000);
    }
  }
}
