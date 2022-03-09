//Definiciones de elementos multimedia
import { DEF } from "../def.js";

//Clase Controles
export class Controles extends Phaser.Scene{
  constructor(){
    super({key:'controles'});
  }

  //Procedimiento de creación 
  create(){
    const self = this;

    //Carga de imagen de fondo
    self.add.image(0, 0, DEF.IMAGENES.FONDO).setOrigin(0).setScrollFactor(1);

    //Carga de controles para equipos
    self.imagenControles = self.physics.add.image(20, 370, DEF.IMAGENES.CONTROLES1).setOrigin(0).setScrollFactor(0).setDepth(10)
    self.imagenControles.setDisplaySize(940, 460);
    self.imagenControles2 = self.physics.add.image(960, 370, DEF.IMAGENES.CONTROLES2).setOrigin(0).setScrollFactor(0).setDepth(10)
    self.imagenControles2.setDisplaySize(940, 460);

    //Carga de audio
    self.sonidoControles = self.sound.add(DEF.AUDIO.ENDGAME,{volume: 0.4, loop: true});
    self.sonidoControles.play();
    
    //Carga de sprites
    self.home = self.add.sprite(50, 50, 'homes').setOrigin(0).setScrollFactor(1).setDepth(2).setInteractive().on('pointerdown', () => clickHome());
    self.home.setDisplaySize(150, 150);
    self.home.setInteractive().on('pointerover', () => elegirHome(1));
    self.home.setInteractive().on('pointerout', () => elegirHome(2));
   
    self.txt = self.add.text(350, 200,'Controles: ', { font: '70px Britannic bold', fill: '#000000' }).setScrollFactor(0).setDepth(10);

    //Vuelvo a Inicio - GameMenu
    function clickHome() {
      self.sonidoControles.stop();
      self.scene.start(DEF.SCENES.MENUPRINCIPAL);
    }    

    //Elección de Home
    function elegirHome(valhome){
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