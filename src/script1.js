

// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// const canvas = document.getElementById('three-canvas');
// const scene = new THREE.Scene();

// // Camera
// const camera = new THREE.PerspectiveCamera(
//   75,
//   canvas.clientWidth / canvas.clientHeight,
//   0.1,
//   1000
// );
// camera.position.z = 2;

// // Renderer
// const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
// renderer.setSize(canvas.clientWidth, canvas.clientHeight);
// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.shadowMap.enabled = true;

// // Resize Handling
// window.addEventListener('resize', () => {
//   camera.aspect = canvas.clientWidth / canvas.clientHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(canvas.clientWidth, canvas.clientHeight);
// });

// // Light
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
// scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// directionalLight.position.set(3, 5, 2);
// directionalLight.castShadow = true;
// scene.add(directionalLight);

// // Load GLB Model
// const loader = new GLTFLoader();
// let model;
// let scaleFactor = 1;

// loader.load('/models/space_ship.glb', (gltf) => {
//   model = gltf.scene;
//   model.traverse((child) => {
//     if (child.isMesh) {
//       child.castShadow = true;
//       child.receiveShadow = true;
//     }
//   });

//   scene.add(model);
//   centerAndFitModel(model);
// }, undefined, (error) => {
//   console.error('Error loading model:', error);
// });

// // Mouse Scroll Zoom (Scale Model)
// window.addEventListener('wheel', (event) => {
//   if (!model) return;

//   event.preventDefault();
//   const delta = event.deltaY;

//   if (delta > 0) {
//     scaleFactor *= 0.9; // Zoom out
//   } else {
//     scaleFactor *= 1.1; // Zoom in
//   }

//   scaleFactor = Math.min(Math.max(scaleFactor, 0.1), 10);
//   model.scale.set(scaleFactor, scaleFactor, scaleFactor);
// });

// // Animation Loop
// function animate() {
//   requestAnimationFrame(animate);

//   if (model) {
//     model.rotation.y += 0.005;
//   }

//   renderer.render(scene, camera);
// }
// animate();

// // Auto-center and fit model
// function centerAndFitModel(model) {
//   const box = new THREE.Box3().setFromObject(model);
//   const size = new THREE.Vector3();
//   const center = new THREE.Vector3();
//   box.getSize(size);
//   box.getCenter(center);

//   model.position.sub(center); // Center model at origin

//   const maxDim = Math.max(size.x, size.y, size.z);
//   const scale = 1.5 / maxDim;
//   model.scale.set(scale, scale, scale);
//   scaleFactor = scale;
// }










import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const canvas = document.getElementById('three-canvas');
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  1000
);
camera.position.z = 2;

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;

// Resize Handling
window.addEventListener('resize', () => {
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
});

// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(3, 5, 2);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Load Model
const loader = new GLTFLoader();
let model;
let scaleFactor = 1;

loader.load('/models/space_ship.glb', (gltf) => {
  model = gltf.scene;

  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  centerAndFitModel(model);
  scene.add(model);
}, undefined, (error) => {
  console.error('Error loading model:', error);
});

// Mouse Zoom (scale)
canvas.addEventListener('wheel', (event) => {
  if (!model) return;
  event.preventDefault();

  const delta = event.deltaY;
  if (delta > 0) {
    scaleFactor *= 0.9;
  } else {
    scaleFactor *= 1.1;
  }

  scaleFactor = Math.min(Math.max(scaleFactor, 0.1), 10);
  model.scale.set(scaleFactor, scaleFactor, scaleFactor);
}, { passive: false }); // <- Important to disable page scroll

// Stop scroll bubbling when hovering over canvas
canvas.addEventListener('mouseenter', () => {
  window.addEventListener('wheel', preventScroll, { passive: false });
});
canvas.addEventListener('mouseleave', () => {
  window.removeEventListener('wheel', preventScroll);
});
function preventScroll(e) {
  e.preventDefault();
}

// Model rotation with click-drag
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

canvas.addEventListener('mousedown', (e) => {
  if (e.button === 0) isDragging = true;
});
canvas.addEventListener('mouseup', () => {
  isDragging = false;
});
canvas.addEventListener('mousemove', (e) => {
  if (!isDragging || !model) return;

  const deltaMove = {
    x: e.offsetX - previousMousePosition.x,
    y: e.offsetY - previousMousePosition.y,
  };

  model.rotation.y += deltaMove.x * 0.01;
  model.rotation.x += deltaMove.y * 0.01;

  previousMousePosition = {
    x: e.offsetX,
    y: e.offsetY,
  };
});
canvas.addEventListener('mouseleave', () => {
  isDragging = false;
});

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Auto-center and fit model
function centerAndFitModel(model) {
  const box = new THREE.Box3().setFromObject(model);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  model.position.sub(center);
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = 1.5 / maxDim;
  model.scale.set(scale, scale, scale);
  scaleFactor = scale;
}
