import * as THREE from 'three';
import Experience from '../../Experience';

export default class EnvironmentMap {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.preloader = this.experience.preloader;

    this.cubeTextureLoader = new THREE.CubeTextureLoader(
      this.preloader.loadingManager
    );

    this.envMapIntensity = 2.5;

    this.load();
  }

  load() {
    this.environmentMap = this.cubeTextureLoader.load([
      '/textures/environmentMaps/city/px.jpg',
      '/textures/environmentMaps/city/nx.jpg',
      '/textures/environmentMaps/city/py.jpg',
      '/textures/environmentMaps/city/ny.jpg',
      '/textures/environmentMaps/city/pz.jpg',
      '/textures/environmentMaps/city/nz.jpg',
    ]);

    // this.environmentMap.colorSpace = THREE.SRGBColorSpace;

    this.scene.background = this.environmentMap;
    this.scene.environment = this.environmentMap;
  }
}
