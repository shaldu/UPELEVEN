import { Component, Entity, Types } from 'ecsy';
import * as THREE from 'three';
import { Vector2Type } from './types';

export class C_Movement extends Component<C_Movement>
{
    speed: number = 1;
    movementType: 'roaming' | 'stationary' | 'attacking' | 'fleeing' | 'pathing' = 'roaming';

    //cooldowns
    durationCurrent: number = 0;
    durationMax: number = 2;
    delay = 0;

    //pathing
    isPathing: boolean = false;

    //target
    target: Entity | undefined;
    targetPosition: THREE.Vector2 | undefined;
}

C_Movement.schema = {
    speed: { type: Types.Number, default: 1 },
    movementType: { type: Types.String, default: 'roaming' },
    target: { type: Types.Ref, default: undefined },
    targetPosition: { type: Vector2Type, default: undefined },
    durationCurrent: { type: Types.Number, default: 0 },
    durationMax: { type: Types.Number, default: 2 },
    delay: { type: Types.Number, default: 0 },
    isPathing: { type: Types.Boolean, default: false }

}