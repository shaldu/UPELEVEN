import * as THREE from 'three';
import { Entity, World } from "ecsy";
import { _MAPSIZE, _TIMEDIALATION, addEntityToMap, entityMap, getFreeEntityId } from "./config";
import Game from "./game";
import Map from "./map";
import { C_Transform, C_SpatialGridObject, C_Sprite, C_Movement, C_AnimalStats, C_FoodStats } from './components';
import { S_Movement, S_Renderer } from './systems';

export default class Cycle {
    cycleLengthMax: number = 10;
    cycleLength: number = this.cycleLengthMax;
    game: Game;
    cycleNumber: number = 0;
    world: World;
    map: Map;

    constructor(game: Game, world: World, map: Map) {
        this.game = game;
        this.world = world;
        this.map = map;
        
        this.spawnFood(20);
        this.spawnChicken(this.cycleNumber);
    }

    spawnFood(foodAmount: number = 20) {
        //create food
        for (let i = 0; i < foodAmount; i++) {
            if (this.world) {
                let id = getFreeEntityId();
                let entity = this.world.createEntity();
                addEntityToMap(id, entity);
                let randomX = Math.floor(Math.random() * _MAPSIZE) - _MAPSIZE / 2;
                let randomY = Math.floor(Math.random() * _MAPSIZE) - _MAPSIZE / 2;
                entity.addComponent(C_Transform, { position: new THREE.Vector2(randomX, randomY) });
                entity.addComponent(C_SpatialGridObject);
                entity.addComponent(C_Sprite, { instancedMeshRef: this.map?.instancedMeshEntities, matrixId: id, rowPosition: 3, columnPosition: 3 });
                entity.addComponent(C_Movement, { speed: 0, movementType: 'stationary' })
                entity.addComponent(C_FoodStats, { name: 'Seeds', type: 'food', id: id, game: this.game });
            }
        }
    }

    spawnChicken(generation: number = 0) {
        for (let i = 0; i < 40; i++) {
            if (this.world) {
                let id = getFreeEntityId();
                let entity = this.world.createEntity();
                addEntityToMap(id, entity);
                let randomX = Math.floor(Math.random() * _MAPSIZE) - _MAPSIZE / 2;
                let randomY = Math.floor(Math.random() * _MAPSIZE) - _MAPSIZE / 2;
                entity.addComponent(C_Transform, { position: new THREE.Vector2(randomX, randomY) });
                entity.addComponent(C_SpatialGridObject);
                entity.addComponent(C_Sprite, { instancedMeshRef: this.map?.instancedMeshEntities, matrixId: id, rowPosition: 0, columnPosition: 1 });
                entity.addComponent(C_Movement, { speed: 1, movementType: 'roaming' })
                entity.addComponent(C_AnimalStats, { name: 'Chicken', type: 'chicken', id: id, game: this.game, generation: generation });
            }
        }

    }

    //create a offspring from 2 parents and add mutation to the offspring take a random parent for each gene
    //mutations are, speed, energyMax, hungerMax, restingBiasPercentage, restingDuration
    createOffspringValues(parent1: Entity, parent2: Entity) {
        //get the speed and change it by a random amount between -1 and 1

        //speed
        //random parent
        let randomParent = Math.floor(Math.random() * 2);
        let speed = 0;
        if (randomParent == 0) {
            speed = parent1.getComponent(C_Movement)?.speed ?? 0;
        } else {
            speed = parent2.getComponent(C_Movement)?.speed ?? 0;
        }
        speed += Math.floor(Math.random() * 3) - 1;
        if (speed < 0) speed = 0;

        //energyMax
        //random parent
        randomParent = Math.floor(Math.random() * 2);
        let energyMax = 0;
        if (randomParent == 0) {
            energyMax = parent1.getComponent(C_AnimalStats)?.energyMax ?? 0;
        } else {
            energyMax = parent2.getComponent(C_AnimalStats)?.energyMax ?? 0;
        }
        //between -20 and 20
        energyMax += Math.floor(Math.random() * 40) - 20;
        if (energyMax < 0) energyMax = 0;

        //hungerMax
        //random parent
        randomParent = Math.floor(Math.random() * 2);
        let hungerMax = 0;
        if (randomParent == 0) {
            hungerMax = parent1.getComponent(C_AnimalStats)?.hungerMax ?? 0;
        } else {
            hungerMax = parent2.getComponent(C_AnimalStats)?.hungerMax ?? 0;
        }
        //between -20 and 20
        hungerMax += Math.floor(Math.random() * 40) - 20;
        if (hungerMax < 0) hungerMax = 0;

        //restingBiasPercentage
        //random parent
        randomParent = Math.floor(Math.random() * 2);
        let restingBiasPercentage = 0;
        if (randomParent == 0) {
            restingBiasPercentage = parent1.getComponent(C_AnimalStats)?.restingBiasPercentage ?? 0;
        } else {
            restingBiasPercentage = parent2.getComponent(C_AnimalStats)?.restingBiasPercentage ?? 0;
        }
        //between -20 and 20
        restingBiasPercentage += Math.floor(Math.random() * 40) - 20;
        if (restingBiasPercentage < 0) restingBiasPercentage = 0;
        if (restingBiasPercentage > 100) restingBiasPercentage = 100;

        //restingDuration
        //random parent
        randomParent = Math.floor(Math.random() * 2);
        let restingDuration = 0;
        if (randomParent == 0) {
            restingDuration = parent1.getComponent(C_AnimalStats)?.restingDuration ?? 0;
        } else {
            restingDuration = parent2.getComponent(C_AnimalStats)?.restingDuration ?? 0;
        }
        //between -1 and 1
        restingDuration += Math.floor(Math.random() * 3) - 1;
        if (restingDuration < 0.1) restingDuration = 0.1;
        
        //return values
        return {
            speed: speed,
            energyMax: energyMax,
            hungerMax: hungerMax,
            restingBiasPercentage: restingBiasPercentage,
            restingDuration: restingDuration
        }
    }

    createOffspring(parent1: Entity, parent2: Entity) {
        //create offspring
        const offspringValues = this.createOffspringValues(parent1, parent2);
        let id = getFreeEntityId();
        let entity = this.world.createEntity();
        addEntityToMap(id, entity);
        let randomX = Math.floor(Math.random() * _MAPSIZE) - _MAPSIZE / 2;
        let randomY = Math.floor(Math.random() * _MAPSIZE) - _MAPSIZE / 2;
        entity.addComponent(C_Transform, { position: new THREE.Vector2(randomX, randomY) });
        entity.addComponent(C_SpatialGridObject);
        entity.addComponent(C_Sprite, { instancedMeshRef: this.map?.instancedMeshEntities, matrixId: id, rowPosition: 0, columnPosition: 1 });
        entity.addComponent(C_Movement, { speed: offspringValues.speed, movementType: 'roaming' });
        entity.addComponent(C_AnimalStats, { name: 'Chicken', type: 'chicken', id: id, game: this.game, generation: this.cycleNumber ?? 0, energyMax: offspringValues.energyMax, hungerMax: offspringValues.hungerMax, restingBiasPercentage: offspringValues.restingBiasPercentage, restingDuration: offspringValues.restingDuration, energyCurrent: offspringValues.energyMax, hungerCurrent: offspringValues.hungerMax });

    }

    newCycle() {
        console.log("new cycle");
        
        const hungerNeed = 50;
        const energyNeed = 50;
        //check all chicken entities and create offspring if they have enough energy and hunger above 50
        let chickenEntities: Entity[] = [];
        entityMap.forEach((entity, id) => {
            if (entity.getComponent(C_AnimalStats)?.type == "chicken") {
                chickenEntities.push(entity);
            }
        });
        //loop through all chicken entities
        for (let i = 0; i < chickenEntities.length; i++) {
            const chickenEntity = chickenEntities[i];
            const chickenStatsComponent = chickenEntity.getMutableComponent(C_AnimalStats);
            const chickenMovementComponent = chickenEntity.getComponent(C_Movement);
            if (chickenStatsComponent == undefined || chickenMovementComponent == undefined) continue;
            //check if the chicken has enough energy and hunger
            if (chickenStatsComponent.energyCurrent > energyNeed && chickenStatsComponent.hungerCurrent > hungerNeed) {
                //find a random chicken entity and create offspring
                let randomChickenEntity = chickenEntities[Math.floor(Math.random() * chickenEntities.length)];
                this.createOffspring(chickenEntity, randomChickenEntity);

                //reduce the energy and hunger of the chicken
                chickenStatsComponent.energyCurrent -= hungerNeed / 3;
                chickenStatsComponent.hungerCurrent -= energyNeed / 3;
            }
        }

        //create new food
        this.spawnFood(20);
    }

    update(deltaTime: number) {
        this.cycleLength -= deltaTime * _TIMEDIALATION;
        if (this.cycleLength <= 0) {
            this.cycleLength = this.cycleLengthMax;
            this.cycleNumber++;
            this.newCycle();
        }

    }
}