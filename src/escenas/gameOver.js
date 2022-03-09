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
    //console.log("estoy dentro de game over");
    const self = this;
    const screenCenterX = self.cameras.main.worldView.x + self.cameras.main.width / 2;
    const screenCenterY = self.cameras.main.worldView.y + self.cameras.main.height / 2;

    self.add.image(0, 0, DEF.IMAGENES.FONDO).setOrigin(0).setScrollFactor(1);
    //self.sonidoGameOver = self.sound.add(DEF.AUDIO.ENDGAME,{volume: 0.4, loop: true});
    //self.sonidoGameOver.play();
    
    self.home= self.add.sprite(screenCenterX, 650, 'homes').setOrigin(0).setScrollFactor(1).setDepth(2).setInteractive().on('pointerdown', () => volverMenu());
    self.home.setDisplaySize(150, 150);
    self.home.setInteractive().on('pointerover', () => ElegirHome(1));
    self.home.setInteractive().on('pointerout', () => ElegirHome(2));

    // Muestro el mensaje dependiendo de con que opcion fue llamada la escena
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
    function volverMenu(){
      //self.sonidoGameOver.stop();
      self.socket.disconnect();
      self.scene.start(DEF.SCENES.MENUPRINCIPAL);
    }
    
    function ElegirHome (valhome) {
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