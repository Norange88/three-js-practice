import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';
import Experience from '../../Experience';

export default class Physics {
  constructor() {
    this.experience = new Experience();

    this.time = this.experience.time;
    this.scene = this.experience.scene;

    this.createInstance();
    this.setDefaultMaterial();
    // this.createDebugger();
  }

  createInstance() {
    this.instance = new CANNON.World();
    this.instance.broadphase = new CANNON.SAPBroadphase(this.instance);
    // this.instance.allowSleep = true;
    this.instance.gravity.set(0, -9.82, 0);
  }

  createDebugger() {
    this.cannonDebugger = new CannonDebugger(this.scene, this.instance);
  }

  setDefaultMaterial() {
    // World materials
    const defaultMaterial = new CANNON.Material('default');
    const defaultContactMaterial = new CANNON.ContactMaterial(
      defaultMaterial,
      defaultMaterial,
      {
        friction: 1,
        restitution: 0.6,
      }
    );

    this.instance.addContactMaterial(defaultContactMaterial);
    this.instance.defaultContactMaterial = defaultContactMaterial;
  }

  update() {
    this.instance.step(1 / 60, this.time.delta / 1000, 3);
    this.cannonDebugger && this.cannonDebugger.update();
  }
}