import { createType, copyCopyable, cloneClonable } from "ecsy";
import * as THREE from 'three';

class Vector2 {

    vector: THREE.Vector2;

    constructor() {
        this.vector = new THREE.Vector2();
    }

    set(x: number, y: number) {
        this.vector.set(x, y);
        return this;
    }

    copy(source: THREE.Vector2) {
        this.vector.copy(source);
        return this;
    }

    clone() {
        const clonedVector = new Vector2();
        clonedVector.copy(this.vector);
        return clonedVector;
    }
}

export const Vector2Type = createType({
    name: "Vector2",
    default: new Vector2(),
    copy: copyCopyable,
    clone: cloneClonable
});