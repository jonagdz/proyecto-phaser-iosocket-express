//Clase que permite bootear el juego
export class bootGame extends Phaser.Scene{
    
    constructor()
    {
        super("bootGame");
    }

    
    // Funcion preload: Cargo todos los recursos que utilizare en el juego como imagenes y demas
    preload() 
    {
        this.load.image('uboot', './src/assets/uboot7.png');
        this.load.image('mar', './src/assets/mar.png');
        this.load.image('Blue', './src/assets/Blue2.png');
        this.load.image('bullet', 'src/assets/canonA.png');
        this.load.image('crosshair', 'src/assets/Crosshair.png')
        this.load.audio('Music', './src/assets/bensound-deepblue.mp3');
        this.load.image('destroyer', './src/assets/Destroyer.png');
        this.load.image('bomba1', './src/assets/bomba1.png');
        this.load.image('island1', './src/assets/island1.png');
        this.load.atlas("explot",'./src/assets/explosion.png','./src/assets/explosion.json');
        this.load.image('bomba', './src/assets/bomba1.png');
      }

    create()
    {
        this.scene.start("game");
    }
}