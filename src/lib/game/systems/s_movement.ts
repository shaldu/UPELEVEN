import * as THREE from 'three';
import type { InstancedUniformsMesh } from 'three-instanced-uniforms-mesh';
import { System } from 'ecsy';
import { C_Transform, C_Movement } from '../components'
import { _SHEETHEIGHT, _SHEETWIDTH, _SPRITEHEIGHT, _SPRITEWIDTH, _TimeTick, _MAXTILES, _MAPSIZE, _TIMEDIALATION } from '../config'


export class S_Movement extends System {
    time = 0;

    execute(delta: number, time: number) {
        this.movementRoaming(delta, time);
    }

    movementRoaming(delta: number, time: number) {
        this.queries.movementRoaming.results.forEach(entity => {
            
                const movementComponent = entity.getMutableComponent(C_Movement) as C_Movement;
            if (movementComponent.movementType == "roaming") {
                const transformComponent = entity.getMutableComponent(C_Transform) as C_Transform;
                //check if we are moving
                //if we are moving and we have a target location we move
                //if we are moving and we dont have a target we find a new location
                //if we are not moving we find a new location
                if (movementComponent.isPathing == false && movementComponent.targetPosition == undefined) {
                    movementComponent.targetPosition = this.findNewRandomLocation(transformComponent, movementComponent.radius);
                    movementComponent.isPathing = true;
                } else if (movementComponent.isPathing == false && movementComponent.targetPosition != undefined) {
                    movementComponent.targetPosition = this.findNewRandomLocation(transformComponent, movementComponent.radius);
                    movementComponent.isPathing = true;
                } else if (movementComponent.isPathing == true && movementComponent.targetPosition != undefined) {
                    //move towards target
                    let direction = movementComponent.targetPosition.clone().sub(transformComponent.position);
                    direction.normalize();
                    direction.multiplyScalar((movementComponent.speed * delta) * _TIMEDIALATION);
                    transformComponent.position.add(direction);
                    //check if we are close enough to target
                    if (transformComponent.position.distanceTo(movementComponent.targetPosition) < movementComponent.acceptanceRadius) {
                        movementComponent.isPathing = false;
                        movementComponent.targetPosition = undefined;
                    }
                }

            }


        });
    }

    findNewRandomLocation(transformComponent: C_Transform, radius: number) {
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
    movementRoaming: {
        components: [C_Movement, C_Transform],
    }
}