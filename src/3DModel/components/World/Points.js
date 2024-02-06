import * as THREE from 'three';
import Experience from '../../Experience';

const points = [
  {
    position: new THREE.Vector3(1.55, 0.3, -0.6),
    element: document.querySelector('.point._0'),
  },
  {
    position: new THREE.Vector3(0.5, 0.8, -1.6),
    element: document.querySelector('.point._1'),
  },
  {
    position: new THREE.Vector3(1.6, -1.3, -0.7),
    element: document.querySelector('.point._2'),
  },
];

export default class Points {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.preloader = this.experience.preloader;

    this.points = points;
    this.raycaster = new THREE.Raycaster();
  }

  update() {
    if (!this.preloader.isReady) return;

    for (const point of this.points) {
      const projectedPosition = point.position.clone();
      projectedPosition.project(this.camera.instance);

      this.raycaster.setFromCamera(projectedPosition, this.camera.instance);
      const intersects = this.raycaster.intersectObjects(
        this.scene.children,
        true
      );
      const closetsIntersect = intersects[0];
      let pointIsVisible = false;

      if (closetsIntersect) {
        const intersectDistance = closetsIntersect.distance;
        const pointDistance = point.position.distanceTo(this.camera.instance.position);

        if (intersectDistance > pointDistance) {
          pointIsVisible = true;
        }
      } else {
        pointIsVisible = true;
      }

      if (pointIsVisible) {
        point.element.classList.add('_visible');
      } else {
        point.element.classList.remove('_visible');
      }

      const newX = projectedPosition.x * this.sizes.width * 0.5;
      const newY = -projectedPosition.y * this.sizes.height * 0.5;
      point.element.style.transform = `translate(${newX}px, ${newY}px)`;
    }
  }
}
