import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import Experience from "../../../../Experience";
import Letter from './Letter';
import { shelfParams } from '../LettersShelf';

const PARAMS = {
  letterSpacing: 0.1
};

export const phrase = 'Баскетбол!';

export default class Letters {
  constructor() {
    this.experience = new Experience();

    this.scene = this.experience.scene;

    this.letters = [];
    this.textWidth = 0;

    this.createInstance();
  }

  createInstance() {
    this.instance = new THREE.Group();

    const letters = phrase.split('');

    const letterGeometry = new THREE.BoxGeometry(1, 1, 1);
    const letterMaterial = new THREE.MeshStandardMaterial({ color: 'yellow', metalness: 0.2, roughness: 0.1 });

    const fontLoader = new FontLoader();

    fontLoader.load('/fonts/droid_sans_regular.typeface.json', (font) => {
      letters.forEach((letter, index) => {
        const letterClass = new Letter(letter, {
          geometry: letterGeometry,
          material: letterMaterial,
          letter,
          font,
          position: {
            x: 0,
            y: 0,
            z: 0
          }
        });

        const letterWidth = letterClass.letterWidth;
        let xPos = 0;
        if (this.textWidth !== 0) {
          xPos = this.textWidth + PARAMS.letterSpacing + letterWidth * 0.5 + shelfParams.initialPosition.x + shelfParams.shelfDimensions.height * 0.5;
        }
        letterClass.instance.mesh.position.set(
          xPos,
          0.5 + shelfParams.initialPosition.y + shelfParams.shelfDimensions.height * 0.5,
          shelfParams.initialPosition.z
        );

        this.instance.add(letterClass.instance.mesh);
        this.letters.push(letterClass);
        this.textWidth = xPos + letterWidth * 0.5;
      });

      this.letters.forEach(letter => {
        letter.instance.mesh.position.x -= (this.textWidth * 0.5);
      });

      this.initPhysics();
    });
  }

  initPhysics() {
    this.letters.forEach((letter) => {
      letter.createPhysicalBody();
    });
  }

  update() {
    this.letters.forEach(letter => {
      letter.update();
    });
  }
}