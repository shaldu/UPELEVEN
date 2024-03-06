import * as THREE from 'three';
import type { InstancedUniformsMesh } from 'three-instanced-uniforms-mesh';
import { System } from 'ecsy';
import { C_Transform, C_Movement, C_AnimalStats, C_FoodStats } from '../components'
import { _SHEETHEIGHT, _SHEETWIDTH, _SPRITEHEIGHT, _SPRITEWIDTH, _TimeTick, _MAXTILES, _MAPSIZE, _TIMEDIALATION, weightedBooleanPercantage } from '../config'


export class S_Movement extends System {
    time = 0;

    execute(delta: number, time: number) {
        this.movement(delta, time);
        this.foodInteraction(delta, time);
    }

    foodInteraction(delta: number, time: number) {
        this.queries.foodinteraction.results.forEach(foodEntity => {
            //check if the food is overlapping with the animal

            const transformComponent = foodEntity.getMutableComponent(C_Transform) as C_Transform;
            const foodStatComponent = foodEntity.getMutableComponent(C_FoodStats) as C_FoodStats;

            if (transformComponent != undefined && foodStatComponent != undefined) {

                this.queries.movement.results.forEach(animalEntity => {

                    const movementComponent = animalEntity.getMutableComponent(C_Movement) as C_Movement;
                    const animalStatsComponent = animalEntity.getMutableComponent(C_AnimalStats) as C_AnimalStats;
                    const animalTransformComponent = animalEntity.getMutableComponent(C_Transform) as C_Transform;

                    if (movementComponent != undefined && animalStatsComponent != undefined) {
                        if (transformComponent.position.distanceTo(animalTransformComponent.position) < movementComponent.acceptanceRadius + .5) {
                            animalStatsComponent.eat(foodEntity);                            
                        }
                    }
                });
            }

        });
    }

    movement(delta: number, time: number) {
        this.queries.movement.results.forEach(entity => {
            const movementComponent = entity.getMutableComponent(C_Movement) as C_Movement;

            if (movementComponent.movementType == "stationary") return;

            const statsComponent = entity.getMutableComponent(C_AnimalStats) as C_AnimalStats;
            if (weightedBooleanPercantage(statsComponent.restingBiasPercentage) && !movementComponent.isPathing) movementComponent.movementType = "resting";


            if (movementComponent.movementType == "roaming") {
                const transformComponent = entity.getMutableComponent(C_Transform) as C_Transform;

                //check if we are moving
                //if we are moving and we have a target location we move
                //if we are moving and we dont have a target we find a new location
                //if we are not moving we find a new location
                if (movementComponent.isPathing == false && movementComponent.targetPosition == undefined) {
                    movementComponent.targetPosition = this.findNewRandomLocation(transformComponent, movementComponent.radius, movementComponent.radiusMin);
                    movementComponent.isPathing = true;
                } else if (movementComponent.isPathing == false && movementComponent.targetPosition != undefined) {
                    movementComponent.targetPosition = this.findNewRandomLocation(transformComponent, movementComponent.radius, movementComponent.radiusMin);
                    movementComponent.isPathing = true;
                } else if (movementComponent.isPathing == true && movementComponent.targetPosition != undefined) {
                    //move towards target
                    let direction = movementComponent.targetPosition.clone().sub(transformComponent.position);
                    direction.normalize();

                    direction.multiplyScalar((movementComponent.speed * delta) * _TIMEDIALATION);

                    statsComponent.energyCurrent = this.calculateEnergyCost(movementComponent.movementType, statsComponent.energyCurrent, statsComponent.energyMax, movementComponent.speed, delta);

                    transformComponent.position.add(direction);
                    //check if we are close enough to target
                    if (transformComponent.position.distanceTo(movementComponent.targetPosition) < movementComponent.acceptanceRadius) {
                        movementComponent.isPathing = false;
                        movementComponent.targetPosition = undefined;
                    }
                }

            } else if (movementComponent.movementType == "resting") {
                movementComponent.targetPosition = undefined;
                movementComponent.isPathing = false;
                movementComponent.durationCurrent += delta;
                let energy = this.calculateEnergyCost(movementComponent.movementType, statsComponent.energyCurrent, statsComponent.energyMax, movementComponent.speed, delta);
                statsComponent.energyCurrent = energy;
                if (movementComponent.durationCurrent >= movementComponent.durationMax) {
                    movementComponent.durationCurrent = 0;
                    movementComponent.movementType = "roaming";
                }
            }

            statsComponent.hungerCurrent = this.calculateHungerCost(statsComponent.hungerCurrent, statsComponent.hungerMax, delta);

            this.checkForDeath(statsComponent);
        });
    }

    checkForDeath(statsComponent: C_AnimalStats) {
        if (statsComponent.energyCurrent <= 0 || statsComponent.hungerCurrent <= 0) {
            statsComponent.kill();
        }
    }

    calculateHungerCost(hunger: number, hungerMax: number, delta: number) {
        let hungerFactor = 1;
        let overAllHungerFactor = 2;

        let hungerCost = (((((1) * 2) * delta) * hungerFactor) * overAllHungerFactor) * _TIMEDIALATION;
        hunger -= hungerCost;
        if (hunger < 0) hunger = 0;
        if (hunger > hungerMax) hunger = hungerMax;
        return hunger;
    }

    calculateEnergyCost(movementType: string, energy: number, energyMax: number, speed: number, delta: number) {
        let energyFactor = 1;
        let overAllEnergyFactor = 2;

        switch (movementType) {
            case "resting":
                energyFactor = -1;
                break;
            case "roaming":
                energyFactor = 1;
                break;
            case "hunting":
                energyFactor = 2;
                break;
            case "fleeing":
                energyFactor = 2;
                break;
            default:
                energyFactor = 1;
                break;
        }

        //maybe change it when the energyFactor is negative so it doesnt multply with speed
        let energyCost = (((((speed + 1) * 2) * delta) * energyFactor) * overAllEnergyFactor) * _TIMEDIALATION;
        energy -= energyCost;
        if (energy < 0) energy = 0;
        if (energy > energyMax) energy = energyMax;
        return energy;
    }

    findNewRandomLocation(transformComponent: C_Transform, radius: number, radiusMin: number) {

        let x = transformComponent.position.x + (Math.random() * radius * 2) - radius;
        let y = transformComponent.position.y + (Math.random() * radius * 2) - radius;

        if (x < (_MAPSIZE / 2) - _MAPSIZE) {
            x = (_MAPSIZE / 2) - _MAPSIZE;
        }
        if (x > (_MAPSIZE - (_MAPSIZE / 2))) {
            x = (_MAPSIZE - (_MAPSIZE / 2));
        }

        if (y < (_MAPSIZE / 2) - _MAPSIZE) {
            y = (_MAPSIZE / 2) - _MAPSIZE;
        }
        if (y > (_MAPSIZE - (_MAPSIZE / 2))) {
            y = (_MAPSIZE - (_MAPSIZE / 2));
        }

        return new THREE.Vector2(x, y);
    }
}

S_Movement.queries = {
    movement: {
        components: [C_Movement, C_Transform, C_AnimalStats],
    },
    foodinteraction: {
        components: [C_Movement, C_Transform, C_FoodStats],
    }
}