import { Component, Entity, Types } from 'ecsy';
import * as THREE from 'three';
import { Vector2Type } from './types';
import { removeEntityFromMap } from '../config';
import Game from '../game';
import { C_FoodStats } from './c_foodStats';

export class C_AnimalStats extends Component<C_AnimalStats>
{
    id: number = 0;
    name: string = "none";
    generation: number = 0;
    type: "chicken" | "wolf" | "food" |"none" = "none";
    energyMax: number = 100;
    energyCurrent: number = this.energyMax;
    hungerMax: number = 100;
    hungerCurrent: number = this.hungerMax;
    game: Game | undefined;
    restingBiasPercentage: number = 20;
    restingDuration: number = 1;

    eat(food: Entity) {
        const foodStatsComponent = food.getComponent(C_FoodStats) as C_FoodStats;
        const animalStatsComponent = this;
        if (foodStatsComponent == undefined || animalStatsComponent == undefined) return;

        animalStatsComponent.energyCurrent += foodStatsComponent.energy;
        if (animalStatsComponent.energyCurrent > animalStatsComponent.energyMax) animalStatsComponent.energyCurrent = animalStatsComponent.energyMax;

        animalStatsComponent.hungerCurrent += foodStatsComponent.energy / 2;
        if (animalStatsComponent.hungerCurrent > animalStatsComponent.hungerMax) animalStatsComponent.hungerCurrent = animalStatsComponent.hungerMax;

        foodStatsComponent.kill();
    }

    kill() {
        if (this.game == undefined || this.game.map == undefined) return;
        removeEntityFromMap(this.id, this.game.map);
    }
}

C_AnimalStats.schema = {
    id: { type: Types.Number, default: 0 },
    name: { type: Types.String, default: "none" },
    type: { type: Types.String, default: "none" },
    generation: { type: Types.Number, default: 0 },
    energyMax: { type: Types.Number, default: 100 },
    energyCurrent: { type: Types.Number, default: 100 },
    hungerMax: { type: Types.Number, default: 100 },
    hungerCurrent: { type: Types.Number, default: 100 },
    game: { type: Types.Ref, default: undefined },
    restingBiasPercentage: { type: Types.Number, default: 20 },
    restingDuration: { type: Types.Number, default: 1 },
}