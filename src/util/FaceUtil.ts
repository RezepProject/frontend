import * as THREE from "../../node_modules/three/build/three.module.js";
import {GLTFLoader} from '../../node_modules/three/examples/jsm/loaders/GLTFLoader';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const loader = new GLTFLoader();
const renderer = new THREE.WebGLRenderer();


let mesh;
let weired;
let skeleton;
let textlist;
let listUp;
let listDown;
let epsylon = 0;
let isSpeaking = false;
let msg;

// TODO; replace / rm
const speakingText = "honestly, the text to speech just sounds way better in english";

export function initFace() {

    document.getElementById("loadingScreen").hidden = true;
    splitSpeakingText();

    scene.add(new THREE.AmbientLight(0xffffff));

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    loader.load('src/resource/boner.glb', function (gltf) {
        mesh = gltf.scene;
        mesh.children[0].material = new THREE.MeshLambertMaterial();
        mesh.position.set(0, 0, 0);
        scene.add(mesh);

        skeleton = new THREE.SkeletonHelper(mesh);

        skeleton.visible = false;
        scene.add(skeleton);

        // create a keyframe track (i.e. a timed sequence of keyframes) for each animated property
        // Note: the keyframe track type should correspond to the type of the property being animated

        // POSITION
        var positionKF = new THREE.VectorKeyframeTrack('.position', [0, 1, 2], [0, 0, 0, 30, 0, 0, 0, 0, 0]);

        // SCALE
        var scaleKF = new THREE.VectorKeyframeTrack('.scale', [0, 1, 2], [1, 1, 1, 2, 2, 2, 1, 1, 1]);

        // ROTATION
        // Rotation should be performed using quaternions, using a THREE.QuaternionKeyframeTrack
        // Interpolating Euler angles (.rotation property) can be problematic and is currently not supported

        // set up rotation about x axis
        var xAxis = new THREE.Vector3(1, 0, 0);

        var qInitial = new THREE.Quaternion().setFromAxisAngle(xAxis, 0);
        var qFinal = new THREE.Quaternion().setFromAxisAngle(xAxis, Math.PI);
        var quaternionKF = new THREE.QuaternionKeyframeTrack('.quaternion', [0, 1, 2], [qInitial.x, qInitial.y, qInitial.z, qInitial.w, qFinal.x, qFinal.y, qFinal.z, qFinal.w, qInitial.x, qInitial.y, qInitial.z, qInitial.w]);

        // COLOR
        var colorKF = new THREE.ColorKeyframeTrack('.material.color', [0, 1, 2], [1, 0, 0, 0, 1, 0, 0, 0, 1], THREE.InterpolateDiscrete);

        // OPACITY
        var opacityKF = new THREE.NumberKeyframeTrack('.material.opacity', [0, 1, 2], [1, 0, 1]);

        // create an animation sequence with the tracks
        // If a negative time value is passed, the duration will be calculated from the times of the passed tracks array
        var clip = new THREE.AnimationClip('Action', 3, [scaleKF, positionKF, quaternionKF, colorKF, opacityKF]);

        var xAxis = new THREE.Vector3(1, 0, 0);

        var qInitial = new THREE.Quaternion().setFromAxisAngle(xAxis, 0);
        var qFinal = new THREE.Quaternion().setFromAxisAngle(xAxis, Math.PI);
        var quaternionKF = new THREE.QuaternionKeyframeTrack(skeleton.bones[42].name + '.quaternion', [0, 1, 2], [qInitial.x, qInitial.y, qInitial.z, qInitial.w, qFinal.x, qFinal.y, qFinal.z, qFinal.w, qInitial.x, qInitial.y, qInitial.z, qInitial.w]);
        var clip = new THREE.AnimationClip('Action', 3, [quaternionKF]);

        // setup the THREE.AnimationMixer
        // create a ClipAction and set it to play
        var clipAction = (new THREE.AnimationMixer(mesh)).clipAction(clip);
        clipAction.play();

    }, undefined, function (error) {
        console.log("model not found");
        console.error(error);
    });

    camera.position.z = 7;

    document.addEventListener('mousemove', (e) => {
        console.log(`Mouse X: ${e.clientX}, Mouse Y: ${e.clientY}`);
        skeleton.bones[3].rotation.y = e.clientX / 1000 - 1;
    });

    msg = new SpeechSynthesisUtterance();
//let textOfMsg = await getAIResult("");
    msg.lang = 'en-US';
//msg.text = textOfMsg;
    msg.text = textlist[0];
    console.log(textlist);
    msg.rate = 1;

//msg.text = "die sprachausgabe funktioniert";

    document.onclick = nod;

    msg.onend = function (event) {
        epsylon = 0;
        isSpeaking = false;
        moveMouth();
    };

    checkFlag();
}

function splitSpeakingText() {
    let tmpTxt;
    for (let i = 0; i < speakingText.split(' ').length / 4; i++) {
        tmpTxt = "";
        for (let n = 0; n < 4; n++) {
            tmpTxt += speakingText.split(' ')[n + i * 4];
        }
        textlist = tmpTxt;
    }
}

function animate() {
    requestAnimationFrame(animate);

    //weired.rotation.y += 0.01;
    //weired.position.z = 6.5;
    //weired.position.y = -1.3;
    //skeleton.bones[1].rotation.z += 0.02;
    //skeleton.bones[1].rotation.x += 0.02;
    mesh.position.y = -1.3;
    mesh.position.z = 6.5;

    if (isSpeaking) {
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

    renderer.render(scene, camera);
}

function checkFlag() {
    if (mesh == undefined || weired == undefined) {
        window.setTimeout(checkFlag, 100);
    } else {
        weired.position.z = -3;
        setDefaultPos();
        animate();
    }
}

async function nod() {
    window.speechSynthesis.speak(msg)
    isSpeaking = true;
    //skeleton.bones[3].rotation.x += 1;
    performance.now();
    let startTime = performance.now();
    for (let i = 0; i < Math.PI; i += 0.05) {
        skeleton.bones[3].rotation.x = Math.sin(i) / 2;
        await new Promise(r => setTimeout(r, 1));
    }
    let endTime = performance.now();
    console.log(endTime - startTime);
}


function moveMouth() {
    for (let i = 0; i < 8; i++) {
        skeleton.bones[i + 25].position.z = listUp[i] + Math.sin(epsylon) / 250;
    }
    for (let i = 0; i < 3; i++) {
        skeleton.bones[i + 20].position.z = listDown[i] - Math.sin(epsylon) / 400;
    }
    for (let i = 0; i < 2; i++) {
        skeleton.bones[i + 45].position.z = listUp[i + 8] + Math.sin(epsylon) / 290;
    }/*
	for(let i = 0; i < 5; i++){
		skeleton.bones[i+15].position.z = listDown[i+5] - Math.sin(epsylon) / 290;
	}*/
    if (epsylon >= Math.PI) {
        epsylon = 0;
    }
    epsylon += 0.17;
}

function setDefaultPos() {
    listUp = [];
    listDown = [];
    for (let i = 25; i < 33; i++) {
        listUp.push(skeleton.bones[i].position.z);
    }
    for (let i = 20; i < 23; i++) {
        listDown.push(skeleton.bones[i].position.z);
    }

    for (let i = 45; i < 47; i++) {
        listUp.push(skeleton.bones[i].position.z);
    }/*
	for(let i = 15; i < 20; i++){
		listDown.push(skeleton.bones[i].position.z);
	}
	*/
}