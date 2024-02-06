import Experience from '../../Experience';
import Floor from './Floor';
import Light from './Light';
import LettersShelf from './LettersShelf/LettersShelf';
import Target from './Target';
import Physics from './Physics';

export default class World {
  constructor() {
    this.experience = new Experience();
  }

  create() {
    this.light = new Light();
    this.physics = new Physics();
    this.floor = new Floor();
    this.lettersShelf = new LettersShelf();
    this.target = new Target();
  }

  update() {
    this.physics.update();
    this.lettersShelf.update();
    this.target.update();
  }

  reset() {
    this.lettersShelf.reset();
    this.target.reset();
  }
}
