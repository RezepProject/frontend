import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { getAIResult } from './receiver';

document.getElementById("loadingScreen").hidden = true;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const loader = new GLTFLoader();

let mesh;
let weired;

let skeleton;

const light = new THREE.AmbientLight( 0xffffff );
scene.add( light );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

loader.load( './boner.glb', function ( gltf ) {
	mesh = gltf.scene;
	mesh.children[0].material = new THREE.MeshLambertMaterial();
	mesh.position.set(0,0,0);
	scene.add(mesh);

	skeleton = new THREE.SkeletonHelper( mesh );

	skeleton.visible = false;
	scene.add( skeleton );

	// create a keyframe track (i.e. a timed sequence of keyframes) for each animated property
	// Note: the keyframe track type should correspond to the type of the property being animated

	// POSITION
	var positionKF = new THREE.VectorKeyframeTrack( '.position', [ 0, 1, 2 ], [ 0, 0, 0, 30, 0, 0, 0, 0, 0 ] );

	// SCALE
	var scaleKF = new THREE.VectorKeyframeTrack( '.scale', [ 0, 1, 2 ], [ 1, 1, 1, 2, 2, 2, 1, 1, 1 ] );

	// ROTATION
	// Rotation should be performed using quaternions, using a THREE.QuaternionKeyframeTrack
	// Interpolating Euler angles (.rotation property) can be problematic and is currently not supported

	// set up rotation about x axis
	var xAxis = new THREE.Vector3( 1, 0, 0 );

	var qInitial = new THREE.Quaternion().setFromAxisAngle( xAxis, 0 );
	var qFinal = new THREE.Quaternion().setFromAxisAngle( xAxis, Math.PI );
	var quaternionKF = new THREE.QuaternionKeyframeTrack( '.quaternion', [ 0, 1, 2 ], [ qInitial.x, qInitial.y, qInitial.z, qInitial.w, qFinal.x, qFinal.y, qFinal.z, qFinal.w, qInitial.x, qInitial.y, qInitial.z, qInitial.w ] );

	// COLOR
	var colorKF = new THREE.ColorKeyframeTrack( '.material.color', [ 0, 1, 2 ], [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ], THREE.InterpolateDiscrete );

	// OPACITY
	var opacityKF = new THREE.NumberKeyframeTrack( '.material.opacity', [ 0, 1, 2 ], [ 1, 0, 1 ] );

	// create an animation sequence with the tracks
	// If a negative time value is passed, the duration will be calculated from the times of the passed tracks array
	var clip = new THREE.AnimationClip( 'Action', 3, [ scaleKF, positionKF, quaternionKF, colorKF, opacityKF ] );

	var xAxis = new THREE.Vector3( 1, 0, 0 );

	var qInitial = new THREE.Quaternion().setFromAxisAngle( xAxis, 0 );
	var qFinal = new THREE.Quaternion().setFromAxisAngle( xAxis, Math.PI );
	var quaternionKF = new THREE.QuaternionKeyframeTrack( skeleton.bones[42].name+'.quaternion', [ 0, 1, 2 ], [ qInitial.x, qInitial.y, qInitial.z, qInitial.w, qFinal.x, qFinal.y, qFinal.z, qFinal.w, qInitial.x, qInitial.y, qInitial.z, qInitial.w ] );
	var clip = new THREE.AnimationClip( 'Action', 3, [ quaternionKF ] );

	// setup the THREE.AnimationMixer
	mixer = new THREE.AnimationMixer( mesh );

	// create a ClipAction and set it to play
	var clipAction = mixer.clipAction( clip );
	clipAction.play();

	//

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

camera.position.z = 7;


function animate() {
	requestAnimationFrame( animate );

	weired.rotation.y += 0.01;
	skeleton.bones[1].rotation.z += 0.02;
	skeleton.bones[1].rotation.x += 0.02;

	/*
	doNUT.rotation.x += 0.01;
	
	doNUT.rotation.z += 0.01;

	doNUT.position.x = Math.cos(doNUT.rotation.x);
	doNUT.position.y = Math.sin(doNUT.position.z);
	*/

	renderer.render( scene, camera );
}


var msg = new SpeechSynthesisUtterance();
//let textOfMsg = await getAIResult("");
//msg.text = textOfMsg;
msg.text = "es funktioniert";
//msg.text = "die sprachausgabe funktioniert";

document.onclick = () => window.speechSynthesis.speak(msg);

function checkFlag() {
    if(mesh == undefined || weired == undefined) {
       window.setTimeout(checkFlag, 100);
    } else {
		weired.position.z = -3;
      animate();
    }
}

checkFlag();