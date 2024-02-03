import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

import Experience from '../../Experience';

export default class HelloText {
  constructor() {
    this.experience = new Experience();

    this.scene = this.experience.scene;

    this.createInstance();
  }

  createInstance() {
    const fontLoader = new FontLoader();

    fontLoader.load('/fonts/droid_sans_regular.typeface.json', (font) => {
      const textGeometry = new TextGeometry('Blue Ant', {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 6,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5,
      });

      textGeometry.center();

      const material = new THREE.MeshStandardMaterial({ color: '#ffffff', metalness: 0.2, roughness: 0.5 });
      // material.wireframe = true;
      this.instance = new THREE.Mesh(textGeometry, material);
      this.instance.position.set(0, 5, 17);
      this.instance.castShadow = true;
      this.instance.receiveShadow = true;
      this.scene.add(this.instance);
    });
  }
}