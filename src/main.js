import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { getAIResult } from './receiver';

document.getElementById("loadingScreen").hidden = true;

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
	console.log("model not found");
} );

loader.load( './testCube.glb', function ( gltf ) {
	gltf.scene.position.z = -1;
	weired = gltf.scene;
	scene.add(gltf.scene);

}, undefined, function ( error ) {
	console.log("model not found");
} );

camera.position.z = 2;


function animate() {
	requestAnimationFrame( animate );

	weired.rotation.x += 0.01;

	doNUT.rotation.x += 0.01;
	
	doNUT.rotation.z += 0.01;

	doNUT.position.x = Math.cos(doNUT.rotation.x);
	doNUT.position.y = Math.sin(doNUT.position.z);

	renderer.render( scene, camera );
}


var msg = new SpeechSynthesisUtterance();
let textOfMsg = await getAIResult("");
msg.text = textOfMsg;
console.log(textOfMsg);
//msg.text = "die sprachausgabe funktioniert";

document.onclick = () => window.speechSynthesis.speak(msg);

function checkFlag() {
    if(doNUT == undefined || weired == undefined) {
       window.setTimeout(checkFlag, 100);
    } else {
      animate();
    }
}

checkFlag();