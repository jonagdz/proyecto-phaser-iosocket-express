import { DEF } from "../def.js";

//Clase que permite bootear el juego
export class bootGame extends Phaser.Scene{
    
    constructor()
    {
        super("bootGame");
    }

    loadImages() {
        this.load.setPath("./src/assets");

        for (let imagen in DEF.IMAGENES) {
            this.load.image(DEF.IMAGENES[imagen], DEF.IMAGENES[imagen]);
        }
    }

    loadAudio() {
        this.load.setPath("./src/assets");

        for (let audio in DEF.AUDIO) {
            this.load.audio(DEF.AUDIO[audio], DEF.AUDIO[audio]);
        }
    }

    loadSprites() {
        this.load.setPath("./src/assets");
        for (let sprite in DEF.SPRITES) {
            if(sprite.includes("EXP"))
            {
                this.load.atlas("explot",DEF.SPRITES[sprite],'./explosion.json');
                
            }
            if(sprite.includes("INF")){
                this.load.atlas('infos', DEF.SPRITES[sprite],'./info.json');
                
            }
            if(sprite.includes("DEST")){
                this.load.atlas('destroyy', DEF.SPRITES[sprite],'./destroy.json');

            }
            if(sprite.includes("UBOOT")){
                this.load.atlas('uboots', DEF.SPRITES[sprite],'./uboot.json');
            }
            if(sprite.includes("HOMES")){
                this.load.atlas('homes', DEF.SPRITES[sprite],'./homejj.json');
            }
            if(sprite.includes("LOAD")){
                this.load.atlas('load', DEF.SPRITES[sprite],'./load.json');
            }
            else
            {
                this.load.image(DEF.SPRITES[sprite], DEF.SPRITES[sprite]);
            }
        }
    }
    
    // Funcion preload: Cargo todos los recursos que utilizare en el juego como imagenes y demas
    preload() 
    {
        this.loadImages();
        this.loadAudio();
        this.loadSprites();
      }

    create()
    {
        this.scene.start(DEF.SCENES.MENU);
    }
}