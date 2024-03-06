import { Component, Entity, Types } from 'ecsy';
import * as THREE from 'three';
import { Vector2Type } from './types';

export class C_Movement extends Component<C_Movement>
{
    speed: number = 1;
    movementType: 'roaming' | 'stationary' | 'resting' | 'attacking' | 'fleeing' | 'pathing' = 'roaming';

    //cooldowns
    durationCurrent: number = 0;
    durationMax: number = 2;
    delay = 0;

    radiusMin = 4;
    radius = 8;
    acceptanceRadius = 0.1;

    //pathing
    isPathing: boolean = false;

    //target
    target: Entity | undefined;
    targetPosition: THREE.Vector2 | undefined;
}

C_Movement.schema = {
    speed: { type: Types.Number, default: 2 },
    movementType: { type: Types.String, default: 'roaming' },
    target: { type: Types.Ref, default: undefined },
    targetPosition: { type: Vector2Type, default: undefined },
    durationCurrent: { type: Types.Number, default: 0 },
    durationMax: { type: Types.Number, default: 2 },
    delay: { type: Types.Number, default: 0 },
    radius: { type: Types.Number, default: 8 },
    radiusMin: { type: Types.Number, default: 4 },
    isPathing: { type: Types.Boolean, default: false },
    acceptanceRadius: { type: Types.Number, default: 0.1 }
}