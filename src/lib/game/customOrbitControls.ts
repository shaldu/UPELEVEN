import { Key } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Define your custom controls class by extending OrbitControls.
export class CustomOrbitControls extends OrbitControls {
  constructor(camera: THREE.Camera, domElement: HTMLElement) {

    super(camera, domElement);
    

  }

}