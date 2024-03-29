import { Entity, World } from "ecsy";
import { default as MapMap } from "./map";

export const _TimeTick = 0.2;

export const _SPRITEWIDTH = 18;
export const _SPRITEHEIGHT = 18;

export const _SHEETWIDTH = 90;
export const _SHEETHEIGHT = 72;

export const _MAXENTITIES = 32*32;
export const _MAXTILES = 256*256;

export const _MAPSIZE = 32;

export let _TIMEDIALATION = 1;
export const _SEED = "test";

/**
 * 
 * @param weight Value between 0 and 100
 * @returns returns true if the random number is less than the weight
 */
export function weightedBooleanPercantage(weight: number) {
    return (Math.random() * 100) < weight;
}

export function setTimedialation(speed: number) {
    _TIMEDIALATION = speed;
}

//create a map with id and Entities
export let entityMap: Map<number, Entity> = new Map();

export let addEntityToMap = (id: number, entity: Entity) => {
    entityMap.set(id, entity);
}
export let getEntityFromMap = (id: number) => {
    return entityMap.get(id);
}
export let removeEntityFromMap = (id: number, map:MapMap) => {
    map.setOpacity(map.instancedMeshEntities, id, 0);
    getEntityFromMap(id)?.remove();
    entityMap.delete(id);
}
export let getFreeEntityId = () => {
    let id = 0;
    while (entityMap.has(id)) {
        id++;
    }
    return id;
}