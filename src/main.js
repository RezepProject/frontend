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



/*
let bonecount = 25;
let posOfSkel;
let count = 0;
*/

let listUp;
let listDown;
let epsylon = 0;

let isSpeaking = false;



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
	gltf.scene.position.z = 5;
	weired = gltf.scene;
	//scene.add(gltf.scene);
}, undefined, function ( error ) {
	console.log("model not found");
} );


camera.position.z = 7;

document.addEventListener('mousemove', (e) => {
    console.log(`Mouse X: ${e.clientX}, Mouse Y: ${e.clientY}`);
	skeleton.bones[3].rotation.y = e.clientX / 1000 - 1;
});


function animate() {
	requestAnimationFrame( animate );

	//weired.rotation.y += 0.01;
	//weired.position.z = 6.5;
	//weired.position.y = -1.3;
	//skeleton.bones[1].rotation.z += 0.02;
	//skeleton.bones[1].rotation.x += 0.02;
	mesh.position.y = -1.3;
	mesh.position.z = 6.5;

	if(isSpeaking){
		moveMouth();
	}

	

/*
	if(count > 60){
		count = 0;
		skeleton.bones[bonecount].position.y = posOfSkel;
		bonecount ++;
		console.log(bonecount);
		posOfSkel = skeleton.bones[bonecount].position.y;
	}

	skeleton.bones[bonecount].position.y += 0.03;
	count++;
*/
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
msg.lang = 'de-DE';
//msg.text = textOfMsg;
msg.text = "Ja Leute, unsere sprachausgabe funktioniert";
msg.rate = 2;
//msg.text = "die sprachausgabe funktioniert";

document.onclick = nod;

msg.onend = function (event) {
	epsylon = 0;
	isSpeaking = false;
	moveMouth();
};

function checkFlag() {
    if(mesh == undefined || weired == undefined) {
       window.setTimeout(checkFlag, 100);
    } else {
		weired.position.z = -3;
		setDefaultPos();
      animate();
    }
}

checkFlag();

async function nod(){
	window.speechSynthesis.speak(msg)
	isSpeaking = true;
	//skeleton.bones[3].rotation.x += 1;
	performance.now();
	let startTime = performance.now();
	for(let i = 0; i < Math.PI; i += 0.05){
		skeleton.bones[3].rotation.x = Math.sin(i) / 2;
		await new Promise(r => setTimeout(r, 1));
	}
	let endTime = performance.now();
	console.log(endTime - startTime);
}


function moveMouth(){
	for(let i = 0; i < 5; i++){
		skeleton.bones[i+25].position.z = listUp[i] + Math.sin(epsylon) / 250;
	}
	for(let i = 0; i < 5; i++){
		skeleton.bones[i+20].position.z = listDown[i] - Math.sin(epsylon) / 290;
	}
	if(epsylon >= Math.PI){
		epsylon = 0;
	}
	epsylon += 0.17;
}

function setDefaultPos(){
	listUp = [];
	listDown = [];
	for(let i = 25; i < 30; i++){
		listUp.push(skeleton.bones[i].position.z);
	}
	for(let i = 20; i < 25; i++){
		listDown.push(skeleton.bones[i].position.z);
	}
}



//FDF

const socket = new WebSocket('ws://localhost:3000');

const BUFFER_SIZE = 16000 * 10; // Für 10 Sekunde Audio bei 16kHz
let audioBuffer = [];

async function initAudio() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        const audioContext = new AudioContext();
        await audioContext.audioWorklet.addModule('audioProcessor.js');

        const source = audioContext.createMediaStreamSource(stream);
        const processorNode = new AudioWorkletNode(audioContext, 'audio-processor');

        processorNode.port.onmessage = event => {
            audioBuffer.push(...event.data);

            if (audioBuffer.length >= BUFFER_SIZE) {
                const wavData = convertToWavFormat(audioBuffer);
                socket.send(wavData);
                audioBuffer = []; // Reset the buffer
            }
        };
        source.connect(processorNode).connect(audioContext.destination);
    } catch (error) {
        console.error('MediaDevices.getUserMedia() error:', error);
    }
}


function convertToWavFormat(samples) {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    // Schreiben des WAV-Header
    writeString(view, 0, 'RIFF'); // ChunkID
    view.setUint32(4, 32 + samples.length * 2, true); // ChunkSize
    writeString(view, 8, 'WAVE'); // Format
    writeString(view, 12, 'fmt '); // Subchunk1ID
    view.setUint32(16, 16, true); // Subchunk1Size
    view.setUint16(20, 1, true); // AudioFormat
    view.setUint16(22, 1, true); // NumChannels
    view.setUint32(24, 44100, true); // SampleRate
    view.setUint32(28, 44100 * 2, true); // ByteRate
    view.setUint16(32, 2, true); // BlockAlign
    view.setUint16(34, 16, true); // BitsPerSample
    writeString(view, 36, 'data'); // Subchunk2ID
    view.setUint32(40, samples.length * 2, true); // Subchunk2Size

    // Schreiben der Samples
    floatTo16BitPCM(view, 44, samples);

    return new Blob([view], { type: 'audio/wav' });
}

function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

function floatTo16BitPCM(view, offset, input) {
    for (let i = 0; i < input.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, input[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
}


initAudio();