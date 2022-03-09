//Definiciones de elementos multimedia
import { DEF } from "../def.js";

//Clase GameOver
export class GameOver extends Phaser.Scene{
  constructor(){
    super({key:'gameOver'});
  }

  //Procedimiento inicializador
  init(data){ 
    this.socket = data.socket;
    this.resultado = data.resultado;
    this.equipo = data.equipo;
  }

  //Procedimiento de creación 
  create(){
    const self = this;

    //Obtengo el centro del canvas
    const screenCenterX = self.cameras.main.worldView.x + self.cameras.main.width / 2;
    const screenCenterY = self.cameras.main.worldView.y + self.cameras.main.height / 2;

    //Carga de imagen de fondo
    self.add.image(0, 0, DEF.IMAGENES.FONDO).setOrigin(0).setScrollFactor(1);
    
    self.home = self.add.sprite(screenCenterX, 650, 'homes').setOrigin(0).setScrollFactor(1).setDepth(2).setInteractive().on('pointerdown', () => volverMenu());
    self.home.setDisplaySize(150, 150);
    self.home.setInteractive().on('pointerover', () => elegirHome(1));
    self.home.setInteractive().on('pointerout', () => elegirHome(2));

    //Muestro mensaje dependiendo de la opción de ingreso a la sala
    if (self.resultado == 1){
      if(self.equipo == 1){
          self.txt = self.add.text(screenCenterX, screenCenterY,'Victoria del Equipo 1', { font: '60px Stencil', fill: '#000000'}).setScrollFactor(0).setOrigin(0.5);
      }else{
        self.txt2 = self.add.text(screenCenterX, screenCenterY, 'Victoria del Equipo 2', { font: '60px Stencil', fill: '#000000'}).setScrollFactor(0).setOrigin(0.5);
      }
    }else if(self.resultado == 2){
      if(self.equipo == 1){
        self.txt = self.add.text(screenCenterX, screenCenterY,'Equipo 1 ha sido Derrotado', { font: '60px Stencil', fill: '#000000'}).setScrollFactor(0).setOrigin(0.5);
      }else{
        self.txt2 = self.add.text(screenCenterX, screenCenterY, 'Equipo 2 ha sido Derrotado', { font: '60px Stencil', fill: '#000000'}).setScrollFactor(0).setOrigin(0.5);
      }
    }

    //Vuelvo a Inicio - GameMenu
    function volverMenu(){
      //self.sonidoGameOver.stop();
      self.socket.disconnect();
      self.scene.start(DEF.SCENES.MENUPRINCIPAL);
    }
    
    //Elección de Home
    function elegirHome (valhome) {
      if(valhome===1){
        self.anims.create({  
          key: 'animhome',
          frames: [
            { key: 'homes',frame:"home2.png" },
          ],
          frameRate: 5,
          repeat:-1,
          hideOnComplete: true,
        });
        self.home.play('animhome');
      }
      else{
        self.anims.create({ 
          key: 'animhome2',
          frames: [
            { key: 'homes',frame:"home.png" },
          ],
          frameRate: 5,
          repeat:-1,
          hideOnComplete: true,
        });
        self.home.play('animhome2');
      }
    }
  }
}