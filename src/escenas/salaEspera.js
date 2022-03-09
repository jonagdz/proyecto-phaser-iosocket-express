//Definiciones de elementos multimedia
import { DEF } from "../def.js";

//Clase SalaEspera
export class SalaEspera extends Phaser.Scene{
  constructor(){
    super({key:'salaEspera'});
  }

  //Procedimiento inicializador
  init(data){
    this.socket = data.socket;
    this.opcion = data.opcion;
    this.equipo = data.equipo;
    this.loadGame = {
      cargaPartida: Boolean,
      partidaCargada: Object
    };
    this.loadGame.cargaPartida = data.loadGame.cargaPartida;
    this.loadGame.partidaCargada = data.loadGame.partidaCargada;
  }

  //Procedimiento de creación 
  create(){
    const self = this;

    //Carga de imagen de fondo
    self.add.image(0, 0, DEF.IMAGENES.FONDO).setOrigin(0).setScrollFactor(1);

    //Textos a mostrar según la opción por la que ingresen a sala de espera
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
    
    //Cargo interacciones y sprite de Home
    self.home = self.add.sprite(50, 50, 'homes').setOrigin(0).setScrollFactor(1).setDepth(2).setInteractive().on('pointerdown', () => clickHome());
    self.home.setDisplaySize(150, 150);
    self.home.setInteractive().on('pointerover', () => elegirHome(1));
    self.home.setInteractive().on('pointerout', () => elegirHome(2));
    
    //Carga de la animación para el load
    self.anims.create({  
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

    //Muestro mensaje dependiendo de la opción de ingreso a la sala
    if (self.opcion === 1){
      self.txt.setActive(true).setVisible(true);
      //Se crea la animación para la explosion de recibir disparo
      self.anims.create({  
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
    }else if (self.opcion === 2){
      self.txt2.setActive(true).setVisible(true);
      //Se crea la animación para el load
      self.anims.create({  
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
    }else if(self.opcion === 3){
      self.txt3.setActive(true).setVisible(true);
      //Se crea la animación para el load
      self.anims.create({ 
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

    //Jugador 1 listo
    self.socket.on('JugadoresListosPlayer1', function(){
      var data = {
        socket: self.socket,
        equipo: self.equipo,
        loadGame: self.loadGame
      }
      self.scene.start(DEF.SCENES.GAME, data);
    })

    //Vuelvo a Inicio - GameMenu
    function clickHome(){
      self.socket.disconnect();
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