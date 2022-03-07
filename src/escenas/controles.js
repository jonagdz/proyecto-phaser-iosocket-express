import { DEF } from "../def.js";

export class controles extends Phaser.Scene{
  constructor(){
      super({key:'controles'});
  }

  create(){
    const self = this;
    self.add.image(0, 0, DEF.IMAGENES.FONDO).setOrigin(0).setScrollFactor(1);
    self.imagenControles = self.physics.add.image(700, 300, DEF.IMAGENES.CONTROLES).setOrigin(0).setScrollFactor(0).setDepth(10)
    self.imagenControles.setDisplaySize(700, 700);

    this.sonidoControles = this.sound.add(DEF.AUDIO.ENDGAME,{volume: 0.4, loop: true});
    this.sonidoControles.play();
    //////////////////////////////////////////////////CARGO INTERACCIONES Y SPRITE DE HOME/////////////////////////////////////////////////////////////////
    self.home = self.add.sprite(50, 50, 'homes').setOrigin(0).setScrollFactor(1).setDepth(2).setInteractive().on('pointerdown', () => ClickHome());
    self.home.setDisplaySize(150, 150);
    self.home.setInteractive().on('pointerover', () => ElegirHome(1));
    self.home.setInteractive().on('pointerout', () => ElegirHome(2));
   
    self.txt = self.add.text(520, 200,'Controles...', { font: '50px Courier', fill: '#000000'}).setScrollFactor(0);

    function ClickHome () {
        self.sonidoControles.stop();
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