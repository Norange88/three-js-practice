import * as THREE from 'three';
import Experience from '../../Experience';

export default class Light {
  constructor() {
    this.experience = new Experience();

    this.scene = this.experience.scene;

    this.setAmbientLight();
    this.setIntroLight();
  }

  setAmbientLight() {
    this.ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
    this.scene.add(this.ambientLight);
  }

  setIntroLight() {
    this.introLight = new THREE.PointLight("#ffffff", 4, 10);
    this.introLight.castShadow = true;
    this.introLight.shadow.camera.far = 15;
    // this.sunLight.shadow.mapSize.set(1024, 1024);
    this.introLight.shadow.normalBias = 0.05;
    this.introLight.position.set(0, 7, 20);
    this.scene.add(this.introLight);
  }
}