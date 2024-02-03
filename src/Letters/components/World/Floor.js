import * as THREE from 'three';
import * as CANNON from 'cannon-es';

import Experience from "../../Experience";

export default class Floor {
  constructor() {
    this.experience = new Experience();

    this.scene = this.experience.scene;
    this.world = this.experience.world;

    this.createInstance();
  }

  createInstance() {
    // this.createShape();
    this.createPhysicalBody();

    this.instance = {
      mesh: this.mesh,
      body: this.body
    };
  }

  createShape() {
    const geometry = new THREE.PlaneGeometry(10, 10);
    const material = new THREE.MeshBasicMaterial({ color: '#cccccc' });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotation.x = -Math.PI * 0.5;

    this.scene.add(this.mesh);
  }

  createPhysicalBody() {
    const floorShape = new CANNON.Plane();

    this.body = new CANNON.Body({
      shape: floorShape,
      mass: 0,
      position: new CANNON.Vec3(0, 0, 0),
    });

    this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI * 0.5);
    this.world.physics.instance.addBody(this.body);
  }

  update() {
    this.instance.mesh?.position.copy(this.instance.body.position);
    this.instance.mesh?.quaternion.copy(this.instance.body.quaternion);
  }
}