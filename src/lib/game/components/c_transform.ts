import { Component, Types } from 'ecsy';
import * as THREE from 'three';
import { Vector2Type } from './types';

export class C_Transform extends Component<C_Transform>
{
    position: THREE.Vector2 = new THREE.Vector2();
    rotation: number = 0;
    scale: number = 1;
}

C_Transform.schema = {
    position: { type: Vector2Type , default: new THREE.Vector2(0, 0)},
    rotation: { type: Types.Number, default: 0 },
    scale: { type: Types.Number, default: 1 }
}