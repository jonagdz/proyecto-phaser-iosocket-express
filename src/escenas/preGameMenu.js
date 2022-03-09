//Definiciones de elementos multimedia
import { DEF } from "../def.js";

//Clase PreGameMenu
export class PreGameMenu extends Phaser.Scene{
  constructor(){
      super({key:'preGameMenu'});
  }

  //Procedimiento inicializador
  init(data)
  {
    this.socket = data.socket;
    this.loadGame = {
      cargaPartida: Boolean,
      partidaCargada: Object
    };
    this.loadGame.cargaPartida = data.cargaPartida;
    this.loadGame.partidaCargada = data.partidaCargada;
    this.contJugadores = data.contador;
    this.uno = data.uno;
    this.partidaIniciada = data.partIni;
  }

  //Procedimiento de creación 
  create(){
    const self = this;
    this.otroEquipo = 0;

    if((self.contJugadores === 2 && !self.uno) || (self.contJugadores === 2 && self.partidaIniciada))
    {
      self.socket.emit('jugador2Iniciado');
    }

    //Carga de imagen de fondo
    self.add.image(0, 0, DEF.IMAGENES.FONDO).setOrigin(0).setScrollFactor(1);

    //Carga de interacciones y sprite de destrucción
    this.destroy = self.add.sprite(790, 300, 'destroyy').setOrigin(0).setScrollFactor(1).setDepth(2).setInteractive().on('pointerdown', () => elegirEquipo(1));
    this.destroy.setInteractive().on('pointerover', () => elegirDestroy(1));
    this.destroy.setInteractive().on('pointerout', () => elegirDestroy(2));
    
    //Carga de interacciones y sprite de U-Boat
    this.uboot= self.add.sprite(790, 700, 'uboots').setOrigin(0).setScrollFactor(1).setDepth(2).setInteractive().on('pointerdown', () => elegirEquipo(2));
    this.uboot.setInteractive().on('pointerover', () => elegirUboot(1));
    this.uboot.setInteractive().on('pointerout', () => elegirUboot(2));
    
    //Carga de interacciones y sprite de Home
    this.home = self.add.sprite(50, 50, 'homes').setOrigin(0).setScrollFactor(1).setDepth(2).setInteractive().on('pointerdown', () => clickHome());
    this.home.setDisplaySize(150, 150);
    this.home.setInteractive().on('pointerover', () => elegirHome(1));
    this.home.setInteractive().on('pointerout', () => elegirHome(2));
   
    //Carga de interacciones y sprite de Información
    this.inf = self.add.sprite(1710, 880, 'infos').setOrigin(0).setScrollFactor(1).setDepth(2).setInteractive().on('pointerdown', () => clickInfo(1));
    this.inf.setDisplaySize(150, 150);
    this.inf.setInteractive().on('pointerover', () => elegirInfo(1));
    this.inf.setInteractive().on('pointerout', () => elegirInfo(2));
   
    //Carga de botón de información
    this.txt = self.add.image(1200, 400, DEF.IMAGENES.INFOTXT).setOrigin(0).setScrollFactor(1).setDepth(2);
    this.txt.setActive(false).setVisible(false)

    //Carga de botón para cierre de texto
    this.cls = self.add.image(1700, 580, DEF.IMAGENES.CLOSE).setOrigin(0).setScrollFactor(1).setDepth(2).setInteractive().on('pointerdown', () => elegirClose());
    this.cls.setDisplaySize(30, 30);
    this.cls.setActive(false).setVisible(false)

    //Envío del jugador 1 a la sala de espera con el equipo que eligio
    function elegirEquipo(equipoElegido){
      var datos = {
        equipoElegido: equipoElegido,
        loadGame: self.loadGame
      }
      var data = {
        socket: self.socket,
        opcion: 1, //Opción 1 para que en sala espera aparezca mensaje que espera por otros jugadores
        equipo: equipoElegido,
        loadGame: self.loadGame
      }
      self.socket.emit('JugadorUnoEligeEquipo', datos);
      self.scene.start(DEF.SCENES.LOBBY, data); 
    }
    
    //Elección de cierre de texto
    function elegirClose(){
      self.cls.setActive(false).setVisible(false)
      self.txt.setActive(false).setVisible(false)
    }

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

    //Elección de información
    function elegirInfo(tru){
      if(tru === 1){
        self.anims.create({  
          key: 'animinf1',
          frames: [
            { key: 'infos',frame:"information2.png" },
          ],
          frameRate: 5,
          repeat:-1,
          hideOnComplete: true,
        });
        self.inf.play('animinf1');
      }
      else{
        self.anims.create({  
          key: 'animinf',
          frames: [
            { key: 'infos',frame:"information.png" },
          ],
          frameRate: 5,
          repeat:-1,
          hideOnComplete: true,
        });
        self.inf.play('animinf');
      }
    }

    //Información
    function clickInfo(val){
      if(val === 1){
        self.txt.setActive(true).setVisible(true)
        self.cls.setActive(true).setVisible(true)
      }
      else{
        self.cls.setActive(false).setVisible(false)
        self.txt.setActive(false).setVisible(false)
      }
    }

    //Elección de equipo 1 
    function elegirDestroy(val){
      if(val === 1){
        self.anims.create({  
          key: 'animinDestroy',
          frames: [
            { key: 'destroyy',frame:"botond2.png" },
          ],
          frameRate: 5,
          repeat:-1,
          hideOnComplete: true,
        });
        self.destroy.play('animinDestroy');
      }else{
        self.anims.create({ 
          key: 'animinDestroy2',
          frames: [
            { key: 'destroyy',frame:"boton.png" },
          ],
          frameRate: 5,
          repeat:-1,
          hideOnComplete: true,
        });
        self.destroy.play('animinDestroy2');
      }
    }

    //Elección de equipo 2
    function elegirUboot(vall){
      if(vall === 1){
        self.anims.create({  
          key: 'animinBoot',
          frames: [
            { key: 'uboots',frame:"botonuboot2.png" },
          ],
          frameRate: 5,
          repeat:-1,
          hideOnComplete: true,
        });
        self.uboot.play('animinBoot');
      }
      else{
        self.anims.create({ 
          key: 'animinBoot2',
          frames: [
            { key: 'uboots',frame:"botonuboot.png" },
          ],
          frameRate: 5,
          repeat:-1,
          hideOnComplete: true,
        });
        self.uboot.play('animinBoot2');
      }
    }
    
    //Procedimientos sockets
    //Envío al jugador 2 directamente a la clase Game con el equipo que no eligió el jugador 1
    self.socket.on('JugadoresListosPlayer2', function(datos){
      if(self.contJugadores === 2 && self.partidaIniciada)
      {
        var data = {
          socket: self.socket,
          equipo: datos.otroEquipo,
          loadGame: {
            cargaPartida: false,
            partidaCargada: datos.loadGame.partidaCargada
          }
        }
      }
      else
      {
        var data = {
          socket: self.socket,
          equipo: datos.otroEquipo,
          loadGame: {
            cargaPartida: datos.loadGame.cargaPartida,
            partidaCargada: datos.loadGame.partidaCargada
          }
        }
      }
      self.scene.start(DEF.SCENES.GAME, data);
    })

    //Manejo del error de que se alcanzó el máximo número de clientes enviandolo a la sala de espera con la opción 2
    self.socket.on('errorConexion', function(){
      console.log("Inicio socket.on errorConexion");
      var data = {
        socket: self.socket,
        opcion: 2,
        equipo: 2 //Envío cualquier equipo solo por requerimiento en la clase de PreGameMenu, no tiene relevancia
      }
      self.scene.start(DEF.SCENES.LOBBY,data);
    });
    
    //Manejo del error de que se conecta otro jugador habiendo ya una partida en curso
    self.socket.on('SalaEsperaPartidaEnCurso', function(){
      console.log("Inicio SalaEsperaPartidaEnCurso");
      var data = {
        socket: self.socket,
        opcion: 3,
        equipo: 2 //Envío cualquier equipo solo por requerimiento en la clase de PreGameMenu, no tiene relevancia
      }
      self.scene.start(DEF.SCENES.LOBBY,data);
    });
  }
}

