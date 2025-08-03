import * as THREE from "three";
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { newLine } from "./util";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";

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

const compMat = new LineMaterial({ color: 0xffffff, linewidth: 2, alphaToCoverage: true });

class Component {
  static WIDTH = 0.2;
  static MAX_HEIGHT = 0.13;
  static LABEL_OFFSET = 0.4;

  constructor() {
    this.labelObject = null;
  }

  getText() {
    return "X";
  }

  addToScene(scene, start, end) {
    // draw label in html

    const length = Math.sqrt((start.x - end.x) ** 2 + (start.y - end.y) ** 2);
    let x = (start.x + end.x) / 2 - Component.LABEL_OFFSET * (end.y - start.y) / length;
    let y = (start.y + end.y) / 2 + 0.5 * Component.LABEL_OFFSET * (end.x - start.x) / length;

    const labelDiv = document.createElement("div");
    labelDiv.className = "label";
    labelDiv.textContent = this.getText();

    const labelObject = new CSS2DObject(labelDiv);
    labelObject.position.set(
      x, y, 0
    );

    scene.add(labelObject);

    this.labelObject = labelObject;
  }

  animate(controls) {
    if (this.labelObject) {
      // scale the label object based on zoom
      const scale = 5 / (controls.getDistance());
      this.labelObject.element.style.transform += `scale(${scale})`;
    }
  }
}

// resistors

// three Vs but kinda offset
const resGeo = new LineGeometry();
resGeo.setPositions([-Component.WIDTH / 2, 0, 0, -Component.WIDTH * (5 / 12), Component.MAX_HEIGHT / 2, 0,
-Component.WIDTH * (3 / 12), -Component.MAX_HEIGHT / 2, 0, -Component.WIDTH * (1 / 12), Component.MAX_HEIGHT / 2, 0,
Component.WIDTH * (1 / 12), -Component.MAX_HEIGHT / 2, 0, Component.WIDTH * (3 / 12), Component.MAX_HEIGHT / 2, 0,
Component.WIDTH * (5 / 12), -Component.MAX_HEIGHT / 2, 0, Component.WIDTH / 2, 0, 0]);

const resLine = new Line2(resGeo, compMat);
resLine.computeLineDistances();
resLine.scale.set(1, 1, 1);

class Resistor extends Component {
  constructor(resistance) {
    super();
    this.r = resistance;
  }

  getText() {
    return "R=" + this.r + " Ω";
  }

  addToScene(scene, start, end) {
    super.addToScene(scene, start, end);

    // draw the resistor
    // it's just a zigzag line

    const resObj = resLine.clone(true);

    resObj.position.x = (start.x + end.x) / 2;
    resObj.position.y = (start.y + end.y) / 2;
    resObj.renderOrder = 1;

    // rotate the resistor to the line
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx);
    resObj.rotation.z = angle;

    // add the resistor to the scene
    scene.add(resObj);
  }
}


// capacitors

// create the capacitor plates to clone and rotate later
const capGeo = new LineGeometry();
capGeo.setPositions([0, -Component.MAX_HEIGHT / 2, 0, 0, Component.MAX_HEIGHT / 2, 0])

const plate = new Line2(capGeo, compMat);
plate.computeLineDistances();
plate.scale.set(1, 1, 1);

const capPlates = new THREE.Group();
const plate2 = plate.clone();
capPlates.add(plate, plate2);
plate.position.x = -Component.WIDTH / 2;
plate2.position.x = Component.WIDTH / 2;

class Capacitor extends Component {
  constructor(capacitance) {
    super();
    this.c = capacitance;
  }

  getText() {
    return "C=" + this.c + " F";
  }

  addToScene(scene, start, end) {
    super.addToScene(scene, start, end);

    // draw the capacitor
    // it's just two lines

    const capObj = capPlates.clone(true);

    capObj.position.x = (start.x + end.x) / 2;
    capObj.position.y = (start.y + end.y) / 2;
    capObj.renderOrder = 1;

    // rotate the capacitor to the line
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx);
    capObj.rotation.z = angle;

    // add the capacitor to the scene
    scene.add(capObj);
  }

}

// resistors

// three Vs but kinda offset

const batGeo = new LineGeometry();
batGeo.setPositions([0, -Component.MAX_HEIGHT / 2, 0, 0, Component.MAX_HEIGHT / 2, 0])

const batLine = new Line2(capGeo, compMat);
batLine.computeLineDistances();
batLine.scale.set(1, 1, 1);

const batLines = new THREE.Group();
const batLine2 = batLine.clone();
const batLine3 = batLine.clone();
const batLine4 = batLine.clone();
batLines.add(batLine, batLine2, batLine3, batLine4);
batLine.position.x = -Component.WIDTH / 2;
batLine2.position.x = -Component.WIDTH * (1 / 6);
batLine3.position.x = Component.WIDTH * (1 / 6);
batLine4.position.x = Component.WIDTH / 2;

batLine2.scale.set(1, 0.5, 1);
batLine4.scale.set(1, 0.5, 1);


class Battery extends Component {
  constructor(voltage) {
    super();
    this.v = voltage;
  }

  getText() {
    return "V=" + this.v + " V";
  }

  addToScene(scene, start, end) {
    super.addToScene(scene, start, end);

    // draw the resistor
    // it's just a zigzag line

    const batObj = batLines.clone(true);

    batObj.position.x = (start.x + end.x) / 2;
    batObj.position.y = (start.y + end.y) / 2;
    batObj.renderOrder = 1;

    // rotate the resistor to the line
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx);
    batObj.rotation.z = angle;

    // add the resistor to the scene
    scene.add(batObj);
  }
}


// create node circle
const circle = new THREE.Shape();
const radius = 0.03;
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
      newMesh.renderOrder = 1; // Render nodes after grid
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

  animate(controls) {
    for (let i = 0; i < this.nodes.length; i++) {
      let node = this.nodes[i];
      for (let j = 0; j < node.forwardConnections.length; j++) {
        let { components } = node.forwardConnections[j];
        for (let k = 0; k < components.length; k++) {
          components[k].animate(controls);
        }
      }
    }
  }
}


export { Component, Circuit, Capacitor, Resistor, Battery }
