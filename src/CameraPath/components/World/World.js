import * as THREE from 'three';
import Experience from '../../Experience';
import Projects from './Projects/Projects';
import HelloText from './HelloText';
import Light from './Light';

export default class World {
  constructor() {
    this.experience = new Experience();

    this.scene = this.experience.scene;

    this.light = new Light();
    this.projects = new Projects();
    this.helloText = new HelloText();
  }

  update() {
    this.projects.update();
  }
}