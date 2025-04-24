import "./style.css";

import { Circuit, Component } from "./Circuit.js";

import * as THREE from "three";
import { MapControls } from "three/examples/jsm/Addons.js";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";

// setup

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

// set up label renderer
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(sceneWidth, sceneHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = "0px";
labelRenderer.domElement.style.left = (window.innerWidth - sceneWidth) + "px";
labelRenderer.domElement.style.pointerEvents = "none";
document.body.appendChild(labelRenderer.domElement);

camera.position.z = 5;

// map-like controls
const controls = new MapControls(camera, renderer.domElement);
controls.screenSpacePanning = true;
controls.mouseButtons.RIGHT = null;
controls.maxDistance = 20;


// create objects

const testCircuit = new Circuit();
const node1 = testCircuit.addNode(0, 2);
const node2 = testCircuit.addNode(2, 2);
const node3 = testCircuit.addNode(2, 0);
const node4 = testCircuit.addNode(0, 0);
node1.connect(node2, new Component());
node2.connect(node3, new Component());
node3.connect(node4);
node4.connect(node1);

{
  const grid = new THREE.GridHelper(100, 100, 0x888888);
  grid.rotation.x = Math.PI / 2;

  scene.add(grid);

  testCircuit.addToScene(scene);
}


// rendering
function animate() {
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

window.addEventListener("resize", setWindowSize);

function setWindowSize() {
  sceneWidth = Math.max(0.9 * window.innerWidth, window.innerWidth - 200);
  sceneHeight = window.innerHeight;
  renderer.setSize(sceneWidth, sceneHeight);

  labelRenderer.setSize(sceneWidth, sceneHeight);
  labelRenderer.domElement.style.left = (window.innerWidth - sceneWidth) + "px";

  camera.aspect = sceneWidth / sceneHeight;
  camera.updateProjectionMatrix();
}

// // Add button controlls pausing and playing
//
// document.getElementById("stop").addEventListener("click", () => {
//   paused = true;
// });
//
// document.getElementById("start").addEventListener("click", () => {
//   paused = false;
// });

// reset camera
document.getElementById("reset").addEventListener("click", () => {
  camera.position.set(0, 0, 5);
  controls.reset();
});
