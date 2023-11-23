import * as THREE from 'three';
import type { InstancedUniformsMesh } from 'three-instanced-uniforms-mesh';
import { System } from 'ecsy';
import { C_Transform, C_Movement } from '../components'
import { _SHEETHEIGHT, _SHEETWIDTH, _SPRITEHEIGHT, _SPRITEWIDTH, _TimeTick, _MAXTILES, _MAPSIZE } from '../config'


export class S_Movement extends System {
    time = 0;

    execute(delta: number, time: number) {
        this.movementRoaming(delta, time);
    }

    movementRoaming(delta: number, time: number) {
        this.queries.movementRoaming.results.forEach(entity => {
            if () {
                const movementComponent = entity.getMutableComponent(C_Movement) as C_Movement;
                const transformComponent = entity.getMutableComponent(C_Transform) as C_Transform;
            }


        });
    }

    findNewRandomLocation(transformComponent: C_Transform) {
        let x = Math.floor(Math.random() * _MAXTILES);
        let y = Math.floor(Math.random() * _MAXTILES);
        //check bounds
        if (x > _MAPSIZE) {
            x = _MAPSIZE;
        }
        if (y > _MAPSIZE) {
            y = _MAPSIZE;
        }

        return new THREE.Vector2(x, y);
    }
}

S_Movement.queries = {
    movementRoaming: {
        components: [C_Movement, C_Transform],
    }
}