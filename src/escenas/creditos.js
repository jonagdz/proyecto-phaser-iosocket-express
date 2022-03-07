import { DEF } from "../def.js";

export class creditos extends Phaser.Scene{
  constructor(){
      super({key:'creditos'});
  }

  create(){
    const self = this;
    
    // Fondo
    this.mar = this.add.image(0, 0, DEF.IMAGENES.FONDO).setOrigin(0).setScrollFactor(1);
    
    // Sonido
    let soundBackground = this.sound.add(DEF.AUDIO.CREDITOS,{volume: 0.07, loop: true});
    soundBackground.play();

    //////////////////////////////////////////////////CARGO INTERACCIONES Y SPRITE DE HOME/////////////////////////////////////////////////////////////////
    self.home = self.add.sprite(50, 50, 'homes').setOrigin(0).setScrollFactor(1).setDepth(2).setInteractive().on('pointerdown', () => ClickHome());
    self.home.setDisplaySize(150, 150).setDepth(10);
    self.home.setInteractive().on('pointerover', () => ElegirHome(1));
    self.home.setInteractive().on('pointerout', () => ElegirHome(2));
   
    self.textCred1 =  self.add.text(600, 200, 'El Llanto del Lobo', { font: '120px DM Serif Text', fill: '#000000' }).setScrollFactor(0).setDepth(10);
    self.textCred2 =  self.add.text(750, 350, '© 2022 - El Llanto del Lobo - ', { font: '50px DM Serif Text', fill: '#000000' }).setScrollFactor(0).setDepth(10);
    self.textCred5 =  self.add.text(100, 450, 'Música: https://www.bensound.com - https://pixabay.com/es/ \nSonidos: https://mixkit.co/free-sound-effects \nVideo: https://pixabay.com/es/ \nImágenes: https://www.pinterest.com/pin/774478467142903900/ \n- https://es.wikipedia.org/wiki/Tipo_XXVI - http://www.shipsproject.org/Wrecks/Wk_JamesEaganLayne.html \nSprite de particula: https://.pngtree.com/so/Humo \nSprite de explosión: https://www.pngitem.com/middle/hbhxbwb_explosion-sprite-sheet-free-hd-png-download/', { font: '40px DM Serif Text', fill: '#000000' }).setScrollFactor(0).setDepth(10);
    self.textCred3 =  self.add.text(550, 810, 'Proyecto - Ingeniería en Informática - Tutor: Jose Dominguez', { font: '40px DM Serif Text', fill: '#000000'}).setScrollFactor(0).setDepth(10);
    self.textCred4 =  self.add.text(800, 860, 'Equipo de desarrollo:', { font: '40px DM Serif Text', fill: '#000000' }).setScrollFactor(0).setDepth(10);
    self.textCred4 =  self.add.text(200, 910, 'Alvaro Loustou - Juan Pablo Perdomo - Iván Larrosa - Jonathan Diaz - Kevin Chaure', { font: '40px DM Serif Text', fill: '#000000' }).setScrollFactor(0).setDepth(10);
    self.textCred5 =  self.add.text(760, 1010, 'Universidad de la Empresa', { font: '40px DM Serif Text', fill: '#000000'}).setScrollFactor(0).setDepth(10);
  
    function ClickHome(){
      soundBackground.stop();
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

