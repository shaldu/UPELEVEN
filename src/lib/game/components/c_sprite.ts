import { Types, Component } from 'ecsy';
import type { InstancedUniformsMesh } from 'three-instanced-uniforms-mesh';
import type * as THREE from 'three';
import { _SHEETHEIGHT, _SHEETWIDTH, _SPRITEWIDTH, _SPRITEHEIGHT, _TimeTick } from '../config';

export class C_Sprite extends Component<C_Sprite>
{
    texture: THREE.Texture | undefined;
    rowPosition: number | undefined;
    columnPosition: number | undefined;
    spriteWidth: number = _SHEETWIDTH
    spriteHeight: number = _SHEETHEIGHT;
    numberOfFrames: number = 0;
    flipped: boolean = false;
    sheetWidth: number = _SHEETWIDTH;
    sheetHeight: number = _SHEETHEIGHT;
    opacity: number = 1;
    updated: boolean = false;
    currentFrame: number = 0;
    frameTimer: number = 0;
    tickSpeed: number = _TimeTick / 1;
    matrixId: number | undefined;
    playbackSpeed: number = 1;
    instancedMeshRef: InstancedUniformsMesh<any> | undefined;

    
}
C_Sprite.schema = {
    texture: { type: Types.Ref, default: undefined },
    rowPosition: { type: Types.Number, default: 0 },
    columnPosition: { type: Types.Number, default: 0 },
    numberOfFrames: { type: Types.Number, default: 0 },
    spriteWidth: { type: Types.Number, default: _SPRITEWIDTH },
    spriteHeight: { type: Types.Number, default: _SPRITEHEIGHT },
    flipped: { type: Types.Boolean, default: false },
    sheetWidth: { type: Types.Number, default: _SHEETWIDTH },
    sheetHeight: { type: Types.Number, default: _SHEETHEIGHT },
    opacity: { type: Types.Number, default: 1 },
    updated: { type: Types.Boolean, default: false },
    currentFrame: { type: Types.Number, default: 0 },
    frameTimer: { type: Types.Number, default: 0 },
    tickSpeed: { type: Types.Number, default: _TimeTick / 1 },
    matrixId: { type: Types.Number, default: undefined },
    instancedMeshRef: { type: Types.Ref, default: undefined }
}