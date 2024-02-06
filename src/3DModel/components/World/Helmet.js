import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Experience from '../../Experience';

export default class Helmet {
  constructor() {
    this.experience = new Experience();
    this.preloader = this.experience.preloader;
    this.gltfLoader = new GLTFLoader(this.preloader.loadingManager);

    this.scene = this.experience.scene;

    this.load();
  }

  load() {
    this.gltfLoader.load(
      '/models/DamagedHelmet/glTF/DamagedHelmet.gltf',
      (gltf) => {
        gltf.scene.scale.set(2.5, 2.5, 2.5);
        gltf.scene.rotation.y = Math.PI * 0.5;
        this.scene.add(gltf.scene);

        // updateAllMaterials();
      }
    );
  }
}
