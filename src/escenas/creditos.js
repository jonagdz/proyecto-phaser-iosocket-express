//Definiciones de elementos multimedia
import { DEF } from "../def.js";

//Clase Creditos
export class Creditos extends Phaser.Scene{
  constructor(){
    super({key:'creditos'});
  }

  //Procedimiento de creación 
  create(){
    const self = this;
    
    //Carga de imagen de fondo
    this.mar = this.add.image(0, 0, DEF.IMAGENES.FONDO).setOrigin(0).setScrollFactor(1);
    
    //Carga de audio
    self.sonidoCreditos = self.sound.add(DEF.AUDIO.CREDITOS,{volume: 0.4, loop: true});
    self.sonidoCreditos.play();

    //Cargo interacciones y sprite de Home
    self.home = self.add.sprite(50, 50, 'homes').setOrigin(0).setScrollFactor(1).setDepth(2).setInteractive().on('pointerdown', () => clickHome());
    self.home.setDisplaySize(150, 150).setDepth(10);
    self.home.setInteractive().on('pointerover', () => elegirHome(1));
    self.home.setInteractive().on('pointerout', () => elegirHome(2));
    
    //Créditos
    self.textCred1 =  self.add.text(600, 200, 'El Llanto del Lobo', { font: '120px DM Serif Text', fill: '#000000' }).setScrollFactor(0).setDepth(10);
    self.textCred2 =  self.add.text(750, 350, '© 2022 - El Llanto del Lobo - ', { font: '50px DM Serif Text', fill: '#000000' }).setScrollFactor(0).setDepth(10);
    self.textCred5 =  self.add.text(100, 450, 'Música: https://www.bensound.com - https://pixabay.com/es/ \nSonidos: https://mixkit.co/free-sound-effects \nVideo: https://pixabay.com/es/ \nImágenes: https://www.pinterest.com/pin/774478467142903900/ \n- https://es.wikipedia.org/wiki/Tipo_XXVI - http://www.shipsproject.org/Wrecks/Wk_JamesEaganLayne.html \nSprite de particula: https://.pngtree.com/so/Humo \nSprite de explosión: https://www.pngitem.com/middle/hbhxbwb_explosion-sprite-sheet-free-hd-png-download/', { font: '40px DM Serif Text', fill: '#000000' }).setScrollFactor(0).setDepth(10);
    self.textCred3 =  self.add.text(550, 810, 'Proyecto - Ingeniería en Informática - Tutor: Jose Dominguez', { font: '40px DM Serif Text', fill: '#000000'}).setScrollFactor(0).setDepth(10);
    self.textCred4 =  self.add.text(800, 860, 'Equipo de desarrollo:', { font: '40px DM Serif Text', fill: '#000000' }).setScrollFactor(0).setDepth(10);
    self.textCred4 =  self.add.text(200, 910, 'Alvaro Loustou - Juan Pablo Perdomo - Iván Larrosa - Jonathan Diaz - Kevin Chaure', { font: '40px DM Serif Text', fill: '#000000' }).setScrollFactor(0).setDepth(10);
    self.textCred5 =  self.add.text(760, 1010, 'Universidad de la Empresa', { font: '40px DM Serif Text', fill: '#000000'}).setScrollFactor(0).setDepth(10);
    
    //Vuelvo a Inicio - GameMenu
    function clickHome(){
      self.sonidoCreditos.stop();
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

