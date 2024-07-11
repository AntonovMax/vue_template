import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

class ThreeJSController {
  init() {
    // Создаем сцену
    var scene = new THREE.Scene();
    var gui = new GUI();

    // Создаем камеру
    var camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 10, 10);
    camera.lookAt(0, 0, 0);

    // Создаем рендерер
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    window.onresize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const controls = new OrbitControls(camera, renderer.domElement);
    const textureLoader = new THREE.TextureLoader();

    // педестал
    const pedestalMap = textureLoader.load(
      "textures/pedestal_map.jpg"
    );
    const pedestalRough = textureLoader.load(
      "textures/pedestal_rough.jpg"
    );
    const cylinderGeometry = new THREE.CylinderGeometry(10, 10.5, 1, 64);
    const cylinderMaterial = new THREE.MeshStandardMaterial({
      map: pedestalMap,
      roughnessMap: pedestalRough,
      metalness: 0.7,
    });
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.position.set(0, -7, 0);
    cylinder.receiveShadow = true;
    scene.add(cylinder);

    // зеркало
    var circleGeometry = new THREE.CircleGeometry(7, 32);
    var circleMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      metalness: 1.0,
      roughness: 0.0,
      side: THREE.DoubleSide
    });
    var circle = new THREE.Mesh(circleGeometry, circleMaterial);
    circle.position.set(0, 2, -4);
    circle.receiveShadow = true
    circle.castShadow = true
    scene.add(circle);

    // дверь
    let door;
    const doorScale = { scale: 0 };
    const gltfLoader = new GLTFLoader();

    const diff = textureLoader.load(
      "textures/wood_table_001_diff_4k.jpg"
    );
    diff.wrapS = THREE.RepeatWrapping;
    diff.wrapT = THREE.RepeatWrapping;
    diff.repeat.set(4, 4);

    const roughness = textureLoader.load(
      "textures/wood_table_001_rough_4k.jpg"
    );
    roughness.wrapS = THREE.RepeatWrapping;
    roughness.wrapT = THREE.RepeatWrapping;
    roughness.repeat.set(4, 4);

    gltfLoader.load("door.glb", (model) => {
      const geometry = model.scene.children[0].geometry;
      const material = new THREE.MeshStandardMaterial({
        map: diff,
        roughnessMap: roughness,
      });
      door = new THREE.Mesh(geometry, material);
      door.position.set(0, -5.5, 0)
      door.receiveShadow = false;
      door.castShadow = true;
      scene.add(door);
      gui
        .add(doorScale, "scale", 1, 2)
        .step(0.01)
        .name("DOOR SCALE")
        .onChange((v) => {
          door.scale.set(v, v, v);
          door.updateMatrix();
        });
    });

    // окружение
    const hdriLoader = new RGBELoader();
    hdriLoader.load("environment.hdr", function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      scene.environment = texture;
    });

    //свет
    const dirLight = new THREE.DirectionalLight(0xff0000, 1);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(-2, 10, 5);
    dirLight.scale.multiplyScalar(2)
    scene.add(dirLight);

    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    dirLight.shadow.mapSize.width = 512;
    dirLight.shadow.mapSize.height = 512;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 500;

    // const helper = new THREE.DirectionalLightHelper( dirLight, 5 );
    // scene.add( helper );


    // Создаем функцию анимации
    function animate() {
      requestAnimationFrame(animate);

      controls.update();
      // Рендерим сцену
      renderer.render(scene, camera);
    }

    // Запускаем анимацию
    animate();
  }
}

export default ThreeJSController;
