//Definiciones de elementos multimedia
import { DEF } from "../def.js";

//Clase BootGame
export class BootGame extends Phaser.Scene{
    constructor()
    {
        super("BootGame");
    }

    loadImages(){
        this.load.setPath("./src/assets");
        for (let imagen in DEF.IMAGENES) {
            this.load.image(DEF.IMAGENES[imagen], DEF.IMAGENES[imagen]);
        }
    }

    loadVideo(){
        this.load.setPath("./src/assets");
        for (let video in DEF.VIDEO) {
            this.load.video(DEF.VIDEO[video],DEF.VIDEO[video]);
        }
    }

    loadAudio(){
        this.load.setPath("./src/assets");
        for (let audio in DEF.AUDIO) {
            this.load.audio(DEF.AUDIO[audio], DEF.AUDIO[audio]);
        }
    }

    loadSprites(){
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
            if(sprite.includes("TXTESP")){
                this.load.atlas('txtesp', DEF.SPRITES[sprite],'./txtespera.json');
            }
            if(sprite.includes("TXTESP2")){
                this.load.atlas('txtesp2', DEF.SPRITES[sprite],'./txtespera2.json');
            }
            if(sprite.includes("INITPART")){
                this.load.atlas('initpart', DEF.SPRITES[sprite],'./iniciarpart.json');
            }
            if(sprite.includes("CARGARPART")){
                this.load.atlas('cargarpart', DEF.SPRITES[sprite],'./cargarpart.json');
            }
            if(sprite.includes("CONTROLS")){
                this.load.atlas('controls', DEF.SPRITES[sprite],'./controls.json');
            }
            if(sprite.includes("CREDITS")){
                this.load.atlas('credits', DEF.SPRITES[sprite],'./credits.json');
            }
            if(sprite.includes("TXTESP3")){
                this.load.atlas('txtesp3', DEF.SPRITES[sprite],'./textespera3.json');
            }
            if(sprite.includes("CARGUEROSALERT")){
                this.load.atlas('CARGUEROSALERT', DEF.SPRITES[sprite],'./alertacargueros.json');
            }
            if(sprite.includes("ALERTADISPARO")){
                this.load.atlas('ALERTADISPARO', DEF.SPRITES[sprite],'./alertadisparo.json');
            }
            if(sprite.includes("CRUZ")){
                this.load.atlas('CRUZ', DEF.SPRITES[sprite],'./cruzaler.json');
            }
            else
            {
                this.load.image(DEF.SPRITES[sprite], DEF.SPRITES[sprite]);
            }
        }
    }
    
    //Carga de todos los recursos a utilizar en el juego
    preload() 
    {
        this.loadImages();
        this.loadVideo();
        this.loadAudio();
        this.loadSprites();
    }

    //Procedimiento de creaci??n 
    create()
    {
        this.scene.start(DEF.SCENES.MENUPRINCIPAL);
    }
}