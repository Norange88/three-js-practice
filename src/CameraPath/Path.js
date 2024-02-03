import * as THREE from 'three';
import gsap from 'gsap';
import Experience from './Experience';
import EventEmitter from '../utils/EventEmitter';

export const pathPoints = [
  [0, 5, 22],
  [0, 5, 18],
  [0, 1, 14],
  [0, 0.3, 12],
  [-2, 0, 7],
  [2, 0, 2],
  [-1, 0, -2],
  [0, 0, -6],
];

export const stopPoints = [0, 16, 22.7, 26.5];

export default class Path extends EventEmitter {
  constructor() {
    super();
    this.experience = new Experience();

    this.isDebug = this.experience.isDebug;
    this.scene = this.experience.scene;

    this.progress = {
      old: 0,
      current: 0
    };

    this.currentPointIndex = 0;
    this.isAnimating = false;
    this.moveAnimation = null;

    this.createInstance();
    this.isDebug && this.renderStopPoints();
    this.isDebug && this.renderPathPoints();
    this.bindEvents();
  }

  bindEvents() {
    !this.isDebug && window.addEventListener('wheel', (event) => {
      if (!this.isAnimating) {
        this.moveToNextPoint(event);
      }
    });
  }

  createInstance() {
    this.instance = new THREE.CatmullRomCurve3(
      pathPoints.map(point => new THREE.Vector3(...point)),
    );

    const points = this.instance.getPoints(100);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000, opacity: this.isDebug ? 1 : 0, transparent: true });

    const splineObject = new THREE.Line(geometry, material);
    this.scene.add(splineObject);
  }

  renderStopPoints() {
    const geometry = new THREE.SphereGeometry(0.1);
    const material = new THREE.MeshBasicMaterial({ color: '#ff0000' });

    stopPoints.forEach(point => {
      const length = this.instance.getLength();
      const stopAtProgress = point / length;
      const coords = this.instance.getPointAt(stopAtProgress);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(coords);
      this.scene.add(mesh);

      // console.log(point, length, stopAtProgress);
    });
  }

  renderPathPoints() {
    const geometry = new THREE.SphereGeometry(0.02);
    const material = new THREE.MeshBasicMaterial({ color: '#00ff00' });

    pathPoints.forEach(point => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...point);
      this.scene.add(mesh);
    });
  }

  moveToNextPoint(event) {
    let newPointIndex;

    if (event.deltaY > 0) {
      newPointIndex = this.currentPointIndex + 1;
    } else {
      newPointIndex = this.currentPointIndex - 1;
    };

    const point = stopPoints[newPointIndex];
    if (typeof point === 'undefined') return;

    this.isAnimating = true;

    const length = this.instance.getLength();
    const stopAtProgress = point / length;

    const it = this;
    const duration = this.currentPointIndex === 0 ? 6 : 3;

    this.moveAnimation && this.moveAnimation.kill();
    this.currentPointIndex = newPointIndex;

    this.trigger('pointLeave');

    this.moveAnimation = gsap.to(this.progress, {
      current: stopAtProgress, duration: duration, onUpdate() {
        it.trigger('progress');
        it.progress.old = it.progress.current;
      },
      onComplete: () => {
        it.trigger('pointArrive');
        this.isAnimating = false;
      }
    });
  };
}