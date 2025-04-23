import "./style.css";

import * as THREE from "three";
import { MapControls } from "three/examples/jsm/Addons.js";

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

camera.position.z = 5;

// map-like controls
const controls = new MapControls(camera, renderer.domElement);
controls.screenSpacePanning = true;
controls.mouseButtons.RIGHT = null;


// create objects

const circle = new THREE.Shape();
circle.absarc(0, 0, 2);

const geometry = new THREE.ShapeGeometry(circle, 100);

const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
  depthWrite: false
});

const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);




function animate() {


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
