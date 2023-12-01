import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 2;
/*
document.addEventListener('mousemove', (e) => {
	cube.position.x = ((e.clientX - window.innerWidth / 2) / (window.innerWidth / 4));
	cube.position.y = ((e.clientY - window.innerHeight / 2) / (window.innerHeight / 3)) * -1;
});
*/

function animate() {
	requestAnimationFrame( animate );

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	cube.position.x = Math.cos(cube.rotation.x);
	cube.position.y = Math.sin(cube.position.y);

	renderer.render( scene, camera );
}

animate();