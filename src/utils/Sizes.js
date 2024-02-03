import EventEmitter from './EventEmitter';

export default class Sizes extends EventEmitter {
  constructor() {
    super();

    this.setValues();
    this.bindEvents();
  }

  setValues() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.setValues();
      this.trigger('resize');
    });
  }
}