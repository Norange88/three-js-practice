import * as THREE from 'three';
import gsap from 'gsap';
import * as CANNON from 'cannon-es';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import Experience from '../../../../Experience';

const PARAMS = {
  fontSize: 1,
  fontThickness: 0.2,
  bevelSize: 0.02,
};

export default class Letter {
  constructor(data, { geometry, material, letter, font, position }) {
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
    this.initialPosition = position;
    this.isTargetHit = false;
    this.isMiss = false;
    this.transform = {
      scale: 1,
    };

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
    this.mesh.position.copy(this.initialPosition);
    this.mesh.castShadow = true;
    this.instance.mesh = this.mesh;
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

  resetBody() {
    this.body.position.copy(this.mesh.position);
  }

  onTargetHit() {
    this.targetHit = true;
    gsap.to(this.transform, {
      scale: 0,
      duration: 1,
      onComplete: this.destroy.bind(this),
    });
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
    const hitY = diffY > 0 && diffY < 0.15;

    if (hitY && (!hitX || !hitZ)) {
      this.isMiss = true;
    } else if (hitY && hitX && hitZ) {
      this.isTargetHit = true;
    }

    return hitX && hitY && hitZ;
  }

  onTargetMiss() {
    this.score.addMiss();
  }

  destroy() {
    this.scene.remove(this.instance.mesh);
    this.world.physics.instance.removeBody(this.instance.body);
  }

  update() {
    if (!this.instance.body) return;

    this.instance.mesh.position.copy(this.instance.body.position);
    this.instance.mesh.quaternion.copy(this.instance.body.quaternion);

    const { scale } = this.transform;
    this.instance.mesh.scale.set(scale, scale, scale);

    if (this.isTargetHit || this.isMiss) return;

    this.checkTargetCollision();

    if (this.isTargetHit) {
      this.onTargetHit();
    }

    if (this.isMiss) {
      this.onTargetMiss();
    }
  }
}
