import * as THREE from 'three';
export class Helpers {

    static getRandomBoolWithWeightPercentage(weight: number) {
        return Math.random() < (weight / 100);
    }

    static getRandomInt(min = -9999999, max = 9999999) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static hexToVector4(hex: string): THREE.Vector4 {
        const color = new THREE.Color(hex);
        return new THREE.Vector4(color.r, color.g, color.b, 1);
    }

    static rand_normalish() {
        const r = Math.random() + Math.random() + Math.random() + Math.random();
        return (r / 4.0) * 2.0 - 1;
    }

    static rand_int(a: number, b: number) {
        return Math.round(Math.random() * (b - a) + a);
    }

    static lerp(x: number, a: number, b: number) {
        return x * (b - a) + a;
    }

    static smoothstep(x: number, a: number, b: number) {
        x = x * x * (3.0 - 2.0 * x);
        return x * (b - a) + a;
    }

    static smootherstep(x: number, a: number, b: number) {
        x = x * x * x * (x * (x * 6 - 15) + 10);
        return x * (b - a) + a;
    }

    static clamp(x: number, a: number, b: number) {
        return Math.min(Math.max(x, a), b);
    }
    static sat(x: number) {
        return Math.min(Math.max(x, 0.0), 1.0);
    }
}