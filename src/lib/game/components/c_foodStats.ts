import { Component, Entity, Types } from 'ecsy';
import * as THREE from 'three';
import { Vector2Type } from './types';
import { removeEntityFromMap } from '../config';
import Game from '../game';

export class C_FoodStats extends Component<C_FoodStats>
{
    id: number = 0;
    name: string = "none";
    type: "food" | "none" = "none";
    energy: number = 40;
    game: Game | undefined;

    kill() {
        if (this.game == undefined || this.game.map == undefined) return;
        removeEntityFromMap(this.id, this.game.map);
    }
}

C_FoodStats.schema = {
    id: { type: Types.Number, default: 0 },
    name: { type: Types.String, default: "none" },
    type: { type: Types.String, default: "none" },
    game: { type: Types.Ref, default: undefined },
    energy: { type: Types.Number, default: 40 },
}