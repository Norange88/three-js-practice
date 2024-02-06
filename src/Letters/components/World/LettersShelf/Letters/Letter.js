import * as THREE from 'three';
import gsap from 'gsap';
import * as CANNON from 'cannon-es';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import Experience from '../../../../Experience';
import { resetCannonBody } from '../../../../../utils/resetCannonBody';

const PARAMS = {
  fontSize: 1,
  fontThickness: 0.2,
  bevelSize: 0.02,
};

export default class Letter {
  constructor(data, { geometry, material, letter, font }) {
    this.experience = new Experience();

    this.world = this.experience.world;
    this.cursor = this.experience.cursor;
    this.camera = this.experience.camera;
    this.letters = this.world.lettersShelf.letters;
    this.target = this.world.target;
    this.score = this.experience.score;
    this.scene = this.experience.scene;

    this.data = data;
    this.geometry = geometry;
    this.material = material;
    this.letter = letter;
    this.font = font;
    this.initialPosition = new THREE.Vector3();
    this.initialQuaternion = new THREE.Vector4();
    this.targetHit = false;
    this.targetMiss = false;

    this.raycaster = new THREE.Raycaster();

    this.createInstance();
    this.bindEvents();
  }

  bindEvents() {
    document.body.addEventListener('click', this.checkIntersects.bind(this));
  }

  checkIntersects() {
    this.raycaster.setFromCamera(this.cursor.position, this.camera.instance);

    const lettersMeshes = this.letters.letters.map(
      (letter) => letter.instance.mesh
    );
    const intersects = this.raycaster.intersectObjects(lettersMeshes);
    const letterIntersect = intersects[0];

    if (letterIntersect?.object !== this.instance.mesh || !this.instance.body)
      return;

    const worldIntersectPoint = letterIntersect.point;
    this.instance.mesh.updateWorldMatrix(true, false);
    const localIntersectPoint =
      this.instance.mesh.worldToLocal(worldIntersectPoint);

    let cameraDirection = new THREE.Vector3();
    this.camera.instance.getWorldDirection(cameraDirection);
    // const impulse = new CANNON.Vec3().copy(letterIntersect.face.normal).scale(-6);
    const impulse = new CANNON.Vec3().copy(cameraDirection).scale(10);
    this.instance.body.applyLocalImpulse(
      impulse,
      new CANNON.Vec3().copy(localIntersectPoint)
    );
  }

  createInstance() {
    this.instance = {
      mesh: null,
      body: null,
    };

    this.createShape();
  }

  createShape() {
    this.geometry = new TextGeometry(this.letter, {
      font: this.font,
      size: PARAMS.fontSize,
      height: PARAMS.fontThickness,
      curveSegments: 6,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: PARAMS.bevelSize,
      bevelOffset: 0,
      bevelSegments: 5,
    });

    this.geometry.computeBoundingBox();
    this.geometry.center();

    this.letterWidth =
      Math.abs(this.geometry.boundingBox.min.x) +
      Math.abs(this.geometry.boundingBox.max.x);
    this.letterHeight =
      Math.abs(this.geometry.boundingBox.min.y) +
      Math.abs(this.geometry.boundingBox.max.y);

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.castShadow = true;
    this.instance.mesh = this.mesh;
  }

  applyInitialPosition(position) {
    if (position) {
      this.initialPosition = position;
    }
    this.instance.mesh.position.copy(this.initialPosition);
    this.resetBody();
  }

  createPhysicalBody() {
    const boxShape = new CANNON.Box(
      new CANNON.Vec3(
        this.letterWidth * 0.5,
        this.letterHeight * 0.5 + PARAMS.bevelSize * 0.5,
        PARAMS.fontThickness * 0.5
      )
    );

    const body = new CANNON.Body({
      shape: boxShape,
      mass: 1,
    });

    const initialPos = new THREE.Vector3();
    this.instance.mesh.getWorldPosition(initialPos);

    body.position.copy(initialPos);
    this.world.physics.instance.addBody(body);
    this.instance.body = body;
  }

  onTargetHit() {
    this.targetHit = true;
    this.score.addHit();
  }

  checkTargetCollision() {
    const targetRadius =
      this.target.instance.targetMesh.geometry.parameters.radius;
    const targetPos = this.target.instance.targetMesh.position;
    const letterPos = this.instance.mesh.position;
    const hitX = Math.abs(targetPos.x - letterPos.x) < targetRadius;
    const hitZ = Math.abs(targetPos.z - letterPos.z) < targetRadius;
    const diffY = targetPos.y - letterPos.y;
    const hitY = diffY > 0 && diffY < 0.3;

    if (hitY && (!hitX || !hitZ)) {
      this.targetMiss = true;
    } else if (hitY && hitX && hitZ) {
      this.targetHit = true;
    }

    return hitX && hitY && hitZ;
  }

  onTargetMiss() {
    this.score.addMiss();
  }

  reset() {
    this.targetHit = false;
    this.targetMiss = false;
    this.applyInitialPosition();
  }

  resetBody() {
    this.instance.body &&
      resetCannonBody(this.instance.body, this.initialPosition);
  }

  update() {
    if (!this.instance.body) return;

    this.instance.mesh.position.copy(this.instance.body.position);
    this.instance.mesh.quaternion.copy(this.instance.body.quaternion);

    if (this.targetHit || this.targetMiss) return;

    this.checkTargetCollision();

    if (this.targetHit) {
      this.onTargetHit();
    }

    if (this.targetMiss) {
      this.onTargetMiss();
    }
  }
}
