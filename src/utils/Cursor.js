import EventEmitter from "./EventEmitter";

export default class Cursor extends EventEmitter {
  constructor(sizes) {
    super();

    this.sizes = sizes;

    this.cursorPos = {
      x: 0,
      y: 0
    };

    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('mousemove', this.update.bind(this));
  }

  update(event) {
    this.cursorPos = {
      x: (event.clientX / this.sizes.width - 0.5) * 2,
      y: -(event.clientY / this.sizes.height - 0.5) * 2
    };
    this.trigger('move');
  }

  get position() {
    return this.cursorPos;
  }
}