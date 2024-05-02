import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import html2canvas from 'html2canvas';

export default class FaceUtil {
    private readonly scene = new THREE.Scene()

    private readonly camera = new THREE.PerspectiveCamera(75,
        window.innerWidth / window.innerHeight, 0.1, 1000)

    private readonly renderer = new THREE.WebGLRenderer()

    private readonly controls = new OrbitControls(this.camera, this.renderer.domElement)

    private readonly loader = new GLTFLoader()

    private skeleton: THREE.SkeletonHelper | undefined

    private mesh: THREE.Object3D | undefined

    private isSpeaking = false

    private epsilon = 0

    private speechToText = new SpeechSynthesisUtterance();

    private listUp: number[] = []
    private listDown: number[] = []

    private static instance: FaceUtil | null = null
    public static getInstance(): FaceUtil {
        if (!FaceUtil.instance) {
            FaceUtil.instance = new FaceUtil();
        }
        return FaceUtil.instance;
    }

    constructor() {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        document.body.appendChild(this.renderer.domElement)

        this.loadModel()
        this.checkStatus()
        this.loadSpeechToText();
    }

    public speak(msg: string) {
        this.speechToText.text = msg;
        window.speechSynthesis.speak(this.speechToText);
        let infosub = document.getElementById("info");

        if(infosub != null){
            infosub.innerText = msg;
        }
    }

    private loadSpeechToText = () => {
        this.speechToText.lang = 'en-US';

        this.speechToText.rate = 0.7;

        this.speechToText.onstart = (event) => {
            this.isSpeaking = true;
        }

        this.speechToText.onend = (event) => {
            this.isSpeaking = false;

            this.epsilon = 0;
            this.moveMouth();
            let infosub = document.getElementById("info");

            if(infosub != null){
                infosub.innerText = "";
            }
        }
    }

    // todo: split / clean
    private loadModel() {
        this.loader.load('/assets/boner.glb', (gltf) => {
            let mixer

            this.mesh = gltf.scene
            //this.mesh.children[0].material = new THREE.MeshLambertMaterial();
            this.mesh.position.copy(this.camera.position)
            this.mesh.rotation.copy(this.camera.rotation)
            this.mesh.translateZ(-0.35)
            this.mesh.translateY(-1.3)
            this.mesh.updateMatrix()

            this.scene.add(this.mesh)

            this.skeleton = new THREE.SkeletonHelper(this.mesh)

            this.skeleton.visible = false
            this.scene.add(this.skeleton)

            const xAxis = new THREE.Vector3(1, 0, 0)

            // TODO: rm?
            const qInitial = new THREE.Quaternion().setFromAxisAngle(xAxis, 0)
            const qFinal = new THREE.Quaternion().setFromAxisAngle(xAxis, Math.PI)
            const quaternionKF = new THREE.QuaternionKeyframeTrack(this.skeleton.bones[42].name + '.quaternion',
                [0, 1, 2],
                [qInitial.x, qInitial.y, qInitial.z, qInitial.w, qFinal.x, qFinal.y, qFinal.z, qFinal.w, qInitial.x,
                    qInitial.y, qInitial.z, qInitial.w])
            const clip = new THREE.AnimationClip('Action', 3, [quaternionKF])

            mixer = new THREE.AnimationMixer(this.mesh)

            const clipAction = mixer.clipAction(clip)
            clipAction.play()
        }, undefined, (error) => {
            console.error(error)
        })

        this.animate = this.animate.bind(this)
    }

    private animate = () => {
        requestAnimationFrame(this.animate)

        if (this.isSpeaking) {
            this.moveMouth()
        }

        this.controls.update()
        this.render()
    }

    private render() {
        this.renderer.render(this.scene, this.camera)
    }

    private moveMouth = () => {
        if (!this.skeleton) return

        for (let i = 0; i < 8; i++) {
            this.skeleton.bones[i + 25].position.z = this.listUp[i] + Math.sin(this.epsilon) / 250
        }
        for (let i = 0; i < 3; i++) {
            this.skeleton.bones[i + 20].position.z = this.listDown[i] - Math.sin(this.epsilon) / 400
        }
        for (let i = 0; i < 2; i++) {
            this.skeleton.bones[i + 45].position.z = this.listUp[i + 8] + Math.sin(this.epsilon) / 290
        }

        if (this.epsilon >= Math.PI) {
            this.epsilon = 0
        }
        this.epsilon += 0.17
    }

    private setDefaultMouthPos = () => {
        if (!this.skeleton) return

        this.listUp = []
        this.listDown = []
        for (let i = 25; i < 33; i++) {
            this.listUp.push(this.skeleton.bones[i].position.z)
        }
        for (let i = 20; i < 23; i++) {
            this.listDown.push(this.skeleton.bones[i].position.z)
        }

        for (let i = 45; i < 47; i++) {
            this.listUp.push(this.skeleton.bones[i].position.z)
        }
    }

    private checkStatus = () => {
        if (this.mesh == undefined) {
            window.setTimeout(this.checkStatus, 100)
        } else {
            this.setDefaultMouthPos()
            this.animate()
        }
    }
}
