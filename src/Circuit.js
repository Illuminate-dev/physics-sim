import * as THREE from "three";
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { newLine } from "./util";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";

const top = 0;
const left = Math.min(window.innerWidth * 0.1, 200);

class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.forwardConnections = [];
  }

  connect(nodeOut, ...components) {
    this.forwardConnections.push({ nodeOut, components });
  }
}

class Component {
  static WIDTH = 0.2;
  static LABEL_OFFSET = 0.25;

  constructor() {
  }

  getText() {
    return "X";
  }

  addToScene(scene, start, end) {
    // draw label in html

    const length = Math.sqrt((start.x - end.x) ** 2 + (start.y - end.y) ** 2);
    let x = (start.x + end.x) / 2 - Component.LABEL_OFFSET * (end.y - start.y) / length;
    let y = (start.y + end.y) / 2 + Component.LABEL_OFFSET * (end.x - start.x) / length;

    // const coords = new THREE.Vector3(x, y, 0).project(camera);

    // const label = document.createElement("div");
    // label.style.position = 'absolute';
    // label.style.zIndex = 1;
    // label.style.width = 100;
    // label.style.height = 100;
    // label.innerHTML = "Component";
    // label.style.color = 'white';
    // label.style.top = (top + coords.y) + 'px';
    // label.style.left = (left + x) + 'px';
    // document.body.appendChild(label);

    const labelDiv = document.createElement("div");
    labelDiv.className = "label";
    labelDiv.textContent = this.getText();

    const labelObject = new CSS2DObject(labelDiv);
    labelObject.position.set(
      x, y, 0
    );

    scene.add(labelObject);

  }
}

// capacitors
class Capacitor extends Component {
  static PLATE_HEIGHT = 0.2;

  constructor(capacitance) {
    super();
    this.c = capacitance;
  }

  getText() {
    return "C=" + this.c + " C";
  }

  addToScene(scene, start, end) {
    super.addToScene(scene, start, end);

    // draw the capacitor
    // it's just two lines

    const capObj = capPlates.clone(true);

    capObj.position.x = (start.x + end.x) / 2;
    capObj.position.y = (start.y + end.y) / 2;

    // rotate the capacitor to the line
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx);
    capObj.rotation.z = angle;

    // add the capacitor to the scene
    scene.add(capObj);
  }

}

// create the capacitor plates to clone and rotate later
const capGeo = new LineGeometry();
capGeo.setPositions([0, -Capacitor.PLATE_HEIGHT / 2, 0, 0, Capacitor.PLATE_HEIGHT / 2, 0])

const capMat = new LineMaterial({ color: 0xffffff, linewidth: 2, alphaToCoverage: true });
const plate = new Line2(capGeo, capMat);
plate.computeLineDistances();
plate.scale.set(1, 1, 1);

const capPlates = new THREE.Group();
const plate2 = plate.clone();
capPlates.add(plate, plate2);
plate.position.x = -Component.WIDTH / 2;
plate2.position.x = Component.WIDTH / 2;

// create node circle
const circle = new THREE.Shape();
const radius = 0.05;
circle.absarc(0, 0, radius);

const segments = 100;
const circleGeometry = new THREE.ShapeGeometry(circle, segments / 2);

const circleMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
  depthWrite: false
});

const circleMesh = new THREE.Mesh(circleGeometry, circleMaterial);



class Circuit {
  constructor() {
    this.nodes = [];
  }

  addNode(x, y) {
    this.nodes.push(new Node(x, y));
    return this.nodes[this.nodes.length - 1];
  }

  addToScene(scene) {

    for (let i = 0; i < this.nodes.length; i++) {
      let node = this.nodes[i];
      // draw node circle
      let newMesh = circleMesh.clone();
      newMesh.position.x = node.x;
      newMesh.position.y = node.y;
      scene.add(newMesh)

      // draw connections
      for (let j = 0; j < node.forwardConnections.length; j++) {
        let { nodeOut, components } = node.forwardConnections[j];

        // draw line in segments, so that we can add the components too
        // ideally like this
        // |—gap—|—comp1—|—gap—|—comp2—|—gap—|

        // calculate the offset
        const dx = nodeOut.x - node.x;
        const dy = nodeOut.y - node.y;
        const length = Math.sqrt(dx ** 2 + dy ** 2);

        const gap = (length - components.length * Component.WIDTH) / (components.length + 1);

        // unit direction from node to offset
        const ux = dx / length;
        const uy = dy / length;

        // point t units along the line
        function pointAt(t) {
          return {
            x: node.x + ux * t,
            y: node.y + uy * t
          };
        }

        let t = 0;

        const a = pointAt(t);
        const b = pointAt(t + gap);
        scene.add(newLine(a.x, a.y, b.x, b.y));
        t += gap

        // draw components
        for (let k = 0; k < components.length; k++) {

          const start = pointAt(t);
          const end = pointAt(t + Component.WIDTH);

          // draw the component
          components[k].addToScene(scene, start, end);

          t += Component.WIDTH;

          // draw the next line segment
          const nextPoint = pointAt(t + gap);
          scene.add(newLine(end.x, end.y, nextPoint.x, nextPoint.y));
          t += gap;
        }
      }
    }
  }
}


export { Component, Circuit, Capacitor }
