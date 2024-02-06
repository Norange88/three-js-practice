import * as THREE from 'three';
import gsap from 'gsap';
import Experience from './Experience';

export default class Preloader {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.isReady = false;

    this.createOverlay();
    this.initLoadingManager();
  }

  createOverlay() {
    this.loadingBar = document.querySelector('#loading-bar');

    const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
    const overlayMaterial = new THREE.ShaderMaterial({
      // wireframe: true,
      transparent: true,
      uniforms: {
        uAlpha: { value: 1 },
      },
      vertexShader: `
            void main()
            {
                gl_Position = vec4(position, 1.0);
            }
        `,
      fragmentShader: `
            uniform float uAlpha;
    
            void main()
            {
                gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
            }
        `,
    });
    this.overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
    this.scene.add(this.overlay);
  }

  updateAllMaterials() {
    this.environmentMap = this.experience.world.environmentMap;

    this.scene.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial
      ) {
        // child.material.envMap = environmentMap
        child.material.envMapIntensity = this.environmentMap.envMapIntensity;
        child.material.needsUpdate = true;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  initLoadingManager() {
    const it = this;

    this.loadingManager = new THREE.LoadingManager(
      // Loaded
      () => {
        setTimeout(() => {
          gsap.to(this.overlay.material.uniforms.uAlpha, {
            duration: 3,
            value: 0,
            delay: 1,
          });
          this.loadingBar.classList.add('_ended');
          this.loadingBar.style.transform = '';
        }, 500);
        setTimeout(() => {
          this.isReady = true;
        }, 3000);
        it.updateAllMaterials();
      },

      // Progress
      (itemUrl, itemsLoaded, itemsTotal) => {
        // Calculate the progress and update the loadingBarElement
        const progressRatio = itemsLoaded / itemsTotal;
        this.loadingBar.style.transform = `scaleX(${progressRatio})`;
      }
    );
  }
}
