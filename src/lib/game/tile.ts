import * as THREE from 'three';

export default class Tile {

    position: THREE.Vector2;
    rotation: number;
    typeId: number;
    matrixId: number;

    constructor(position: THREE.Vector2, rotation: number, typeId: number, matrixId: number) {
        this.position = position;
        this.rotation = rotation;
        this.typeId = typeId;
        this.matrixId = matrixId;
    }
}