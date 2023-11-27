
import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import type Game from './game';
import { C_Movement, C_Stats, C_Transform } from './components';
import { Entity } from 'ecsy';

export default class HUD {

    gui: GUI;
    game: Game
    observingEntity: Entity | undefined;
    isEditing: boolean = false;

    //FOLDERS
    generalFolder: any;
    entityStatsFolder: any;



    constructor(game: Game) {
        this.gui = new GUI();
        this.game = game;

        this.initHUDs();
        
    }

    initHUDs() {
        this.create_General_GUI();
        this.entityStatsFolder = this.gui.addFolder('Entity Stats');
    }

    //create a seed input field
    create_General_GUI() {
        
        if (this.generalFolder) this.generalFolder.destroy();
        this.generalFolder = this.gui.addFolder('General');
        //add a checkbox to toggle editing
        let obj1 = { isEditing: this.isEditing };
        this.generalFolder.add(obj1, 'isEditing').name('Is Editing').onChange((isEditing: boolean) => {
            this.isEditing = isEditing;
        });

        let obj2 = { seed: this.game.seed, mapString: '' };
        this.generalFolder.add(obj2, 'seed').name('Seed').onChange((seed: string) => {
            //DO SOMETHING
        });

    }

    showEntityStats(entity: any) {
        if (this.isEditing && entity == this.observingEntity) return;

        if (this.entityStatsFolder || this.entityStatsFolder == undefined) {
            this.entityStatsFolder.destroy();
            this.entityStatsFolder = this.gui.addFolder('Entity Stats');
        }
        this.observingEntity = entity;

        const statsComponent = entity.getComponent(C_Stats) as C_Stats;
        const transformComponent = entity.getComponent(C_Transform) as C_Transform;
        const movementComponent = entity.getMutableComponent(C_Movement) as C_Movement;

        let obj = { id: statsComponent.id, name: statsComponent.name, type: statsComponent.type, position: transformComponent.position as THREE.Vector2 };
        obj = { ...obj, ...{ speed: movementComponent.speed, movementType: movementComponent.movementType, radius: movementComponent.radius } };
        this.entityStatsFolder.add(obj, 'id').name('ID');
        this.entityStatsFolder.add(obj, 'name').name('Name');
        this.entityStatsFolder.add(obj, 'type').name('Type');
        //display position as x and y in the same row
        this.entityStatsFolder.add(obj.position, 'x').name('Position X');
        this.entityStatsFolder.add(obj.position, 'y').name('Position Y');
        this.entityStatsFolder.add(obj, 'speed').name('Speed').onChange((speed: number) => {
            movementComponent.speed = speed < 0 ? 0 : speed;
        });
        this.entityStatsFolder.add(obj, 'movementType').name('Movement Type');
        

        this.entityStatsFolder.add(obj, 'radius').name('Radius');

    }
}