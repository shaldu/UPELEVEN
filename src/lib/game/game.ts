import * as THREE from 'three';
import { CustomOrbitControls as OrbitControls } from './customOrbitControls';
import { EffectComposer, EffectPass } from 'postprocessing';
import { RenderPass } from 'postprocessing';
import { BloomEffect } from 'postprocessing';

import Stats from 'three/examples/jsm/libs/stats.module';
import * as seedrandom from 'seedrandom';

import HUD from './hud';
import { World } from 'ecsy';
import { C_Transform, C_SpatialGridObject, C_Sprite } from './components';
import { S_Renderer } from './systems';
import Map from './map';
import { _MAPSIZE, _MAXENTITIES, _TIMEDIALATION } from './config';
import SpatialGrid from './spatialGrid';


export default class Game {
    private camera: THREE.OrthographicCamera;
    public scene: THREE.Scene;
    private composer: EffectComposer;
    private running: boolean = false;
    private renderer: THREE.WebGLRenderer;
    private frustumSize: number = 40;
    public seed: string;
    private controls;
    private clock: THREE.Clock = new THREE.Clock();
    private time: number = 0;
    public hud: HUD;
    private stats: Stats;
    private world: World | undefined;
    public map: Map | undefined;
    private spatialGrid: SpatialGrid | undefined;

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
                luminanceThreshold: 0.4,
                luminanceSmoothing: 0.1,
                intensity: 1.4
            }
        );  
        this.composer.addPass(new EffectPass(this.camera, bloomEffect));

        main.appendChild(this.renderer.domElement);

        //ORBITCONTROL
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        //set custom keys
        this.controls.zoomToCursor = true;
        

        //STATS
        this.stats = new Stats();
        this.hud = new HUD(this);
        document.body.appendChild(this.stats.dom)
        
        this.initWorld();
        this.initMap();
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

    initMap() {
        this.map = new Map(this.scene, this.world, this.controls);
        this.spatialGrid = new SpatialGrid(6, new THREE.Box3(new THREE.Vector3(-_MAPSIZE / 2, -_MAPSIZE / 2, 0), new THREE.Vector3(_MAPSIZE / 2, _MAPSIZE / 2, 0)));
        // this.spatialGrid.drawGrid(this.scene);
    }

    //FOR ECS
    initWorld() {
        this.changeSeed(this.seed);
        this.world = new World();

        //Register all components
        this.world.registerComponent(C_Transform);
        this.world.registerComponent(C_SpatialGridObject);
        this.world.registerComponent(C_Sprite);

        //Register all systems
        this.world.registerSystem(S_Renderer);
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
        renderer.setClearColor(0x333333, 1);

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

        if (this.running === true) {
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
            this.composer.render(deltaTime);

            //run only every 60 fps
            if (this.time > 1 / 60) {
                this.time = 0;
                //use _TIMEDIALATION to slow or speed up the game
                this.map?.update(deltaTime, _TIMEDIALATION);
                this.world?.execute(deltaTime, this.time);
            }
            this.time += deltaTime;
        }

        this.stats.update()
    }
}