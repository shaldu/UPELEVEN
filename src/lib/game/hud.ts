
import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import type Game from './game';

export default class HUD {

    gui: GUI;
    game: Game

    //FOLDERS
    generalFolder: any;

    constructor(game: Game) {
        this.gui = new GUI();
        this.game = game;

        this.initHUDs();
    }

    initHUDs() {
        this.create_General_GUI();
    }

    //create a seed input field
    create_General_GUI() {
        
        if (this.generalFolder) this.generalFolder.destroy();
        this.generalFolder = this.gui.addFolder('General');

        const obj = { seed: this.game.seed };
        this.generalFolder.add(obj, 'seed').name('Seed').onChange((seed: string) => {
            //DO SOMETHING
        });
    }
}