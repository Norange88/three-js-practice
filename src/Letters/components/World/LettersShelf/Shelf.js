import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import Experience from '../../../Experience';
import { shelfParams } from './LettersShelf';

export default class Shelf {
  constructor() {
    this.experience = new Experience();

    this.world = this.experience.world;

    this.createInstance();
  }

  createInstance() {
    this.instance = {
      mesh: null,
      body: null,
    };

    this.createMesh();
    this.createBody();
  }

  createMesh() {
    const geometry = new THREE.BoxGeometry(
      shelfParams.shelfDimensions.width,
      shelfParams.shelfDimensions.height,
      shelfParams.shelfDimensions.thickness
    );
    const material = new THREE.MeshStandardMaterial({
      color: 'lightblue',
      metalness: 0,
      roughness: 1,
    });

    this.instance.mesh = new THREE.Mesh(geometry, material);
    this.instance.mesh.receiveShadow = true;
    this.instance.mesh.position.copy(shelfParams.initialPosition);
  }

  createBody() {
    const boxShape = new CANNON.Box(
      new CANNON.Vec3(
        shelfParams.shelfDimensions.width * 0.5,
        shelfParams.shelfDimensions.height * 0.5,
        shelfParams.shelfDimensions.thickness * 0.5
      )
    );

    const body = new CANNON.Body({
      shape: boxShape,
      mass: 0,
    });

    const initialPos = new THREE.Vector3();
    this.instance.mesh.getWorldPosition(initialPos);

    body.position.copy(initialPos);
    this.world.physics.instance.addBody(body);
    this.instance.body = body;
  }
}
