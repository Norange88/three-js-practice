import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import Experience from './Experience';

export default class Camera {
  constructor() {
    this.experience = new Experience();

    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.isDebug = this.experience.isDebug;

    this.setInstance();
    this.setOrbitControls();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      200
    );
    this.instance.position.set(0, 22, 22);
    this.scene.add(this.instance);
  }

  setOrbitControls() {
    this.orbitControls = new OrbitControls(this.instance, this.canvas);
    this.orbitControls.enableDamping = true;
    this.orbitControls.target = new THREE.Vector3(0, 4, 0);
    this.orbitControls.object.position.set(-0.5, 8, 27);
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.orbitControls && this.orbitControls.update();
  }
}
