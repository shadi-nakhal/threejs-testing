import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
function main() {
  const canvas = document.querySelector("#c");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const fov = 60;
  const aspect = 2; // the canvas default
  const near = 1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(45, 65, 0);
  // camera.up.set(0, 1, 0);
  // camera.lookAt(0, 0, 0);

  const scene = new THREE.Scene();

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  // controls.enablePan = false;

  controls.update();

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.x = 50;
  directionalLight.position.y = 50;
  directionalLight.position.z = 10;
  directionalLight.target.position.set(0, 0, 0);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 4096;
  directionalLight.shadow.mapSize.height = 4096;
  directionalLight.shadow.camera.left = -25;
  directionalLight.shadow.camera.right = 25;
  directionalLight.shadow.camera.top = 25;
  directionalLight.shadow.camera.bottom = -25;
  scene.add(directionalLight);

  const shadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
  scene.add(shadowHelper);

  // const helper = new THREE.DirectionalLightHelper(directionalLight, 5);
  // scene.add(helper);

  const objects = [];
  objects.push(directionalLight);

  const desertTexture = new THREE.TextureLoader().load("assets/desert.jpg");
  desertTexture.wrapS = THREE.RepeatWrapping;
  desertTexture.wrapT = THREE.RepeatWrapping;
  desertTexture.repeat.set(3, 3);
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: desertTexture,
    })
  );
  plane.castShadow = false;
  plane.receiveShadow = true;
  plane.rotation.x = -Math.PI / 2;

  scene.add(plane);

  const box = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshStandardMaterial({
      color: 0x943cec,
    })
  );
  box.position.set(0, 1, 0);
  box.castShadow = true;
  box.receiveShadow = true;
  scene.add(box);

  const objloader = new OBJLoader();
  const texture = new THREE.TextureLoader().load("assets/camo.jpg");
  objloader.load(
    "assets/T-34.obj",
    (object) => {
      object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.material.map = texture;
        }
      });
      object.scale.setScalar(0.02);
      object.position.set(10, 0, 0);

      scene.add(object);
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    function (error) {
      console.log(error);
    }
  );

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    objects.forEach((obj) => {
      obj.position.x = Math.sin(time * 0.7) * 20;
      obj.position.z = Math.sin(time * 0.7) * 20;
    });

    controls.update();
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
