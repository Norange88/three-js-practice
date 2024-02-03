import * as THREE from 'three';
import * as ThreeMeshUI from "three-mesh-ui";
import gsap from 'gsap';
import Experience from '../../../Experience';

THREE.ColorManagement.enabled = false;

export default class ProjectCard {
  constructor(project, index) {
    if (!project) return;

    this.projectIndex = index;

    this.experience = new Experience();
    this.project = project;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.sizes = this.experience.sizes;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.time = this.experience.time;
    this.path = this.experience.path;

    this.cardSizes = {
      width: 2,
      height: 1,
      thickness: 0.2
    };

    this.textContainerSizes = {
      top: {
        height: 0.2
      },
      bottom: {
        height: 0.2
      }
    };

    this.rotation = {
      base: {
        x: 0,
        y: 0,
      },
      fromCamera: {
        x: 0,
        y: 0
      }
    };

    this.isHovered = {
      prev: false,
      current: false
    };

    this.intersectObjects = [];
    this.interactionEnabled = false;

    this.createInstance();
    this.render();
    this.bindEvents();
  }

  activate() {
    this.interactionEnabled = true;
  }

  deactivate() {
    this.interactionEnabled = false;

    if (this.isHovered.current) {
      this.isHovered = {
        prev: false,
        current: false
      };
      this.handleHoverOut();
    }
  }

  createInstance() {
    const loadingManager = new THREE.LoadingManager();
    const textureLoader = new THREE.TextureLoader(loadingManager);
    const texture = textureLoader.load(this.project.image);

    texture.generateMipmaps = false;
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;

    this.instance = new THREE.Group();

    const cardMaterial = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    const cardGeometry = new THREE.BoxGeometry(
      this.cardSizes.width,
      this.cardSizes.height,
      this.cardSizes.thickness
    );
    this.cardMesh = new THREE.Mesh(cardGeometry, cardMaterial);

    const faceMaterial = new THREE.MeshBasicMaterial({ color: '#ffffff', map: texture, transparent: false, opacity: 0 });
    const faceGeometry = new THREE.PlaneGeometry(this.cardSizes.width, this.cardSizes.height);
    this.faceMesh = new THREE.Mesh(faceGeometry, faceMaterial);

    this.instance.add(this.cardMesh);
    this.instance.add(this.faceMesh);

    this.intersectObjects.push(this.cardMesh);

    this.instance.position.set(...this.project.position);
    this.faceMesh.position.set(0, 0, this.cardSizes.thickness * 0.5 + 0.01);
  }

  onCardClick = () => {
    location.href = this.project.link;
  };

  bindEvents() {
    window.addEventListener('mousemove', (event) => {
      this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
      this.mouse.y = -((event.clientY / this.sizes.height) * 2 - 1);
    });

    this.path.on('pointLeave', () => {
      if (this.path.currentPointIndex === this.projectIndex + 1) {
        this.activate();
      } else {
        this.deactivate();
      }
    });
  }

  render() {
    this.scene.add(this.instance);
    this.renderTexts();
  }

  renderTexts() {
    this.textContainerTop = new ThreeMeshUI.Block({
      width: this.cardSizes.width,
      height: this.textContainerSizes.top.height,
      justifyContent: 'center',
      alignContent: 'left',
      backgroundOpacity: 0,
      fontOpacity: 0,
      fontFamily: 'https://unpkg.com/three-mesh-ui/examples/assets/Roboto-msdf.json',
      fontTexture: 'https://unpkg.com/three-mesh-ui/examples/assets/Roboto-msdf.png',
    });

    const topTextAnimationOffset = 0.2;

    this.textContainerTop.position.set(
      0,
      this.cardSizes.height * 0.5 + this.textContainerSizes.top.height * 0.5 + topTextAnimationOffset,
      this.cardSizes.thickness * 0.5 + 0.01
    );

    const projectName = new ThreeMeshUI.Text({
      content: this.project.name,
      fontColor: new THREE.Color('#ffffff'),
    });

    this.textContainerTop.add(projectName);
    this.instance.add(this.textContainerTop);

    this.textContainerBottom = new ThreeMeshUI.Block({
      width: this.cardSizes.width,
      height: this.textContainerSizes.bottom.height,
      contentDirection: 'row',
      justifyContent: 'space-between',
      alignContent: 'center',
      backgroundOpacity: 0,
      fontOpacity: 0,
      fontFamily: 'https://unpkg.com/three-mesh-ui/examples/assets/Roboto-msdf.json',
      fontTexture: 'https://unpkg.com/three-mesh-ui/examples/assets/Roboto-msdf.png',
    });

    this.textContainerBottom.position.set(
      0,
      -(this.cardSizes.height * 0.5 + this.textContainerSizes.top.height * 0.5 + topTextAnimationOffset),
      this.cardSizes.thickness * 0.5 + 0.01
    );

    const projectTag = new ThreeMeshUI.Block({
      width: this.cardSizes.width * 0.5,
      height: this.textContainerSizes.bottom.height,
      backgroundOpacity: 0,
      textAlign: 'left',
      justifyContent: 'center',
    });

    const projectTagText = new ThreeMeshUI.Text({
      content: this.project.tag,
      fontColor: new THREE.Color('#ffffff'),
    });

    projectTag.add(projectTagText);

    const projectDate = new ThreeMeshUI.Block({
      width: this.cardSizes.width * 0.5,
      height: this.textContainerSizes.bottom.height,
      backgroundOpacity: 0,
      textAlign: 'right',
      justifyContent: 'center',
    });

    const projectDateText = new ThreeMeshUI.Text({
      content: this.project.date,
      fontColor: new THREE.Color('#ffffff'),
    });

    projectDate.add(projectDateText);

    this.textContainerBottom.add(projectTag);
    this.textContainerBottom.add(projectDate);
    this.instance.add(this.textContainerBottom);
    this.intersectObjects.push(this.textContainerBottom, this.textContainerTop);
  }

  updateRotation() {
    if (!this.interactionEnabled) return;

    const targetRotationX = this.rotation.base.x + this.rotation.fromCamera.x;
    const targetRotationY = this.rotation.base.y + this.rotation.fromCamera.y;

    const diffX = targetRotationX - this.instance.rotation.x;
    const diffY = targetRotationY - this.instance.rotation.y;

    this.instance.rotation.x += diffX * 0.02;
    this.instance.rotation.y += diffY * 0.02;
  }

  handleHoverIn() {
    const it = this;

    document.body.style.cursor = 'pointer';
    window.addEventListener('click', this.onCardClick);

    gsap.to(this.textContainerTop.position, {
      y: this.cardSizes.height * 0.5 + this.textContainerSizes.top.height * 0.5,
      overwrite: 'auto',
      onUpdate() {
        it.textContainerTop.set({
          fontOpacity: this.progress()
        });
      },
      delay: 0.2
    });

    gsap.to(this.textContainerBottom.position, {
      y: -(this.cardSizes.height * 0.5 + this.textContainerSizes.top.height * 0.5),
      overwrite: 'auto',
      onUpdate() {
        it.textContainerBottom.set({
          fontOpacity: this.progress()
        });
      },
      delay: 0.2
    });
  }

  handleHoverOut() {
    const it = this;

    document.body.style.cursor = '';
    window.removeEventListener('click', this.onCardClick);

    gsap.to(this.textContainerTop.position, {
      y: 0.8,
      overwrite: 'auto',
      onUpdate() {
        it.textContainerTop.set({
          fontOpacity: 1 - this.progress()
        });
      }
    });

    gsap.to(this.textContainerBottom.position, {
      y: -0.8,
      overwrite: 'auto',
      onUpdate() {
        it.textContainerBottom.set({
          fontOpacity: 1 - this.progress()
        });
      },
    });
  }

  setInteractionTimeout() {
    this.interactionEnabled = false;
    setTimeout(() => {
      this.interactionEnabled = true;
    }, 50);
  }

  update() {
    ThreeMeshUI.update();
    this.updateRotation();

    if (this.time.elapsed < 1000 || !this.interactionEnabled) return;

    this.raycaster.setFromCamera(this.mouse, this.camera.instance);
    const intersects = this.raycaster.intersectObjects(this.experience.world.projects.intersects);
    const intersectsObjects = intersects.map((intersect) => intersect.object);

    if ((intersectsObjects[0] === this.cardMesh) || (this.isHovered.current && intersectsObjects.length)) {
      const savedRotation = { ...this.instance.rotation };
      this.instance.lookAt(this.camera.instance.position);
      this.rotation.fromCamera.x = this.instance.rotation.x;
      this.rotation.fromCamera.y = this.instance.rotation.y;
      this.instance.rotation.copy(savedRotation);

      if (this.interactionTimeout) return;
      this.isHovered.current = true;
      if (this.isHovered.prev === false) {
        this.handleHoverIn();
        this.setInteractionTimeout();
      }
    } else {
      if (this.interactionTimeout) return;
      this.isHovered.current = false;
      this.rotation.fromCamera = { ...this.rotation.base };
      if (this.isHovered.prev === true) {
        this.handleHoverOut();
        this.setInteractionTimeout();
      }
    }

    this.isHovered.prev = this.isHovered.current;
  }
}