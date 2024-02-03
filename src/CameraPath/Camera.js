import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import Experience from './Experience';
import { pathPoints } from './Path';

export default class Camera {
  constructor() {
    this.experience = new Experience();

    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.path = this.experience.path;
    this.isDebug = this.experience.isDebug;

    this.rotation = {
      fromPath: {
        x: 0,
        y: 0,
      },
      fromCursor: {
        x: 0,
        y: 0
      }
    };

    this.setInstance();
    this.isDebug && this.setOrbitControls();
    this.bindEvents();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );
    this.instance.position.set(...pathPoints[0]);
    this.instance.lookAt(...pathPoints[1]);
    this.scene.add(this.instance);
  }

  bindEvents() {
    this.path.on('progress', () => {
      this.moveCameraToProgress();
    });
    !this.isDebug && window.addEventListener('mousemove', this.moveCameraToCursor.bind(this));
  }

  moveCameraToCursor(event) {
    const normalizedX = event.clientX / this.sizes.width - 0.5;
    const normalizedY = event.clientY / this.sizes.height - 0.5;

    this.rotation.fromCursor.x = -normalizedY * 0.05;
    this.rotation.fromCursor.y = -normalizedX * 0.05;
  }

  moveCameraToProgress() {
    if (this.path.progress.current === this.path.progress.old) return;

    const point = this.path.instance.getPointAt(this.path.progress.current);
    const oldPoint = this.path.instance.getPointAt(this.path.progress.old);
    let lookAt;

    lookAt = new THREE.Vector3(point.x, point.y, point.z);

    const savedRotation = { ...this.instance.rotation };

    if (this.path.progress.current > this.path.progress.old) {
      lookAt = new THREE.Vector3(point.x, point.y, point.z);
      this.instance.lookAt(lookAt);
      this.instance.position.copy(point);
    } else {
      lookAt = new THREE.Vector3(oldPoint.x, oldPoint.y, oldPoint.z);
      this.instance.position.copy(point);
      this.instance.lookAt(lookAt);
    }

    this.rotation.fromPath.x = this.instance.rotation.x;
    this.rotation.fromPath.y = this.instance.rotation.y;
    this.instance.rotation.copy(savedRotation);
  };

  updateCameraRotation() {
    const targetRotationX = this.rotation.fromPath.x + this.rotation.fromCursor.x;
    const targetRotationY = this.rotation.fromPath.y + this.rotation.fromCursor.y;

    const diffX = targetRotationX - this.instance.rotation.x;
    const diffY = targetRotationY - this.instance.rotation.y;

    this.instance.rotation.x += diffX * 0.02;
    this.instance.rotation.y += diffY * 0.02;
  }

  setOrbitControls() {
    this.orbitControls = new OrbitControls(this.instance, this.canvas);
    this.orbitControls.enableDamping = true;
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.orbitControls && this.orbitControls.update();
    this.firstPersonControls && this.firstPersonControls.update();

    if (this.isDebug) return;
    this.updateCameraRotation();
  }
}