
import * as THREE from 'three';

export const generateConePoints = (count: number, height: number, radius: number) => {
  const points = [];
  for (let i = 0; i < count; i++) {
    const h = Math.random() * height;
    const r = (radius * (height - h)) / height;
    const theta = Math.random() * Math.PI * 2;
    points.push(new THREE.Vector3(
      Math.cos(theta) * r,
      h,
      Math.sin(theta) * r
    ));
  }
  return points;
};

export const generateSpiralPoints = (count: number, height: number, radius: number, turns: number) => {
  const points = [];
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const h = t * height;
    const r = (radius * (height - h)) / height;
    const theta = t * Math.PI * 2 * turns;
    points.push(new THREE.Vector3(
      Math.cos(theta) * r,
      h,
      Math.sin(theta) * r
    ));
  }
  return points;
};

export const generateNebulaPoints = (count: number, radius: number) => {
  const points = [];
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius + (Math.random() - 0.5) * 5;
    points.push(new THREE.Vector3(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    ));
  }
  return points;
};
