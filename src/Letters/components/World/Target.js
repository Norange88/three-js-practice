import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import Experience from '../../Experience';

const params = {
  initialPosition: new THREE.Vector3(0, 2, -5),
};

export default class Target {
  constructor() {
    this.experience = new Experience();
    this.fontLoader = new FontLoader();

    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.world = this.experience.world;
    this.score = this.experience.score;

    this.createInstance();

    this.score.on('change', this.createScore.bind(this));
  }

  createInstance() {
    this.instance = {
      targetMesh: null,
      scoreMesh: null,
      borderMesh: null,
      borderBody: null,
    };

    this.createTarget();
    this.createBorder();
    this.createScore();
  }

  createTarget() {
    const geometry = new THREE.CircleGeometry(1.8, 16);
    const material = new THREE.MeshBasicMaterial({
      color: '#00ff00',
      transparent: true,
      opacity: 0.2,
    });

    this.instance.targetMesh = new THREE.Mesh(geometry, material);
    this.instance.targetMesh.position.copy(params.initialPosition);
    this.instance.targetMesh.rotation.x = Math.PI * -0.5;
    this.instance.targetMesh.geometry.computeBoundingBox();

    this.scene.add(this.instance.targetMesh);
  }

  createBorder() {
    const meshGeometry = new THREE.TorusGeometry(2, 0.2, 4, 16);
    const meshMaterial = new THREE.MeshStandardMaterial({ color: '#ffffff' });

    this.instance.borderMesh = new THREE.Mesh(meshGeometry, meshMaterial);
    this.instance.borderMesh.position.copy(params.initialPosition);
    this.instance.borderMesh.rotation.x = Math.PI * -0.5;

    this.scene.add(this.instance.borderMesh);

    this.createBorderBody();

    // const shape = CANNON.Trimesh.createTorus(2, 0.2, 4, 16);
    // const body = new CANNON.Body({ shape: shape, mass: 1 });
    // body.position.copy(params.initialPosition);
    // body.position.set(0, 8, 0);
    // body.quaternion.copy(this.instance.borderMesh.quaternion);

    // this.world.physics.instance.addBody(body);
  }

  createBorderBody() {
    this.borderSegments = [];

    const divisions = 16;
    const angleStep = (Math.PI * 2) / divisions;
    const borderLength = Math.PI * 2 * 2;
    const segmentLength = borderLength / divisions;

    const shape = new CANNON.Box(
      new CANNON.Vec3(0.2, 0.2, segmentLength * 0.5)
    );

    for (
      let i = angleStep * 0.5;
      i <= Math.PI * 2 + angleStep * 0.5;
      i += angleStep
    ) {
      const xPos = 2 * Math.cos(i) + params.initialPosition.x;
      const zPos = 2 * Math.sin(i) + params.initialPosition.z;

      const body = new CANNON.Body({ shape: shape, mass: 0 });
      const bodyPos = new THREE.Vector3(xPos, params.initialPosition.y, zPos);
      body.position.copy(bodyPos);
      body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, -1, 0), i);
      body.distanceFromTargetCenter = bodyPos.sub(
        new THREE.Vector3().copy(this.instance.targetMesh.position)
      );
      body.aabbNeedsUpdate = true;

      this.world.physics.instance.addBody(body);
      this.borderSegments.push(body);
    }
  }

  createScore() {
    this.fontLoader.load('/fonts/droid_sans_regular.typeface.json', (font) => {
      if (this.instance.scoreMesh) {
        this.scene.remove(this.instance.scoreMesh);
      }

      const geometry = new TextGeometry(this.score.currentScore.toString(), {
        font: font,
        size: 1.6,
        height: 0.1,
        curveSegments: 6,
      });

      geometry.computeBoundingBox();
      geometry.center();
      const material = new THREE.MeshBasicMaterial({
        color: '#fff',
        transparent: true,
        opacity: 0.2,
      });

      this.instance.scoreMesh = new THREE.Mesh(geometry, material);
      this.instance.scoreMesh.position.copy(this.instance.targetMesh.position);
      this.instance.scoreMesh.quaternion.copy(
        this.instance.targetMesh.quaternion
      );
      this.scene.add(this.instance.scoreMesh);
    });
  }

  update() {
    this.instance.targetMesh.position.x =
      Math.sin(this.time.elapsed * 0.001) * 4;
    this.instance.borderMesh.position.x =
      Math.sin(this.time.elapsed * 0.001) * 4;
    this.borderSegments.forEach((segment) => {
      segment.position.x =
        Math.sin(this.time.elapsed * 0.001) * 4 +
        segment.distanceFromTargetCenter.x;
    });
    this.instance.scoreMesh &&
      (this.instance.scoreMesh.position.x =
        Math.sin(this.time.elapsed * 0.001) * 4);
  }
}
