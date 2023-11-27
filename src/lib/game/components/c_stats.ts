import { Component, Entity, Types } from 'ecsy';
import * as THREE from 'three';
import { Vector2Type } from './types';

export class C_Stats extends Component<C_Stats>
{
    id: number = 0;
    name: string = "none";
    type: "chicken" | "wolf" | "none" = "none";
}

C_Stats.schema = {
    id: { type: Types.Number, default: 0 },
    name: { type: Types.String, default: "none" },
    type: { type: Types.String, default: "none" },
}