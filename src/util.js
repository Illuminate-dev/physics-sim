import * as THREE from "three";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";

function newLine(x1, y1, x2, y2, color = 0xffffff) {
  let lineMaterial = new LineMaterial({
    color,
    linewidth: 2,
    alphaToCoverage: true,
  });

  let lineGeometry = new LineGeometry();
  lineGeometry.setPositions([
    x1, y1, 0,
    x2, y2, 0
  ]);

  return new Line2(lineGeometry, lineMaterial);
}

export { newLine }
