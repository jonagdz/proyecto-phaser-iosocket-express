export class esperaFullServer extends Phaser.Scene{
    constructor(){
      super({key:'esperaFullServer'});
    }
    

    preload(){
      this.load.image('fondo', './src/assets/fondoEscena.jpg');
    }

    // Creo todo el contenido del juego del juego, imagenes, los cursores, jugadores, barcos e implemento el WebSocket
    create(){
      this.add.image(0, 0, 'fondo').setOrigin(0).setScrollFactor(1);
      this.add.text(450, 450, "Estas en la sala de espera debido a que la", {fill: '#000000', fontSize: '40px', fontFamily: 'Arial black',})
      this.add.text(450, 500, "cantidad de maximos jugadores se alcanzo.", {fill: '#000000', fontSize: '40px', fontFamily: 'Arial black',})
    }
    update(){

    }
}