import type { Entity, World } from "ecsy"
import * as THREE from 'three';
import { _MAPSIZE, _MAXENTITIES, _MAXTILES, _SHEETHEIGHT, _SHEETWIDTH, _SPRITEHEIGHT, _SPRITEWIDTH } from './config';
//@ts-ignore
import textureImage from './sprites/spritesheet.jpeg';
import { InstancedUniformsMesh } from 'three-instanced-uniforms-mesh';
import vertexShader from './shaders/vertexShader.glsl';
import fragmentShader from './shaders/fragmentShader.glsl';
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Tile from "./tile";

export default class Map {
    instancedMeshEntities: InstancedUniformsMesh<any> | undefined;
    isntancedMeshTiles: InstancedUniformsMesh<any> | undefined;

    editorMode: boolean = true;
    mousePosition: THREE.Vector2 = new THREE.Vector2(0, 0);
    hoveredTile: Tile | undefined;
    tiles: Tile[] = [];
    public texture: THREE.Texture = new THREE.TextureLoader().load(textureImage);

    constructor(readonly scene: THREE.Scene, readonly world: World | undefined, readonly orbitControls: OrbitControls) {

        if (this.editorMode) {
            this.createDebugGrid();
            this.createEmptyMap();
            this.initEvents();
        } else {

        }
    }

    createDebugGrid() {
        //create a debug grid
        const gridHelper = new THREE.GridHelper(_MAPSIZE, _MAPSIZE);
        //rotate the grid so it's flat on the ground
        gridHelper.rotation.x = Math.PI / 2;
        gridHelper.position.x = .5;
        gridHelper.position.y = .5;
        this.scene.add(gridHelper);
    }

    worldPointFromScreenPoint(screenPoint: THREE.Vector2, camera: THREE.Camera ) {
        let worldPoint = new THREE.Vector3();
        worldPoint.x = screenPoint.x;
        worldPoint.y = screenPoint.y;
        worldPoint.z = 0;
        worldPoint.unproject( camera );
        return worldPoint;
    
    }

    //add editor Events
    initEvents() {
        //add mouse hover to tiles

        window.addEventListener('mousemove', (event) => {
            //@ts-ignore
            const rect = this.orbitControls.domElement.getBoundingClientRect();
            const mySceneCamera = this.orbitControls.object;
            let viewportDown = new THREE.Vector2();
            viewportDown.x =   ( ( ( event.clientX - rect.left) / rect.width ) * 2 ) - 1;
            viewportDown.y = - ( ( ( event.clientY - rect.top) / rect.height ) * 2 ) + 1;

            // Get 3d point
            let my3dPosition = this.worldPointFromScreenPoint( viewportDown, mySceneCamera );
            this.mousePosition.x = Math.floor(my3dPosition.x + (_MAPSIZE / 2) - .5);
            this.mousePosition.y = Math.floor(my3dPosition.y + (_MAPSIZE / 2) - .5);

            //if mouse is outside of the map, return
            if (this.mousePosition.x < 0 || this.mousePosition.y < 0 || this.mousePosition.x >= _MAPSIZE || this.mousePosition.y >= _MAPSIZE) {
                return;
            }

            const i = this.mousePosition.x + this.mousePosition.y * _MAPSIZE;
            const tile = this.tiles[i];
            if(tile !== undefined){
                this.hoveredTile = tile;
            }   
            
        });

        window.addEventListener('keydown', (event) => {
            if (event.key === '1') {
                //spawn something?

            }  
        });        
    }

    update(deltaTime: number, timeDialation: number){
        console.log('run');
        
    }

    //create a empty map
    createEmptyMap() {
        this.initInstancedMeshTiles();
        this.createEmptyTiles();
    }

    createEmptyTiles(){
        for (let x = 0; x < _MAPSIZE; x++) {
            for (let y = 0; y < _MAPSIZE; y++) {
                const i = x + y * _MAPSIZE;
                const position = new THREE.Vector2(x - (_MAPSIZE / 2) + 1, y - (_MAPSIZE / 2) + 1);
                this.isntancedMeshTiles?.setUniformAt('vPosition', i, new THREE.Vector4(position.x, position.y, 1, 0));
                this.tiles[i] = new Tile(new THREE.Vector2(position.x, position.y), 0, 0, i);
                // this.tiles[i].drawTile(this, this.tiles[i].typeId);
            }
        }
    }

    initInstancedMeshTiles() {
        this.texture.magFilter = THREE.NearestFilter;
        this.texture.minFilter = THREE.NearestFilter;

        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.wrapT = THREE.RepeatWrapping;

        this.texture.repeat.set(_SPRITEWIDTH / _SHEETWIDTH, _SPRITEHEIGHT / _SHEETHEIGHT);

        this.texture.minFilter = THREE.NearestFilter;
        this.texture.magFilter = THREE.NearestFilter;
        
        const scale = 1;

        const geometry = new THREE.PlaneGeometry(scale, scale);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                texture1: { value: this.texture },
                repeat: { value: new THREE.Vector2((_SPRITEWIDTH / _SHEETWIDTH), _SPRITEHEIGHT / _SHEETHEIGHT) },
                texOffset: { value: new THREE.Vector2(0, 0) },
                vPosition: { value: new THREE.Vector4(0, 0, 0, 0) },
                opacity: { value: 0 }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true
        });

        this.isntancedMeshTiles = new InstancedUniformsMesh(geometry, material, _MAXENTITIES);

        this.scene.add(this.isntancedMeshTiles);
    }

    initInstancedMeshEntities() {
        this.texture.magFilter = THREE.NearestFilter;
        this.texture.minFilter = THREE.NearestFilter;

        this.texture.wrapS = THREE.RepeatWrapping;
        this.texture.wrapT = THREE.RepeatWrapping;

        this.texture.repeat.set(_SPRITEWIDTH / _SHEETWIDTH, _SPRITEHEIGHT / _SHEETHEIGHT);

        this.texture.minFilter = THREE.NearestFilter;
        this.texture.magFilter = THREE.NearestFilter;

        const scale = 1;
    
        
        const geometry = new THREE.PlaneGeometry(scale, scale);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                texture1: { value: this.texture },
                repeat: { value: new THREE.Vector2(_SPRITEWIDTH / _SHEETWIDTH, _SPRITEHEIGHT / _SHEETHEIGHT) },
                texOffset: { value: new THREE.Vector2(0, 0) },
                vPosition: { value: new THREE.Vector4(0, 0, 0, 0) },
                opacity: { value: 1 }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true
        });

        this.instancedMeshEntities = new InstancedUniformsMesh(geometry, material, _MAXENTITIES);

        this.scene.add(this.instancedMeshEntities);
    }

    setSpritePosition(instancedMesh: typeof InstancedUniformsMesh | any, matrixId: number, position: THREE.Vector2) {
        instancedMesh.setUniformAt('vPosition', matrixId, new THREE.Vector4(position.x, position.y, 1, 0));
    }

    setTextureOffset(instancedMesh: typeof InstancedUniformsMesh | any, matrixId: number, offset: THREE.Vector2) {
        //offset.x = columnPosition
        //offset.y = rowPosition
        const x = (((offset.x * _SPRITEWIDTH)) / _SHEETWIDTH);
        const y = 1 - (((offset.y * _SPRITEHEIGHT) + _SPRITEHEIGHT) / _SHEETHEIGHT);

        instancedMesh.setUniformAt('texOffset', matrixId, new THREE.Vector4(x, y, 0, 0));
    }

    setOpacity(instancedMesh: typeof InstancedUniformsMesh | any, matrixId: number, opacity: number) {
        instancedMesh.setUniformAt('opacity', matrixId, opacity);
    }
}