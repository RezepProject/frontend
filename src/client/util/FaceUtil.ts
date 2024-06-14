import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import html2canvas from 'html2canvas';
import { chatMessages } from './chatUtil'

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

    public speakingLanguage = "de-DE";
    public talkingSpeed = 0.7;

    private epsilon = 0

    private targetX = 0;
    private turningSpeed = 0.005;

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
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.loadModel();
        this.checkStatus();
        this.loadSpeechToText();
    }

    public speak(msg: string, from : "receiver" | "sender") {
        chatMessages.push({ messageContent: msg, from: from})

        this.speechToText.text = msg;
        window.speechSynthesis.speak(this.speechToText);
        let infosub = document.getElementById("info");
      
        if(!this.isSpeaking){
            this.isSpeaking = true;

            this.speechToText = new SpeechSynthesisUtterance();
            console.log("SpeechSynthesisUtterance");

            this.loadSpeechToText();
            console.log("load speechToText");

            this.speechToText.text = msg;

            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(this.speechToText);

            let infosub = document.getElementById("info");
            this.isSpeaking = true;

            if(infosub != null){
                infosub.innerText = msg;
            }
        } else console.error("Currently speaking");
    }

    private loadSpeechToText = () => {
        this.speechToText.lang = this.speakingLanguage;

        this.speechToText.rate = this.talkingSpeed;

        this.speechToText.onstart = (event) => {
            this.isSpeaking = true;
        }

        this.speechToText.onend = (event) => {
            this.isSpeaking = false;
            if(chatMessages.getLast() === "receiver"){
                chatMessages.push({ messageContent: "isTyping", from: "sender" });
            }else{
                chatMessages.push({ messageContent: "isTyping", from: "receiver" });
            }


            this.epsilon = 0;
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

            this.mesh = gltf.scene;
            //this.mesh.children[0].material = new THREE.MeshLambertMaterial();
            this.mesh.position.copy(this.camera.position);
            this.mesh.rotation.copy(this.camera.rotation);
            this.mesh.translateZ(-0.35);
            this.mesh.translateY(-1.3);
            this.mesh.updateMatrix();

            this.scene.add(this.mesh);

            this.skeleton = new THREE.SkeletonHelper(this.mesh);

            this.skeleton.visible = false
            this.scene.add(this.skeleton)

            const xAxis = new THREE.Vector3(1, 0, 0);

            // TODO: rm?

        }, undefined, (error) => {
            console.error(error)
        });

        this.animate = this.animate.bind(this);
    }

    private animate = () => {

        this.moveHead();

        this.controls.update()
        this.render()
        requestAnimationFrame(this.animate);
    }

    private moveHead(){
        if(this.skeleton != undefined) {
            if (this.skeleton.bones[2].rotation.y != this.targetX && this.turningSpeed < Math.abs(this.skeleton.bones[2].rotation.y - this.targetX)) {
                if (this.skeleton.bones[2].rotation.y > this.targetX) {
                    this.skeleton.bones[2].rotation.y -= this.turningSpeed;
                } else {
                    this.skeleton.bones[2].rotation.y += this.turningSpeed;
                }
            }
        }
    }

    private render() {
        this.renderer.render(this.scene, this.camera);
    }

    /* private moveMouth = () => {
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
            this.listUp.push(this.skeleton.bones[i].position.z);
        }
        for (let i = 20; i < 23; i++) {
            this.listDown.push(this.skeleton.bones[i].position.z);
        }

        for (let i = 45; i < 47; i++) {
            this.listUp.push(this.skeleton.bones[i].position.z);
        }
    }
*/
    private checkStatus = () => {
        if (this.mesh == undefined) {
            window.setTimeout(this.checkStatus, 100)
        } else {
            this.animate()
        }
    }

    public lookAtMe(x : number | undefined, y : number | undefined){
        if(x != undefined && y != undefined){
            this.targetX = this.map(x, 0, 500, 0.3, -0.3);
        }
    }

    private map(value : number, istart : number, istop : number, ostart : number, ostop : number) : number {
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
    }

    public getIsSpeaking(): boolean {
        return this.isSpeaking;
    }
}
