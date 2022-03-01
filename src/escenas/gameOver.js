import { DEF } from "../def.js";

export class gameOver extends Phaser.Scene{
  constructor(){
    super({key:'gameOver'});
  }

  init(data){ 
    this.socket = data.socket;
    this.resultado = data.resultado;
    this.equipo = data.equipo;
  }

  // Creo todo el contenido del juego del juego, imagenes, los cursores, jugadores, barcos e implemento el WebSocket
  create(){
      console.log("estoy dentro de game over");
    const self = this;
    this.boton= self.add.sprite(500, 500, 'uboots').setOrigin(0).setScrollFactor(1).setDepth(2).setInteractive().on('pointerdown', () => volverMenu());

    self.add.image(0, 0, DEF.IMAGENES.FONDO).setOrigin(0).setScrollFactor(1);
    
    // Muestro el mensaje dependiendo de con que opcion fue llamada la escena
    if (self.resultado == 1){
        if(self.equipo == 1){
            this.txt = self.add.text(480, 400,'Victoria del Equipo 1', { font: '50px Courier', fill: '#000000'}).setScrollFactor(0).on('pointerdown', () => volverMenu());
        }else{
            this.txt2 = self.add.text(480, 400, 'Victoria del Equipo 2', { font: '50px Courier', fill: '#000000'}).setScrollFactor(0).on('pointerdown', () => volverMenu());
        }
    }else if(self.resultado == 2){
        if(self.equipo == 1){
            this.txt = self.add.text(480, 400,'Equipo 1 ha sido Derrotado', { font: '50px Courier', fill: '#000000'}).setScrollFactor(0).on('pointerdown', () => volverMenu());
        }else{
            this.txt2 = self.add.text(480, 400, 'Equipo 2 ha sido Derrotado', { font: '50px Courier', fill: '#000000'}).setScrollFactor(0).on('pointerdown', () => volverMenu());
        }
    }
    function volverMenu(){
        var data = {
            socket: self.socket,
        }
        self.scene.start(DEF.SCENES.MENU, data);
    }
  }
}