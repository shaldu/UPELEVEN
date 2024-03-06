import * as THREE from 'three';
import { CustomOrbitControls as OrbitControls } from './customOrbitControls';
import { EffectComposer, EffectPass } from 'postprocessing';
import { RenderPass } from 'postprocessing';
import { BloomEffect } from 'postprocessing';

import Stats from 'three/examples/jsm/libs/stats.module';
import * as seedrandom from 'seedrandom';

import HUD from './hud';
import { Entity, World } from 'ecsy';
import { C_Transform, C_SpatialGridObject, C_Sprite, C_Movement, C_AnimalStats, C_FoodStats } from './components';
import { S_Movement, S_Renderer } from './systems';
import Map from './map';
import { _MAPSIZE, _MAXENTITIES, _TIMEDIALATION, addEntityToMap, entityMap, getFreeEntityId, removeEntityFromMap, setTimedialation } from './config';
import SpatialGrid from './spatialGrid';
import Cycle from './cycle';


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

    private timeDialationSave: number = 1;
    private timeDialationPaused: boolean = false;
    private selectedEntity: Entity | undefined;
    private cycle: Cycle | undefined;

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
                luminanceThreshold: 1,
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
        this.createEntities();

        if (this.world != undefined && this.map != undefined) {
            this.cycle = new Cycle(this, this.world, this.map);
        }

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

    createEntities() {


    }

    //FOR ECS
    initWorld() {
        this.changeSeed(this.seed);
        this.world = new World();

        //Register all components
        this.world.registerComponent(C_Transform);
        this.world.registerComponent(C_SpatialGridObject);
        this.world.registerComponent(C_Sprite);
        this.world.registerComponent(C_Movement);
        this.world.registerComponent(C_AnimalStats);
        this.world.registerComponent(C_FoodStats);

        //Register all systems
        this.world.registerSystem(S_Renderer);
        this.world.registerSystem(S_Movement);
    }

    showEntityStats(entity: Entity | undefined) {
        if (entity == undefined) return;
        this.hud.showEntityStats(entity);
    }

    initEventListeners() {
        //on window resize
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        //on keydown events
        document.addEventListener('keydown', this.onKeyDown.bind(this), false);
        //on mouse click
        document.addEventListener('click', this.onClick.bind(this), false);
    }

    onClick(event: MouseEvent) {
        //get the mouse position from the map
        let mousePosition = this.map?.mousePosition ?? new THREE.Vector2(0, 0);
        //loop through all entities and check the closest one
        let closestEntity: Entity | undefined;
        let closestDistance: number = 100000;
        entityMap.forEach((entity, id) => {
            let transformComponent = entity.getComponent(C_Transform);

            if (transformComponent) {
                let distance = transformComponent.position.distanceTo(mousePosition);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    if (distance < 1.5) {
                        closestEntity = entity;
                    }
                }
            }
        });
        if (closestEntity) {
            this.selectedEntity = closestEntity;
        }
    }

    onKeyDown(event: KeyboardEvent) {
        switch (event.code) {
            case 'ArrowUp':
                this.increaseDialation();
                this.timeDialationPaused = false;
                break;
            case 'ArrowDown':
                this.decreaseDialation();
                this.timeDialationPaused = false;
                break;
            case 'KeyP':
                if (this.timeDialationPaused === false) {
                    this.pauseDialation();
                    this.timeDialationPaused = true;
                } else {
                    this.resumeDialation();
                    this.timeDialationPaused = false;
                }
                break;
            default:
                break;
        }
    }

    onWindowResize() {
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    newRenderer(): THREE.WebGLRenderer {
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setAnimationLoop(this.animation.bind(this));
        renderer.setClearColor(0x222222, 1);

        return renderer;
    }


    start() {
        this.running = true;
    }

    pause() {
        this.running = false;
    }

    increaseDialation(step: number = 1) {
        if (this.timeDialationPaused === true) {
            this.resumeDialation();
        }
        //if time dialation is 1 change step to 0.1
        if (_TIMEDIALATION <= 1) {
            step = 0.1;
        }

        setTimedialation(_TIMEDIALATION + step);
    }

    decreaseDialation(step: number = 1) {
        if (this.timeDialationPaused === true) {
            this.resumeDialation();
        }

        //if time dialation is less than 1 change step to 0.1
        if (_TIMEDIALATION <= 1) {
            step = 0.1;
        }
        if (_TIMEDIALATION - step < 0.1) return;

        setTimedialation(_TIMEDIALATION - step);
    }

    pauseDialation() {
        this.timeDialationSave = _TIMEDIALATION;
        setTimedialation(0);
    }

    resumeDialation() {
        setTimedialation(this.timeDialationSave);
    }

    animation() {
        let deltaTime = this.clock.getDelta();

        if (this.running === true) {
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
            this.composer.render(deltaTime);

            //HUD UPDATE
            this.showEntityStats(this.selectedEntity || undefined);

            //run only every 60 fps
            if (this.time > 1 / 60) {
                this.time = 0;
                //use _TIMEDIALATION to slow or speed up the game
                this.map?.update(deltaTime, _TIMEDIALATION);
                this.cycle?.update(deltaTime);
                this.world?.execute(deltaTime, this.time);
            }
            this.time += deltaTime;
        }

        this.stats.update()
    }
}