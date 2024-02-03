import * as THREE from 'three';

import { phrase } from './components/World/LettersShelf/Letters/Letters';

import Sizes from '../utils/Sizes';
import Camera from './Camera';
import Renderer from './Renderer';
import Time from '../utils/Time';
import Cursor from '../utils/Cursor';
import Score from './Score';
import World from './components/World/World';

let instance = null;

export default class Experience {
  constructor(canvas) {
    if (instance) {
      return instance;
    }

    instance = this;
    this.isDebug = location.hash === '#debug';

    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.sizes = new Sizes();
    this.time = new Time();
    this.cursor = new Cursor(this.sizes);
    this.score = new Score({
      winScore: phrase.length,
    });
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();

    this.world.create();
    this.bindEvents();
  }

  bindEvents() {
    this.sizes.on('resize', this.resize.bind(this));
    this.time.on('tick', this.update.bind(this));
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.world.update();
    this.renderer.update();
  }
}
