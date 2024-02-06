import Experience from '../../Experience';
import EnvironmentMap from './EnvironmentMap';
import Light from './Light';
import Helmet from './Helmet';
import Points from './Points';

export default class World {
  constructor() {
    this.experience = new Experience();

    this.light = new Light();
    this.points = new Points();
  }

  load() {
    this.environmentMap = new EnvironmentMap();
    this.helmet = new Helmet();
  }

  update() {
    this.points.update();
  }
}
