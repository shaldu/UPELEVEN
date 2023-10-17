import { Component, Types } from 'ecsy';
import * as THREE from 'three';
import { Vector2Type } from './types';

export class C_Position extends Component<C_Position>
{

}

C_Position.schema = {
    position: { type: Vector2Type , default: new THREE.Vector2(0, 0)}
}