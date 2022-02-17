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
      }

    create()
    {
        this.scene.start("game");
        this.physics.world.setBounds(0, 0, 1024, 768);
    }
}