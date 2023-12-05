import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const loader = new GLTFLoader();

let doNUT;
let weired;

const light = new THREE.AmbientLight( 0xffffff ); // soft white light
scene.add( light );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

loader.load( './torusModel.glb', function ( gltf ) {
	doNUT = gltf.scene;
	scene.add(gltf.scene);

}, undefined, function ( error ) {
	alert("model not found");
} );

loader.load( './testCube.glb', function ( gltf ) {
	weired = gltf.scene;
	scene.add(gltf.scene);

}, undefined, function ( error ) {
	alert("model not found");
} );
/*
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

document.addEventListener('mousemove', (e) => {
	cube.position.x = ((e.clientX - window.innerWidth / 2) / (window.innerWidth / 4));
	cube.position.y = ((e.clientY - window.innerHeight / 2) / (window.innerHeight / 3)) * -1;
});
*/

camera.position.z = 2;



function animate() {
	requestAnimationFrame( animate );
	weired.position.z = -1;
	weired.rotation.x += 0.01;

	doNUT.rotation.x += 0.01;
	
	doNUT.rotation.z += 0.01;

	doNUT.position.x = Math.cos(doNUT.rotation.x);
	doNUT.position.y = Math.sin(doNUT.position.z);

	renderer.render( scene, camera );
}

animate();