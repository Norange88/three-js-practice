import ProjectCard from "./ProjectCard";
import { projects } from "./data";

export default class Projects {
  constructor() {
    this.projects = [];

    this.intersects = [];

    this.createProjects();
  }

  createProjects() {
    projects.forEach((project, index) => {
      const projectCard = new ProjectCard(project, index);
      this.projects.push(projectCard);
      this.intersects.push(...projectCard.intersectObjects);
    });
  }

  update() {
    this.projects.forEach(project => {
      project.update();
    });
  }
}