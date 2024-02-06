import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import Experience from '../../../../Experience';
import Letter from './Letter';
import { shelfParams } from '../LettersShelf';

const PARAMS = {
  letterSpacing: 0.1,
};

export const phrase = 'Баскетбол!';

export default class Letters {
  constructor() {
    this.experience = new Experience();

    this.scene = this.experience.scene;

    this.letters = [];
    this.textWidth = 0;
    this.fontLoader = new FontLoader();

    this.createInstance();
  }

  createInstance() {
    this.instance = new THREE.Group();

    const letters = phrase.split('');

    const letterGeometry = new THREE.BoxGeometry(1, 1, 1);
    const letterMaterial = new THREE.MeshStandardMaterial({
      color: 'yellow',
      metalness: 0.2,
      roughness: 0.1,
    });

    this.fontLoader.load('/fonts/droid_sans_regular.typeface.json', (font) => {
      letters.forEach((letter, index) => {
        const letterClass = new Letter(letter, {
          geometry: letterGeometry,
          material: letterMaterial,
          letter,
          font,
        });

        const letterWidth = letterClass.letterWidth;
        let xPos = 0;
        if (this.textWidth !== 0) {
          xPos =
            this.textWidth +
            PARAMS.letterSpacing +
            letterWidth * 0.5 +
            shelfParams.initialPosition.x +
            shelfParams.shelfDimensions.height * 0.5;
        }
        const letterInitialPosition = new THREE.Vector3(
          xPos,
          0.5 +
            shelfParams.initialPosition.y +
            shelfParams.shelfDimensions.height * 0.5,
          shelfParams.initialPosition.z
        );
        letterClass.applyInitialPosition(letterInitialPosition);

        this.instance.add(letterClass.instance.mesh);
        this.letters.push(letterClass);
        this.textWidth = xPos + letterWidth * 0.5;
      });

      this.letters.forEach((letter) => {
        letter.applyInitialPosition(
          new THREE.Vector3(
            letter.initialPosition.x - this.textWidth * 0.5,
            letter.initialPosition.y,
            letter.initialPosition.z
          )
        );
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
    this.letters.forEach((letter) => {
      letter.update();
    });
  }

  reset() {
    this.letters.forEach((letter) => {
      letter.reset();
    });
  }
}
