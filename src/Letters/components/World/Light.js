import * as THREE from 'three';
import Experience from '../../Experience';

export default class Light {
  constructor() {
    this.experience = new Experience();

    this.scene = this.experience.scene;

    this.showHelpers = false;

    this.setAmbientLight();
    this.setShelfLight();
    this.setTargetLight();
  }

  setAmbientLight() {
    this.ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
    this.scene.add(this.ambientLight);
  }

  setShelfLight() {
    this.shelfLight = new THREE.PointLight('#ffffff', 5, 10);
    this.shelfLight.castShadow = true;
    this.shelfLight.shadow.camera.far = 15;
    this.shelfLight.shadow.mapSize.set(1024, 1024);
    this.shelfLight.shadow.normalBias = 0.05;
    this.shelfLight.position.set(0, 10, 5);
    this.scene.add(this.shelfLight);

    if (!this.showHelpers) return;
    const shelfLightHelper = new THREE.PointLightHelper(this.shelfLight, 1);
    this.scene.add(shelfLightHelper);
  }

  setTargetLight() {
    this.targetLight = new THREE.PointLight('#ffffff', 5, 10);
    this.targetLight.castShadow = true;
    this.targetLight.shadow.camera.far = 15;
    this.shelfLight.shadow.mapSize.set(1024, 1024);
    this.targetLight.shadow.normalBias = 0.05;
    this.targetLight.position.set(0, 6, -5);
    this.scene.add(this.targetLight);

    if (!this.showHelpers) return;
    const targetLightHelper = new THREE.PointLightHelper(this.targetLight, 1);
    this.scene.add(targetLightHelper);
  }
}
