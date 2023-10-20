import { Component, Types } from 'ecsy';
import * as THREE from 'three';
import { Vector2Type } from './types';

export class C_SpatialGridObject extends Component<C_SpatialGridObject>
{
    cells: any = {min: null, max: null, nodes: null};
}

C_SpatialGridObject.schema = {
    cells: { type: Types.Ref , default: {min: null, max: null, nodes: null}},
}