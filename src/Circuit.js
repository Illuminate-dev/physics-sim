import * as THREE from "three";

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

      }
    }
  }
}


export { Component, Circuit }
