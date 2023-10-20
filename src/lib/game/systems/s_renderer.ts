import * as THREE from 'three';
import type { InstancedUniformsMesh } from 'three-instanced-uniforms-mesh';
import { System } from 'ecsy';
import { C_Sprite, C_Transform } from '../components'
import { _SHEETHEIGHT, _SHEETWIDTH, _SPRITEHEIGHT, _SPRITEWIDTH, _TimeTick, _MAXTILES } from '../config'


export class S_Renderer extends System {
    time = 0;

    execute(delta: number, time: number) {
        this.setSpriteRender(delta, time);
    }

    setSpriteRender(delta: number, time: number) {
        //handles the logic for rendering sprites with a transform
        this.queries.spriteRenderer.results.forEach(entity => {
            //if the hasnt been updated yet, update it and set the updated flag to true, so it doesnt update again
            //if the sprite has more than one frame, always update it
            const spriteComponent = entity.getMutableComponent(C_Sprite) as C_Sprite;
            const transformComponent = entity.getMutableComponent(C_Transform) as C_Transform;
            //update the istanced mesh once to set the correct texture position

            if (spriteComponent.matrixId !== undefined && spriteComponent.matrixId >= 0) {

                this.setSpritePosition(spriteComponent.instancedMeshRef, spriteComponent.matrixId, transformComponent.position);
                this.setOpacity(spriteComponent.instancedMeshRef, spriteComponent.matrixId, spriteComponent.opacity);

                //only call this if the sprite has more than one frame
                if (spriteComponent.updated === false) {
                    this.setTextureOffset(spriteComponent.instancedMeshRef, spriteComponent.matrixId, new THREE.Vector2(spriteComponent.columnPosition, spriteComponent.rowPosition));
                    spriteComponent.updated = true;
                } else if (spriteComponent.numberOfFrames >= 1) {

                    spriteComponent.frameTimer += spriteComponent.tickSpeed;
                    if (spriteComponent.frameTimer >= this.time) {
                        spriteComponent.currentFrame++;
                        if (spriteComponent.currentFrame >= spriteComponent.numberOfFrames) {
                            spriteComponent.currentFrame = 0;
                        }
                        this.setTextureOffset(spriteComponent.instancedMeshRef, spriteComponent.matrixId, new THREE.Vector2(spriteComponent.currentFrame, spriteComponent.rowPosition ?? 0 + spriteComponent.currentFrame));
                        spriteComponent.frameTimer = 0;
                    }

                }

            }

        });
    }

    setSpritePosition(instancedMesh: typeof InstancedUniformsMesh | any, matrixId: number, position: THREE.Vector2) {
        instancedMesh.setUniformAt('vPosition', matrixId, new THREE.Vector4(position.x, position.y, 1, 0));
    }

    setTextureOffset(instancedMesh: typeof InstancedUniformsMesh | any, matrixId: number, offset: THREE.Vector2) {

        //offset.x = columnPosition
        //offset.y = rowPosition
        const x = (((offset.x * _SPRITEWIDTH)) / _SHEETWIDTH);
        const y = 1 - (((offset.y * _SPRITEHEIGHT) + _SPRITEHEIGHT) / _SHEETHEIGHT);

        instancedMesh.setUniformAt('texOffset', matrixId, new THREE.Vector4(x, y, 0, 0));
    }

    setOpacity(instancedMesh: typeof InstancedUniformsMesh | any, matrixId: number, opacity: number) {
        instancedMesh.setUniformAt('opacity', matrixId, opacity);
    }
}

S_Renderer.queries = {
    spriteRenderer: {
        components: [C_Sprite, C_Transform],
    }
}