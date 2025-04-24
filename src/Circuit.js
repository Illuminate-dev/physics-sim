import * as THREE from "three";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

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
  constructor() {
  }

  addToScene(scene, nodeIn, nodeOut) {
    // draw label in html

    const offset = 0.1;
    const length = Math.sqrt((nodeIn.x - nodeOut.x) ** 2 + (nodeIn.y - nodeOut.y) ** 2);
    let x = (nodeIn.x + nodeOut.x) / 2 - offset * (nodeOut.y - nodeIn.y) / length;
    let y = (nodeIn.y + nodeOut.y) / 2 + offset * (nodeOut.x - nodeIn.x) / length;

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
    labelDiv.textContent = "C";

    const labelObject = new CSS2DObject(labelDiv);
    labelObject.position.set(
      x, y, 0
    );

    console.log(labelObject.position);
    scene.add(labelObject);

  }
}

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
        let lineMaterial = new LineMaterial({
          color: 'white',
          linewidth: 2,
          alphaToCoverage: true,
        });

        let lineGeometry = new LineGeometry();
        lineGeometry.setPositions([
          node.x, node.y, 0,
          nodeOut.x, nodeOut.y, 0
        ]);

        let line = new Line2(lineGeometry, lineMaterial);
        scene.add(line);

        // draw components
        for (let k = 0; k < components.length; k++) {
          let component = components[k];
          component.addToScene(scene, node, nodeOut);
        }
      }
    }
  }
}


export { Component, Circuit }
