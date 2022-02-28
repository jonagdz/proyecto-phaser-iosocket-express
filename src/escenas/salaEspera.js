import { DEF } from "../def.js";

export class salaEspera extends Phaser.Scene{
  constructor(){
    super({key:'salaEspera'});
  }

  init(data){ //opcion
    //console.log("Dentro de INIT salaEspera.js opcion:" +data.opcion)
    //console.log("Dentro de INIT salaEspera.js socketId: " +data.socket.id)
    this.socket = data.socket;
    this.opcion = data.opcion;
    this.equipo = data.equipo;
  }

  // Creo todo el contenido del juego del juego, imagenes, los cursores, jugadores, barcos e implemento el WebSocket
  create(){
    const self = this;

    //this.socket = io()
    console.log("Entré a salaEspera.js con el socket.id: " + this.socket.id + " - equipo: "+this.equipo);
    // Agrego imagen de fondo
    self.add.image(0, 0, DEF.IMAGENES.FONDO).setOrigin(0).setScrollFactor(1);

    this.load = self.add.sprite(680, 180, 'load').setOrigin(0).setScrollFactor(1).setDepth(2);
    this.load.setDisplaySize(600, 600);

    this.txt = self.add.sprite(480, 400, 'txtesp').setOrigin(0).setScrollFactor(1).setDepth(3);
    this.txt.setDisplaySize(1000, 1000);
    this.txt.setActive(false).setVisible(false);

    this.txt2 = self.add.sprite(480, 400, 'txtesp2').setOrigin(0).setScrollFactor(1).setDepth(3);
    this.txt2.setDisplaySize(1000, 1000);
    this.txt2.setActive(false).setVisible(false);
    
    self.anims.create({  // Se crea la animacion para la explosion luego de recibir disparo
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

    }else{

     self.txt2.setActive(true).setVisible(true);
     self.anims.create({  // Se crea la animacion para la explosion luego de recibir disparo
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
      //self.add.text(450, 450, "Estás en la sala de espera debido a que la", {fill: '#000000', fontSize: '40px', fontFamily: 'Arial black',})
     // self.add.text(450, 500, "cantidad de maximos jugadores se alcanzó", {fill: '#000000', fontSize: '40px', fontFamily: 'Arial black',})
     // self.add.text(450, 550, "intente nuevamente en unos minutos.", {fill: '#000000', fontSize: '40px', fontFamily: 'Arial black',})
    }

    self.socket.on('JugadoresListosPlayer1', function(){
      var data = {
        socket: self.socket,
        equipo: self.equipo
      }
      self.scene.start(DEF.SCENES.GAME, data);
    })
  }
}