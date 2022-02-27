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
        /*this.load.image('uboot', './src/assets/uboot7.png');
        this.load.image('mar', './src/assets/mar.png');
        this.load.image('fondoWaitRoom', './src/assets/fondoEscena.jpg');
        this.load.image('Blue', './src/assets/Blue2.png');
        this.load.image('bullet', 'src/assets/canonB.png');
        this.load.image('crosshair', 'src/assets/Crosshair.png')
        this.load.audio('Music', './src/assets/bensound-deepblue.mp3');
        this.load.image('destroyer', './src/assets/Destroyer.png');
        this.load.image('bomba1', './src/assets/bomba1.png');
        this.load.image('island1', './src/assets/island1.png');
        this.load.atlas("explot",'./src/assets/explosion.png','./src/assets/explosion.json');
        this.load.image('bomba', './src/assets/bomba1.png');
        this.load.image('mask', './src/assets/mask.png');
        this.load.image('costa1', './src/assets/costa1.png');
        this.load.image('costa2', './src/assets/costa2.png');
        this.load.image('carguero', './src/assets/liberty.png');
        this.load.image('UbootProfundidad1', './src/assets/uboot7P1.png');
        this.load.image('UbootProfundidad2', './src/assets/uboot7P3.png');*/
      }

    create()
    {
        this.scene.start(DEF.SCENES.MENU);
    }
}