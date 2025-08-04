import React, { useMemo } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";

// Convert polygonSegments (edges) to 2D polygon coordinates
const to2D = (segments) => segments.map(([a]) => [a[0], a[2]]);

function pointInPolygon(point, polygon) {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];

    const intersect =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi + Number.EPSILON) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function getPolygonBounds(polygon) {
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  for (const [x, y] of polygon) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  return { minX, maxX, minY, maxY };
}

function rotatePoint([x, y], angleRad, origin = [0, 0]) {
  const dx = x - origin[0];
  const dy = y - origin[1];
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  return [origin[0] + dx * cos - dy * sin, origin[1] + dx * sin + dy * cos];
}

function generateZigZagInfill(polygon2D, spacing, angle) {
  const bounds = getPolygonBounds(polygon2D);
  const center = [
    (bounds.minX + bounds.maxX) / 2,
    (bounds.minY + bounds.maxY) / 2,
  ];

  const angleRad = (angle * Math.PI) / 180;
  const diag = Math.hypot(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);

  const infillLines = [];

  for (let offset = -diag; offset < diag; offset += spacing) {
    const p1 = rotatePoint([-diag, offset], angleRad, center);
    const p2 = rotatePoint([diag, offset], angleRad, center);

    const line = new THREE.Line3(
      new THREE.Vector3(p1[0], 0, p1[1]),
      new THREE.Vector3(p2[0], 0, p2[1])
    );

    const step = 0.2;
    const steps = Math.floor(line.distance() / step);
    const segment = [];

    let inside = false;
    for (let i = 0; i <= steps; i++) {
      const pt = new THREE.Vector3();
      line.at(i / steps, pt);
      const point2D = [pt.x, pt.z];

      const isInside = pointInPolygon(point2D, polygon2D);

      if (isInside) {
        segment.push([pt.x, pt.z]);
        inside = true;
      } else if (inside && segment.length > 1) {
        infillLines.push([...segment]);
        segment.length = 0;
        inside = false;
      } else {
        segment.length = 0;
      }
    }

    if (segment.length > 1) {
      infillLines.push(segment);
    }
  }

  return infillLines;
}

const AlignedZigZagInfill = ({ polygonSegments, spacing = 1, angle = 45 }) => {
  const polygon2D = useMemo(() => to2D(polygonSegments), [polygonSegments]);

  const zigzagLines = useMemo(() => {
    return generateZigZagInfill(polygon2D, spacing, angle);
  }, [polygon2D, spacing, angle]);

  return (
    <>
      {/* Infill Lines */}
      {zigzagLines.map((points, i) => (
        <Line
          key={i}
          points={points.map(([x, z]) => [x, 15, z])}
          color="purple"
          lineWidth={1}
        />
      ))}
    </>
  );
};

export default AlignedZigZagInfill;
