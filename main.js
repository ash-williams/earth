import './style.css'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import getStarfield from "./src/getStarField.js";
import { getFresnelMat } from "./src/getFresnalMat.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(w, window.h);


const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 100;
scene.add(earthGroup);

const moonGroup = new THREE.Group();
moonGroup.rotation.z = 1.5 * Math.PI / 100;
scene.add(moonGroup);

new OrbitControls(camera, renderer.domElement);

const detail = 12;
const loader = new THREE.TextureLoader();

//Moon
const moonGeometry = new THREE.IcosahedronGeometry(0.5, detail);

moonGroup.position.x -= 5;

const moonMaterial = new THREE.MeshPhongMaterial({
  map: loader.load("./textures/moon/moonmap4k.jpg"),
  bumpMap: loader.load("./textures/moon/moonbump4k.jpg"),
  bumpScale: 0.04,
})
const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
moonGroup.add(moonMesh);



//Earth
const geometry = new THREE.IcosahedronGeometry(1, detail);
const material = new THREE.MeshPhongMaterial({
  map: loader.load("./textures/earthmap1k.jpg"),
  specularMap: loader.load("./textures/earthspec1k.jpg"),
  bumpMap: loader.load("./textures/earthbump1k.jpg"),
  bumpScale: 0.04,
})
const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const lightsMat = new THREE.MeshBasicMaterial({
  map: loader.load("./textures/earthlights1k.jpg"),
  blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(geometry, lightsMat);
earthGroup.add(lightsMesh);

const cloudsMat = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/earthcloudmap.jpg"),
  transparent: true,
  opacity: 0.6,
  blending: THREE.AdditiveBlending,
  alphaMap: loader.load('./textures/earthcloudmaptrans.jpg'),
});
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.003);
earthGroup.add(cloudsMesh);

const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geometry, fresnelMat);
glowMesh.scale.setScalar(1.01);
earthGroup.add(glowMesh);

const stars = getStarfield({numStars: 2000});
scene.add(stars);

const sunLight = new THREE.DirectionalLight(0xffffff);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);


function animate() {
  requestAnimationFrame(animate);

  earthMesh.rotation.y += 0.002;
  lightsMesh.rotation.y += 0.002;
  cloudsMesh.rotation.y += 0.0023;
  glowMesh.rotation.y += 0.002;
  stars.rotation.y -= 0.0002;

  moonMesh.rotateY(0.02);


  renderer.render(scene, camera);
}

animate();

function handleWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);