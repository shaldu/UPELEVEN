//@ts-ignore
import * as THREE from 'three';
//@ts-ignore
import { System } from 'ecsy';
import { C_Position, C_Velocity } from '../components/loader'
import { _TimeTick } from '$lib/game/config'
import { Helpers } from '$lib/game/helpers'

export class S_Movement extends System {

    execute(delta: number, time: number) {

    }
}

S_Movement.queries = {
    walking: {
        components: [C_Position, C_Velocity],
    }
}