import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer, EffectPass } from 'postprocessing';
import { RenderPass } from 'postprocessing';
import { BloomEffect } from 'postprocessing';

import Stats from 'three/examples/jsm/libs/stats.module';
import * as seedrandom from 'seedrandom';

import HUD from './hud';


export default class Game {
    private camera: THREE.OrthographicCamera;
    public scene: THREE.Scene;
    private composer: EffectComposer;
    private running: boolean = false;
    private renderer: THREE.WebGLRenderer;
    private frustumSize: number = 400;
    public seed: string;
    private controls;
    private clock: THREE.Clock = new THREE.Clock();
    private time: number = 0;
    public hud: HUD;
    private stats: Stats;

    constructor(main: HTMLElement, seed: string) {
        this.seed = seed
        this.scene = new THREE.Scene();
        this.renderer = this.newRenderer();
        this.camera = new THREE.OrthographicCamera((this.frustumSize * this.aspectRatio) / -2, (this.frustumSize * this.aspectRatio) / 2, this.frustumSize / 2, this.frustumSize / -2, -10, 1000);
      
        //ADD POSTPROCESSING
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));
        const bloomEffect: BloomEffect = new BloomEffect(
            {
                luminanceThreshold: 0.3,
                luminanceSmoothing: 0.1,
                intensity: 1.4
            }
        );  
        this.composer.addPass(new EffectPass(this.camera, bloomEffect));

        main.appendChild(this.renderer.domElement);

        //ORBITCONTROL
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        //STATS
        this.stats = new Stats();
        this.hud = new HUD(this);
        document.body.appendChild(this.stats.dom)
        
        this.initWorld();
        this.initEventListeners();

        this.running = true;
    }

    get aspectRatio(): number {
        return this.renderer.domElement.width / this.renderer.domElement.height;
    }

    changeSeed(seed: string) {
        //@ts-ignore
        seedrandom(seed, { global: true });
    }

    //FOR ECS
    initWorld() {
        this.changeSeed(this.seed);
    }

    initEventListeners() {
        //on window resize
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
    }

    onWindowResize() {
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    newRenderer(): THREE.WebGLRenderer {
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setAnimationLoop(this.animation.bind(this));
        // renderer.setClearColor(0x222222, 1);

        return renderer;
    }

    start() {
        this.running = true;
    }

    pause() {
        this.running = false;
    }

    animation() {
        let deltaTime = this.clock.getDelta();    
        this.composer.render(deltaTime);

        if (this.running === true) {
            this.controls.update();
            this.renderer.render(this.scene, this.camera);

            //run only every 60 fps
            if (this.time > 1 / 60) {
                this.time = 0;

            }
            this.time += deltaTime;
            
            
            // this.world.execute(deltaTime, 0);
        }
        this.stats.update()

    }
}