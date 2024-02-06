import * as THREE from 'three';
import Letters from './Letters/Letters';
import Shelf from './Shelf';
import Experience from '../../../Experience';

export const shelfParams = {
  initialPosition: new THREE.Vector3(0, 5, 0),
  shelfDimensions: {
    thickness: 1,
    height: 0.2,
    width: 10,
  },
};

export default class LettersShelf {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.createInstance();
  }

  createInstance() {
    this.instance = new THREE.Group();

    this.letters = new Letters();
    this.shelf = new Shelf();
    this.instance.add(this.letters.instance);
    this.instance.add(this.shelf.instance.mesh);

    this.scene.add(this.instance);
    this.letters.initPhysics();
  }

  update() {
    this.letters.update();
  }

  reset() {
    this.letters.reset();
  }
}
