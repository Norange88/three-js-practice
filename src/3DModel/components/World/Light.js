import * as THREE from 'three';
import Experience from '../../Experience';

export default class Light {
  constructor() {
    this.experience = new Experience();

    this.scene = this.experience.scene;

    this.setLight();
  }

  setLight() {
    this.directionalLight = new THREE.DirectionalLight('#ffffff', 3);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.camera.far = 15;
    this.directionalLight.shadow.mapSize.set(1024, 1024);
    this.directionalLight.shadow.normalBias = 0.05;
    this.directionalLight.position.set(0.25, 3, -2.25);
    this.scene.add(this.directionalLight);
  }
}
