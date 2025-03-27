import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let paused = false;

let sceneWidth = Math.max(0.9 * window.innerWidth, window.innerWidth - 200);
let sceneHeight = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  sceneWidth / sceneHeight,
  0.1,
  1000,
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(sceneWidth, sceneHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// controls
let controls = new OrbitControls(camera, renderer.domElement);
controls.listenToKeyEvents(window);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate() {
  if (!paused) {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
}

window.addEventListener("resize", setWindowSize);

function setWindowSize() {
  sceneWidth = Math.max(0.9 * window.innerWidth, window.innerWidth - 200);
  sceneHeight = window.innerHeight;
  renderer.setSize(sceneWidth, sceneHeight);
  camera.aspect = sceneWidth / sceneHeight;
  camera.updateProjectionMatrix();
}

// Add button controlls pausing and playing

document.getElementById("stop").addEventListener("click", () => {
  paused = true;
});

document.getElementById("start").addEventListener("click", () => {
  paused = false;
});
