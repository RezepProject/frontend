import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.3, 0.5);
scene.add(camera);

const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/examples/jsm/libs/draco/');
loader.setDRACOLoader(dracoLoader);

let mixer;
let aeouAction;
let idleAction;
let currentAnimationName = '';

function initAnimations(animations) {
    if (animations && animations.length) {
        const aeouAnimation = animations.find(clip => clip.name === 'AEOU');
        const idleAnimation = animations.find(clip => clip.name === 'Idle');

        if (aeouAnimation && idleAnimation) {
            mixer = new THREE.AnimationMixer(scene);
            aeouAction = mixer.clipAction(aeouAnimation);
            idleAction = mixer.clipAction(idleAnimation);
        } else {
            console.warn('AEOU or Idle animation not found in this GLTF model.');
        }
    } else {
        console.warn('No animations found in this GLTF model.');
    }
}

function update(deltaSeconds) {
    if (mixer) {
        mixer.update(deltaSeconds);
    }
}

function changeAnimation(animationName) {
    if (currentAnimationName !== animationName && mixer) {
        if (animationName === 'AEOU') {
            aeouAction.play();
            idleAction.stop();
            currentAnimationName = 'AEOU';
        } else if (animationName === 'Idle') {
            aeouAction.stop();
            idleAction.play();
            currentAnimationName = 'Idle';
        }
    }
}

function changeAnimationBasedOnCondition(condition) {
    if (condition === 'AEOU') {
        changeAnimation('AEOU');
    } else if (condition === 'Idle') {
        changeAnimation('Idle');
    } else {
        console.warn('Invalid condition:', condition);
    }
}

function playAnimationFromSampleText(text) {
    const conditions = text.trim().split(' ');
    let currentIndex = 0;
    playNextAnimation();

    function playNextAnimation() {
        if (currentIndex < conditions.length) {
            const condition = conditions[currentIndex];
            if (condition === 'AEOU' || condition === 'Idle') {
                changeAnimationBasedOnCondition(condition);
                const nextIndex = currentIndex + 1;
                setTimeout(() => {
                    playNextAnimation();
                }, aeouAction._clip.duration * 1000);
            } else {
                console.warn('Invalid condition:', condition);
                currentIndex++; // Skip to the next condition
                playNextAnimation(); // Play the next animation
            }
            currentIndex++;
        } else {
            stopAnimation();
        }
    }
    
    function stopAnimation() {
        mixer.stopAllAction();
    }
}


loader.load(
    'RigV003.gltf',
    function (gltf) {
        const model = gltf.scene;
        scene.add(model);
        const animations = gltf.animations;
        initAnimations(animations);
        const sampleText = 'AEOU x Idle  AEOU  AEOU  AEOU  AEOU  AEOU Idle Idle Idle AEOU Idle Idle Idle Idle AEOU';
        playAnimationFromSampleText(sampleText);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error('An error happened', error);
    }
);

function animate() {
    requestAnimationFrame(animate);
    const deltaSeconds = clock.getDelta();
    update(deltaSeconds);
    renderer.render(scene, camera);
}

const clock = new THREE.Clock();
animate();
