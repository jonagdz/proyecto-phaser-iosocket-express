import { DEF } from "../def.js";

export class salaEspera extends Phaser.Scene{
  constructor(){
    super({key:'salaEspera'});
  }

  init(data){
    this.socket = data.socket;
    this.opcion = data.opcion;
    this.equipo = data.equipo;
  }

  // Creo todo el contenido del juego del juego, imagenes, los cursores, jugadores, barcos e implemento el WebSocket
  create(){
    const self = this;
    //console.log("Entré a salaEspera.js con el socket.id: " + this.socket.id + " - equipo: "+this.equipo);

    // Agrego imagen de fondo
    self.add.image(0, 0, DEF.IMAGENES.FONDO).setOrigin(0).setScrollFactor(1);

    // Distintos textos a mostrar segun la opcion por la que ingresen a sala de espera
    this.load = self.add.sprite(680, 180, 'load').setOrigin(0).setScrollFactor(1).setDepth(2);
    this.load.setDisplaySize(600, 600);

    this.txt = self.add.sprite(480, 400, 'txtesp').setOrigin(0).setScrollFactor(1).setDepth(3);
    this.txt.setDisplaySize(1000, 1000);
    this.txt.setActive(false).setVisible(false);

    this.txt2 = self.add.sprite(480, 400, 'txtesp2').setOrigin(0).setScrollFactor(1).setDepth(3);
    this.txt2.setDisplaySize(1000, 1000);
    this.txt2.setActive(false).setVisible(false);

    this.txt3 = self.add.sprite(480, 400, 'txtesp3').setOrigin(0).setScrollFactor(1).setDepth(3);
    this.txt3.setDisplaySize(1000, 1000);
    this.txt3.setActive(false).setVisible(false);
    
    //////////////////////////////////////////////////CARGO INTERACCIONES Y SPRITE DE HOME/////////////////////////////////////////////////////////////////
    self.home = self.add.sprite(50, 50, 'homes').setOrigin(0).setScrollFactor(1).setDepth(2).setInteractive().on('pointerdown', () => ClickHome());
    self.home.setDisplaySize(150, 150);
    self.home.setInteractive().on('pointerover', () => ElegirHome(1));
    self.home.setInteractive().on('pointerout', () => ElegirHome(2));
   
    self.anims.create({  // Se crea la animacion para el load
      key: 'animinload',
      frames: [
          { key: 'load',frame:"load_01.png" },
          { key: 'load',frame:"load_02.png" },
          { key: 'load',frame:"load_03.png" },
          { key: 'load',frame:"load_04.png" },
          { key: 'load',frame:"load_05.png" },
          { key: 'load',frame:"load_06.png" },
          { key: 'load',frame:"load_07.png" },
          { key: 'load',frame:"load_08.png" },
          { key: 'load',frame:"load_09.png" },
          { key: 'load',frame:"load_10.png" },
          { key: 'load',frame:"load_11.png" },
          { key: 'load',frame:"load_12.png" },
          { key: 'load',frame:"load_13.png" },
          { key: 'load',frame:"load_14.png" },
          { key: 'load',frame:"load_15.png" },
          { key: 'load',frame:"load_16.png" },
      ],
      frameRate: 5,
      repeat:-1,
      hideOnComplete: true,
    });
    self.load.play('animinload');

    // Muestro el mensaje dependiendo de con que opcion fue llamada la escena
    if (self.opcion == 1){
      self.txt.setActive(true).setVisible(true);
      self.anims.create({  // Se crea la animacion para la explosion luego de recibir disparo
        key: 'animintxt',
        frames: [
          { key: 'txtesp',frame:"textoespera.png" },
          { key: 'txtesp',frame:"textoespera1.png" },
          { key: 'txtesp',frame:"textoespera2.png" },
          { key: 'txtesp',frame:"textoespera3.png" }
        ],
        frameRate: 5,
        repeat:-1,
        hideOnComplete: true,
        });
      self.txt.play('animintxt');
    }else if (self.opcion == 2){
      self.txt2.setActive(true).setVisible(true);
      self.anims.create({  // Se crea la animacion para el load
        key: 'animintxt2',
        frames: [
            { key: 'txtesp2',frame:"TXT.png" },
            { key: 'txtesp2',frame:"TXT1.png" },
            { key: 'txtesp2',frame:"TXT2.png" },
            { key: 'txtesp2',frame:"TXT3.png" }       
        ],
        frameRate: 5,
        repeat:-1,
        hideOnComplete: true,
      });
      self.txt2.play('animintxt2');
    }else if(self.opcion == 3){
      console.log("SALA DE ESPERA OPCION 3, PARTIDA EN CURSO")
      self.txt3.setActive(true).setVisible(true);
      self.anims.create({  // Se crea la animacion para el load
        key: 'animintxt3',
        frames: [
            { key: 'txtesp3',frame:"textesp1.png" },
            { key: 'txtesp3',frame:"textesp2.png" },
            { key: 'txtesp3',frame:"textesp3.png" },
            { key: 'txtesp3',frame:"textesp4.png" }       
        ],
        frameRate: 5,
        repeat:-1,
        hideOnComplete: true,
      });
      self.txt3.play('animintxt3');
    }

    self.socket.on('JugadoresListosPlayer1', function(){
      var data = {
        socket: self.socket,
        equipo: self.equipo
      }
      self.scene.start(DEF.SCENES.GAME, data);
    })

    function ClickHome(){
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