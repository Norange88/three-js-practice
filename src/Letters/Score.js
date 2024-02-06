import EventEmitter from '../utils/EventEmitter';
import Experience from './Experience';

export default class Score extends EventEmitter {
  constructor({ winScore }) {
    super();

    this.experience = new Experience();

    this.winScore = winScore;
    this.misses = 0;
    this.currentScore = 0;

    this.initGameOverPopup();
  }

  initGameOverPopup() {
    this.gameoverPopup = document.getElementById('gameoverPopup');
    this.resetButton = document.getElementById('gameoverPopupReset');
    this.gameoverText = document.getElementById('gameoverPopupText');

    this.on('gameover', () => {
      this.gameoverText.innerHTML = `Ваш счёт: ${this.currentScore} из ${this.winScore}`;
      this.gameoverPopup.classList.add('_active');
    });

    this.resetButton.addEventListener('click', () => {
      this.experience.reset();
    });
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
      this.trigger('gameover');
      return;
    }

    if (this.currentScore + this.misses >= this.winScore) {
      this.trigger('gameover');
    }
  }

  reset() {
    this.currentScore = 0;
    this.misses = 0;
    this.gameoverPopup.classList.remove('_active');
  }
}
