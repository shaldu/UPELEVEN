//@ts-ignore
import * as THREE from 'three';
//@ts-ignore
import { System } from 'ecsy';
import { C_Burnable } from '../components/loader'
import { _TimeTick } from '$lib/game/config'
import { Helpers } from '$lib/game/helpers'
import type Tile from '../tile';

export class S_Burn extends System {


    private timer: number = 0;
    private timerCount: number = 0;
    private tickRate: number = _TimeTick

    init() {

        this.queries.burning.results.forEach(entity => {
            const burning = entity.getMutableComponent(C_Burnable);
  
            if (burning !== undefined) {
                //@ts-ignore
                
 
                
            }
        });
    }

    execute(delta: number, time: number) {
        this.timerCount += delta;
        if (this.timerCount > this.tickRate) {
            this.timerCount = 0;
           
            
            this.queries.burning.results.forEach(entity => {
                
                let burning:any = entity.getMutableComponent(C_Burnable);   
                if (burning !== undefined) {
                    burning.entity.currentBurnTime += (this.tickRate);
                    
                    this.updateHealthValue(burning.entity);
                    this.spreadBurn(burning.entity);
                    console.log(burning.entity.currentBurnTime);
                    
                    if (burning.entity.currentBurnTime > burning.entity.maxBurnTime || burning.entity.health <= 0) {
                        burning.isBurning = false;
                        burning.currentBurnTime = 0;
                        burning.entity.stopBurn();
                        if (burning.entity.health <= 0) {
                            burning.entity.burnedOut();
                        }
                    }
                }
            });
        }
    }

    updateHealthValue(burning: any) {
        let damage = Math.floor(Helpers.clamp((burning.burnDamage / (burning.burnResistance)), 1, 99999));
        burning.health = Helpers.clamp((burning.health - damage), 0, burning.maxHealth);        
    }

    spreadBurn(entity: Tile) {
        let neighbours:Tile[] = entity.map.getTileNeighbours(entity);
        let spreadChance:number = entity.spreadChancePercantage;
        //get random neighbour
        let randomNeighbour = neighbours[Math.ceil(Math.random() * neighbours.length)];
        if (Helpers.getRandomBoolWithWeightPercentage(spreadChance)) {
            if (randomNeighbour !== undefined) {
                randomNeighbour.burn();
            }
        }
    }
}

S_Burn.queries = {
    burning: {
        components: [C_Burnable],
    }
}