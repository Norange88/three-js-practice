import * as THREE from 'three';

import Sizes from '../utils/Sizes';
import Path from './Path';
import Camera from './Camera';
import Renderer from './Renderer';
import Time from '../utils/Time';
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
    this.path = new Path();
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.time = new Time();
    this.world = new World();

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