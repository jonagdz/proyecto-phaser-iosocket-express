//Definiciones de elementos multimedia
import { DEF } from "../def.js";
//Clases
import { Bullets } from '../logica/bullet.js';
import { Carguero } from '../logica/carguero.js';
import { Submarino } from '../logica/submarino.js';
import { Destructor } from '../logica/destructor.js';

//Clase Game
export class Game extends Phaser.Scene{
  constructor(){
    super("game");
  }

  //Procedimiento inicializador
  init(data){
    this.socket = data.socket;
    this.equipo = data.equipo;
    this.cargaPartida = data.loadGame.cargaPartida;
    this.partidaCargada = data.loadGame.partidaCargada;
    //Seteo las velocidades
    this.velocidadMedia = 120;
    this.velocidadBaja = 50;
    if (!this.cargaPartida)
    {
      //Creo los objetos
      this.destructor = new Destructor('Destructor',this.velocidadMedia,18,0,0,0,1,0,0,0,0,0,12, 30);
      this.submarino = new Submarino('Submarino',this.velocidadBaja,0,14,0,0,180,2,3,0,0,0,0, false, 16, 30);
      this.carguero1 = new Carguero('Carguero1',this.velocidadBaja,8,0,0,0,3); // Creo el objeto carguero1 
      this.carguero2 = new Carguero('Carguero2',this.velocidadBaja,8,0,0,0,4); // Creo el objeto carguero2
      this.carguero3 = new Carguero('Carguero3',this.velocidadBaja,8,0,0,0,5); // Creo el objeto carguero3
      this.carguero4 = new Carguero('Carguero4',this.velocidadBaja,8,0,0,0,6); // Creo el objeto carguero4
      this.carguero5 = new Carguero('Carguero5',this.velocidadBaja,8,0,0,0,7); // Creo el objeto carguero5
      this.carguero6 = new Carguero('Carguero6',this.velocidadBaja,8,0,0,0,8); // Creo el objeto carguero6
    }
    else
    {
      //Creo el objeto destructor 
      this.destructor = new Destructor(
        'Destructor',
        this.velocidadMedia,
        this.partidaCargada.naves[6].vida,
        this.partidaCargada.naves[6].posX,
        this.partidaCargada.naves[6].posY,
        0,1,0,0,0,0,0,
        this.partidaCargada.naves[6].armas[1].municion, 
        this.partidaCargada.naves[6].armas[0].municion
      );

      //Creo el objeto submarino 
      this.submarino = new Submarino(
        'Submarino',
        this.velocidadBaja,
        0,
        this.partidaCargada.naves[7].vida,
        this.partidaCargada.naves[7].posX,
        this.partidaCargada.naves[7].posY,
        180,2,3,0,0,0,0, false, 
        this.partidaCargada.naves[7].armas[1].municion, 
        this.partidaCargada.naves[7].armas[0].municion
      );
      
      //Creo los objetos Cargueros
      this.carguero1 = new Carguero('Carguero1',this.velocidadBaja,this.partidaCargada.naves[0].vida,this.partidaCargada.naves[0].posX,this.partidaCargada.naves[0].posY,0,3); // Creo el objeto carguero1 
      this.carguero2 = new Carguero('Carguero2',this.velocidadBaja,this.partidaCargada.naves[1].vida,this.partidaCargada.naves[1].posX,this.partidaCargada.naves[1].posY,0,4); // Creo el objeto carguero2
      this.carguero3 = new Carguero('Carguero3',this.velocidadBaja,this.partidaCargada.naves[2].vida,this.partidaCargada.naves[2].posX,this.partidaCargada.naves[2].posY,0,5); // Creo el objeto carguero3
      this.carguero4 = new Carguero('Carguero4',this.velocidadBaja,this.partidaCargada.naves[3].vida,this.partidaCargada.naves[3].posX,this.partidaCargada.naves[3].posY,0,6); // Creo el objeto carguero4
      this.carguero5 = new Carguero('Carguero5',this.velocidadBaja,this.partidaCargada.naves[4].vida,this.partidaCargada.naves[4].posX,this.partidaCargada.naves[4].posY,0,7); // Creo el objeto carguero5
      this.carguero6 = new Carguero('Carguero6',this.velocidadBaja,this.partidaCargada.naves[5].vida,this.partidaCargada.naves[5].posX,this.partidaCargada.naves[5].posY,0,8); // Creo el objeto carguero6
    }
    
    this.largaVistas = {};
    this.mar;
    this.puedoDisparar = 1;
    this.distMax = 300;
    this.statusSonar;
    this.Hit;
    this.Hit2;
    this.status;
    this.statusReset;
    this.statusEnvio;
    this.statusResetEnvio;
    this.SubAmmo = [0,0];
    this.partida = {
      naves: 
      [
        {
          codP: 5,
          vida: 8,
          posX: 0.0,
          posY: 0.0,
          codNave: 0,
          clase: "Liberty"
        },
        {
          codP: 5,
          vida: 8,
          posX: 0.0,
          posY: 0.0,
          codNave: 0,
          clase: "Liberty"
        },
        {
          codP: 5,
          vida: 8,
          posX: 0.0,
          posY: 0.0,
          codNave: 0,
          clase: "Liberty"
        },
        {
          codP: 5,
          vida: 8,
          posX: 0.0,
          posY: 0.0,
          codNave: 0,
          clase: "Liberty"
        },
        {
          codP: 5,
          vida: 8,
          posX: 0.0,
          posY: 0.0,
          codNave: 0,
          clase: "Liberty"
        },
        {
          codP: 5,
          vida: 8,
          posX: 0.0,
          posY: 0.0,
          codNave: 0,
          clase: "Liberty"
        },
        {
          codP: 5,
          vida: 12,
          posX: 0.0,
          posY: 0.0,
          codNave: 1,
          clase: "Fletcher",
          armas: [
            {
              codNave: 1,
              tipo: 1,
              codP: 5,
              municion: 30
            },
            {
              codNave: 1,
              tipo: 2,
              codP: 5,
              municion: 10
            }
          ]
        },
        {
          codP: 5,
          vida: 14,
          posX: 0.0,
          posY: 0.0,
          codNave: 2,
          clase: "UBoat",
          armas: [
            {
              codNave: 2,
              tipo: 0,
              codP: 5,
              municion: 20
            },
            {
              codNave: 2,
              tipo: 3,
              codP: 5,
              municion: 16
            }
          ]
        }
      ],
      codP: 5
    }
  }

  //Procedimiento de creaci??n 
  create(){
    var self = this
    let musicaCombate = false;
    let bullet;
    let danio;
    let camaraActual = 0;
    let camaraActCarg = 0;
    let reticula;
    let cuentaSonar;
    let cuentaGPartida;
    let resetSonar;
    let resetPG;
    let resetExplosion;
    let voyGameOver;
    let contadorS=0;
    let contadorPG = 0;
    let usoSonar = false;
    let nhSonar = false;
    let noLargavistas = false;
    let siguiendoDes = true;
    let guardoP = false;
    let pausaGame = false;
    let carguerosMuertos = 0;
    
    //Arreglo para los cargueros y balas
    var arrayCargueros = [];
    this.playerBullets = this.physics.add.group({ classType: Bullets, runChildUpdate: true });

    //Carga de imagen de fondo
    this.mar = this.add.image(0, 0, DEF.IMAGENES.FONDO).setOrigin(0).setScrollFactor(1).setDepth(0);
    const backgroundW = this.mar.width;
    const backgroundH = this.mar.height;
 
    //Defino los limites de las dimensiones del mapa
    var frameW = backgroundW;
    var frameH = backgroundH;
    var margenCostaX = 689;
    var margenCostaY = 300;

    //Defino variables para las posiciones X e Y de los barcos
    var posX;
    var posY;
    let distMaxima = 50;
    let distAlto = 20;
    let damAcuD = 0;
    let damAcuS = 0;
    let damCar1 = 0;
    let damCar2 = 0;
    let damCar3 = 0;
    let damCar4 = 0;
    let damCar5 = 0;
    let damCar6 = 0;
    let distCorta = 0;
    let distMedia = 0;
    let corta = false;
    let media = false;
    let larga = false;
    let probabilidad = 0;
    let probExtra = 0;
    let carguerosAsalvo = 0;
    let pack;
    let playerIMG;
    let enemyImg;

    //Obtengo el centro del canvas para la m??scara
    const centroW = this.sys.game.config.width / 2;
    const centroH = this.sys.game.config.height / 2;
    
    //Construyo la m??scara de visi??n
    const maskImage = this.make.image({
      x: centroW,
      y: centroH,
      key: DEF.IMAGENES.MASCARA,
      add: false
    });
    const mask = maskImage.createBitmapMask();

    //Construyo el larga vista
    this.largaVistas = self.make.sprite({
      x: centroW,
      y: centroH,
      key: DEF.IMAGENES.LARGAVISTAS,
      add: false
    });
    this.largaVistas.setOrigin(0.5,0);
    this.mar.masklv = new Phaser.Display.Masks.BitmapMask(this, this.largaVistas);

    //Ajusto c??maras
    this.cameras.main.setMask(mask);
    this.physics.world.setBounds(0, 0, backgroundW, backgroundH);
    
    //Ajusto audio
    this.soundSonar = this.sound.add(DEF.AUDIO.SONAR);
    this.soundAlarm = this.sound.add(DEF.AUDIO.ALERTA);
    this.soundBackground = this.sound.add(DEF.AUDIO.JUEGO,{loop: true});
    this.soundAlarmBarco = this.sound.add(DEF.AUDIO.ALERTABARCO);
    this.soundCanionDes = this.sound.add(DEF.AUDIO.DISPARODES);
    this.soundCanionSub = this.sound.add(DEF.AUDIO.DISPAROSUB);
    this.soundCargas = this.sound.add(DEF.AUDIO.CARGAS);
    this.soundTorpedo = this.sound.add(DEF.AUDIO.TORPEDOS);
    this.soundImpacto = this.sound.add(DEF.AUDIO.IMPACTO);
    this.soundBackground.play({volume: 0.2, loop: true});
    this.soundAction = this.sound.add(DEF.AUDIO.ACTION);
    let audioActivado = true;

    //Islas
    this.isla1 = self.physics.add.image(2100,900,DEF.IMAGENES.ISLA).setDepth(5);
    this.isla1.setImmovable(true);
    this.isla1.setDisplaySize(300, 300);
    this.isla2 = self.physics.add.image(2460,1600,DEF.IMAGENES.ISLA).setDepth(5);
    this.isla2.setImmovable(true);
    this.isla2.setDisplaySize(300, 300);
    this.isla3 = self.physics.add.image(3200,600,DEF.IMAGENES.ISLA).setDepth(5);
    this.isla3.setImmovable(true);
    this.isla3.setDisplaySize(300, 300);
    this.isla4 = self.physics.add.image(3400,1800,DEF.IMAGENES.ISLA).setDepth(5);
    this.isla4.setImmovable(true);
    this.isla4.setDisplaySize(300, 300);

    //Costas
    this.costa1 = self.physics.add.image(345,1078,DEF.IMAGENES.COSTA1).setDepth(5);
    this.costa1.setImmovable(true);
    this.costa2 = self.physics.add.image(6066,1078,DEF.IMAGENES.COSTA2).setDepth(5);
    this.costa2.setImmovable(true);

    //Introduzco cursores y teclas utilizables
    this.cursors = this.input.keyboard.createCursorKeys();
    this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    //Mute de audio
    self.input.keyboard.on('keydown-' + 'M', function (event){
      if(audioActivado === true){
        self.soundBackground.mute = true;
        self.soundAction.mute = true;
        audioActivado=false;
      }else{
        self.soundBackground.mute = false;
        self.soundAction.mute = false;
        audioActivado=true;
      }
    });
    
    //Genero todos elementos del equipo correspondiente seg??n el equipo del jugador actual
    if(self.equipo === 1){
      generarEquipo1();
      //Botones visuales y alertas del equipo 1
      this.botonCAMBIARARMA = self.physics.add.image(800, 960, DEF.IMAGENES.BOTONARMA).setOrigin(0).setScrollFactor(0).setDepth(10).setInteractive().on('pointerdown', () => clickCAMBIARARMADESTRU()).setDisplaySize(120,120);
      this.botonCAMARA = self.physics.add.image(940, 960, DEF.IMAGENES.BOTONLARGAVISTA).setOrigin(0).setScrollFactor(0).setDepth(10).setInteractive().on('pointerdown', () => clickCAMARA()).setDisplaySize(120,120);
      this.botonHOME = self.physics.add.image(800, 30, DEF.IMAGENES.BOTONHOME).setOrigin(0).setScrollFactor(0).setDepth(10).setInteractive().on('pointerdown', () => clickHOME()).setDisplaySize(120,120);
      this.botonSAVE = self.physics.add.image(950, 30, DEF.IMAGENES.BOTONGUARDAR).setOrigin(0).setScrollFactor(0).setDepth(10).setInteractive().on('pointerdown', () => clickSAVE()).setDisplaySize(120,120);
      this.carg = self.add.sprite(1650, 350, 'CARGUEROSALERT').setOrigin(0).setScrollFactor(0).setDepth(10).setDisplaySize(120,120);
      this.disp = self.add.sprite(1650, 500, 'ALERTADISPARO').setOrigin(0).setScrollFactor(0).setDepth(10).setDisplaySize(120,120);

      self.input.on('pointerdown', function (pointer) {
        self.input.mouse.requestPointerLock();
      }, self);

      if(!self.cargaPartida)
      {
        iniciarPartida();
        self.socket.emit('iniciarPartida', self.partida);
      }

      //Parte superior del HUD
      self.UIDesVida =  self.add.text(1200, 170, 'Vida: ' + self.destructor.vida, { font: '30px Britannic bold', fill: '#000000', stroke : '#FFFFFF', strokeThickness: 8 }).setScrollFactor(0).setDepth(10);
      self.UIDesMunicionCar =  self.add.text(1200, 210, 'Munici??n cargas: ' + self.destructor.ammoCargas, { font: '30px Britannic bold', fill: '#000000',stroke : '#FFFFFF', strokeThickness: 8 }).setScrollFactor(0).setDepth(10);
      self.UIDesMunicionCan =  self.add.text(1200, 250, 'Munici??n ca??on: ' + self.destructor.ammoCanion, { font: '30px Britannic bold', fill: '#000000',stroke : '#FFFFFF', strokeThickness: 8 }).setScrollFactor(0).setDepth(10);
      self.UIDesArmAct =  self.add.text(1200, 290, 'Arma actual: ca??on', { font: '30px Britannic bold', fill: '#000000',stroke : '#FFFFFF', strokeThickness: 8 }).setScrollFactor(0).setDepth(10);
      self.UIDesArmCargProf =  self.add.text(1200, 330, 'Cargas de profundidad: -', { font: '30px Britannic bold', fill: '#000000',stroke : '#FFFFFF', strokeThickness: 8 }).setScrollFactor(0).setDepth(10);
      self.UIDesCarg1 = self.add.text(300, 170, 'Vida carguero 1: ' + self.carguero1.vida, { font: '30px Britannic bold', fill: '#000000',stroke : '#FFFFFF', strokeThickness: 8 }).setScrollFactor(0).setDepth(10);
      self.UIDesCarg2 = self.add.text(300, 210, 'Vida carguero 2: ' + self.carguero2.vida, { font: '30px Britannic bold', fill: '#000000',stroke : '#FFFFFF', strokeThickness: 8 }).setScrollFactor(0).setDepth(10);
      self.UIDesCarg3 = self.add.text(300, 250, 'Vida carguero 3: ' + self.carguero3.vida, { font: '30px Britannic bold', fill: '#000000',stroke : '#FFFFFF', strokeThickness: 8 }).setScrollFactor(0).setDepth(10);
      self.UIDesCarg4 = self.add.text(300, 290, 'Vida carguero 4: ' + self.carguero4.vida, { font: '30px Britannic bold', fill: '#000000',stroke : '#FFFFFF', strokeThickness: 8 }).setScrollFactor(0).setDepth(10);
      self.UIDesCarg5 = self.add.text(300, 330, 'Vida carguero 5: ' + self.carguero5.vida, { font: '30px Britannic bold', fill: '#000000',stroke : '#FFFFFF', strokeThickness: 8 }).setScrollFactor(0).setDepth(10);
      self.UIDesCarg6 = self.add.text(300, 370, 'Vida carguero 6: ' + self.carguero6.vida, { font: '30px Britannic bold', fill: '#000000',stroke : '#FFFFFF', strokeThickness: 8 }).setScrollFactor(0).setDepth(10);
      
      //Parte inferior del HUD
      self.UIDesCargCamMini = self.add.text(1120, 960, 'MiniCam: \nCarguero 1', { font: '35px Britannic bold', fill: '#000000', stroke : '#FFFFFF', strokeThickness: 8}).setScrollFactor(0).setDepth(10);

      //Eventos para cambio de camara del equipo 1 entre el destructor y los cargueros
      self.input.keyboard.on('keydown-' + 'ZERO', function (){
        self.cameras.main.startFollow(self.destructor.imagen,true, 0.09, 0.09); 
        self.cameras.main.setZoom(0.9);
        self.siguiendoDes = true;
      });

      self.input.keyboard.on('keydown-' + 'ONE',function(){
        camaraDestrCarg();
      })

      self.input.keyboard.on('keydown-' + 'TWO',function(){
        camaraCargMini();
      })

      self.input.keyboard.on('keydown-' + 'T',function(){
        detenerMovimientoCargueros();
      })

      //Agrego MiniCamara
      this.camaraEventos = this.cameras.add(1300, 900, 400, 100).setZoom(0.5);
      this.camaraEventos.startFollow(self.carguero1.imagen,true, 0.09, 0.09);
    }else{ 
      //Genero el equipo 2 submarino y genero la imagen del destructor y los cargueros actualizarla con el movimiento del otro jugador      
      generarEquipo2();
      // Botones visuales del equipo 2
      this.botonDOWNDI = self.physics.add.image(710, 800, DEF.IMAGENES.BOTONDOWNDI).setOrigin(0).setScrollFactor(0).setDepth(10).setInteractive().on('pointerdown', () => clickBAJA()).setDisplaySize(80,80);
      this.botonSUBE = self.physics.add.image(810, 800, DEF.IMAGENES.BOTONSUBIR).setOrigin(0).setScrollFactor(0).setDepth(10).setInteractive().on('pointerdown', () => clickSUBE()).setDisplaySize(80,80);
      this.botonSONAR = self.physics.add.image(910, 800, DEF.IMAGENES.BOTONSONAR).setOrigin(0).setScrollFactor(0).setDepth(10).setInteractive().on('pointerdown', () => clickSONAR()).setDisplaySize(80,80);
      this.botonCAMBIARARMA = self.physics.add.image(1010, 800, DEF.IMAGENES.BOTONARMA).setOrigin(0).setScrollFactor(0).setDepth(10).setInteractive().on('pointerdown', () => clickCAMBIARARMASUB()).setDisplaySize(80,80);
      this.botonLARGAVISTA = self.physics.add.image(1110, 800, DEF.IMAGENES.BOTONLARGAVISTA).setOrigin(0).setScrollFactor(0).setDepth(10).setInteractive().on('pointerdown', () => clickLARGAVISTA()).setDisplaySize(80,80);
      this.botonHOME = self.physics.add.image(880, 200, DEF.IMAGENES.BOTONHOME).setOrigin(0).setScrollFactor(0).setDepth(10).setInteractive().on('pointerdown', () => clickHOME()).setDisplaySize(80,80);
      this.disp = self.add.sprite(1500, 500, 'ALERTADISPARO').setOrigin(0).setScrollFactor(0).setDepth(10).setDisplaySize(80,80);
      
      //Parte superior del HUD
      self.UISubVida =  self.add.text(1100, 230, 'Vida: ' + self.submarino.vida, { font: '30px Britannic bold', fill: '#000000', stroke : '#FFFFFF', strokeThickness: 8 }).setScrollFactor(0).setDepth(10);
      self.UISubMunicionTor =  self.add.text(1100, 260, 'Munici??n torpedos: ' + self.submarino.ammoTorpedos, { font: '30px Britannic bold', fill: '#000000', stroke : '#FFFFFF', strokeThickness: 8 }).setScrollFactor(0).setDepth(10);
      self.UISubMunicionCan =  self.add.text(1100, 290, 'Munici??n ca??on: ' + self.submarino.ammoCanion, { font: '30px Britannic bold', fill: '#000000', stroke : '#FFFFFF', strokeThickness: 8 }).setScrollFactor(0).setDepth(10);
      self.UISubArmAct =  self.add.text(1100, 320, 'Arma actual: ca??on', { font: '30px Britannic bold', fill: '#000000', stroke : '#FFFFFF', strokeThickness: 8 }).setScrollFactor(0).setDepth(10);      
    } 
    
    function clickBAJA(){
      baja();
    }
    
    function clickSUBE(){
      sube()
    }

    function clickSONAR(){
      sonar();
    }

    function clickCAMBIARARMASUB(){
      cambiarArmaSub();
    }

    function clickCAMBIARARMADESTRU(){
      cambiarArmaDestr();
    }

    function clickLARGAVISTA(){
      largaVista();
    }

    function clickCAMARA(){
      camaraDestrCarg();
    }
    
    function clickHOME(){
      self.soundBackground.stop();
      self.soundAction.stop();
      self.socket.disconnect();
      self.scene.start(DEF.SCENES.MENUPRINCIPAL);
    }
    
    function clickSAVE(){
      if(guardoP !== true){
        guardarPartida();
        guardoP = true;
        self.socket.emit('guardarPartida', self.partida);
        self.msjPartidaGuardada =  self.add.text(500, 600, '', { font: '60px Britannic bold', fill: '#000000', stroke : '#FFFFFF', strokeThickness: 8 }).setScrollFactor(0).setDepth(10); 
        
        //Activo cuenta regresiva
        self.cuentaGPartida = self.time.addEvent({ delay: 1000, callback: muestroPG, callbackScope: self, loop: true});
            
        //Vuelvo a vista normal y elimino aviso
        self.resetPG = self.time.addEvent({ delay: 5000, callback: eliminoMsjPG, callbackScope: self, repeat: 0 });
        
        function eliminoMsjPG(){
          guardoP = false;
          removeText();
          contadorPG=0;
        }
        function muestroPG(){
          contadorPG++;
          self.msjPartidaGuardada.setText('??Partida guardada correctamente!');
          if (contadorPG === 5){
            self.cuentaGPartida.remove(true);
          }
        }
        function removeText() {
          self.msjPartidaGuardada.destroy();
        }
      }
    }

    function alertaCargueros(){
      self.anims.create({  
        key: 'animalertcargueros',
        frames: [
          { key: 'CARGUEROSALERT',frame:"botonALERTACARGUEROS.png" },
          { key: 'CARGUEROSALERT',frame:"botonALERTACARGUEROSROJO.png" },
          { key: 'CARGUEROSALERT',frame:"botonALERTACARGUEROS.png" },
          { key: 'CARGUEROSALERT',frame:"botonALERTACARGUEROSROJO.png" },
          { key: 'CARGUEROSALERT',frame:"botonALERTACARGUEROS.png" },
        ],
        frameRate: 5,
        repeat:3,
        hideOnComplete: false,
      });
      self.carg.play('animalertcargueros'); 
    }
    
    function alertaDisparo(){
      self.anims.create({  
        key: 'anidisp',
        frames: [
            { key: 'ALERTADISPARO',frame:"ALERTADisparosNEGRO.png" },
            { key: 'ALERTADISPARO',frame:"ALERTADisparosROJO.png" },
            { key: 'ALERTADISPARO',frame:"ALERTADisparosNEGRO.png" },
            { key: 'ALERTADISPARO',frame:"ALERTADisparosROJO.png" },
            { key: 'ALERTADISPARO',frame:"ALERTADisparosNEGRO.png" }
        ],
        frameRate: 5,
        repeat:3,
        hideOnComplete: false,
      });
      self.disp.play('anidisp');
      self.soundAlarmBarco.play({volume: 0.08, loop: false});
    }

    function generarEquipo1(){     
      //Genero los objetos cargueros, con sus imagenes, colisiones, etc.
      generarCargueros();

      //Genero la imagen del destructor, colisiones, particulas, etc.
      generarDestructor();

      //Genero la imagen del submarino enemigo
      generarSubmarinoEnemigo();
    }

    function generarEquipo2(){
      //Genero la imagen del submarino, colisiones, particulas, etc
      generarSubmarino();

      //Genero la imagen del destructor enemigo
      generarDestructorEnemigo();

      //Genero las imagenes de los cargueros enemigos
      generarCarguerosEnemigos();
    }

    //Generar destructor
    function generarDestructor()
    {
      //Genero las posiciones X e Y para el destructor, iniciara el juego aleatoriamente arriba, abajo o adelante del grupo de cargueros.
      if(!self.cargaPartida)
      {
        let random = Math.random();
        if (random <0.3){
          self.destructor.posX = self.carguero1.posX + 700;
          self.destructor.posY = self.carguero1.posY + 100;
        }else if(random <0.7){
          self.destructor.posX = self.carguero1.posX + 300;
          self.destructor.posY = self.carguero1.posY - 500;
        }else{
          self.destructor.posX = self.carguero1.posX + 300;
          self.destructor.posY = self.carguero1.posY + 600;
        }

        //Generamos la imagen del destructor al objeto destructor y sus propiedades (Tama??o, rotacion, profundidad y que sea empujable)
        self.destructor.imagen = self.physics.add.image(self.destructor.posX, self.destructor.posY, DEF.IMAGENES.DESTRUCTOR).setDisplaySize(200, 100).setRotation(0).setDepth(5).setPushable(false);
        self.destructor.imagen.setCollideWorldBounds(true) //Colisiones con el fin del mapa
        self.destructor.imagen.setDrag(1000) //Es la velocidad de desaceleracion con el tiempo cuando se deja de mover un jugador

        //Guardo la reticula y el set de balas en variables propias de la clase destructor
        self.destructor.reticula = self.physics.add.sprite(self.destructor.posX, self.destructor.posY, DEF.SPRITES.RETICULA).setCollideWorldBounds(true);
        self.destructor.bullet = self.playerBullets;
        self.destructor.cargas = 1;
        
        //Particulas
        self.destructor.parti = self.add.particles(DEF.IMAGENES.PARTICULAS).setDepth(2) //Imagen Blue como particula
        const emitter = self.destructor.parti.createEmitter({ //Funcion emitter de phaser para emitir varias particulas
          speed: 10, //Velocidad con la que se mueven
          scale: {start: 0.08, end: 0}, //Tama??o
          blendMode: "ADD" //Efecto a aplicar
        })
        self.destructor.parti.setPosition(self.destructor.imagen.x, self.destructor.imagen.y)
        emitter.startFollow(self.destructor.imagen) //Le indicamos que sigan al destructor
      }
      else if (self.destructor.vida <= 0)
      {
        //Generamos la imagen del destructor al objeto destructor y sus propiedades (Tama??o, rotacion, profundidad y que sea empujable)
        self.destructor.imagen = self.physics.add.image(self.destructor.posX, self.destructor.posY, DEF.IMAGENES.DESTRUCTOR).setDisplaySize(200, 100).setRotation(0).setDepth(5).setPushable(false);
        self.destructor.imagen.setCollideWorldBounds(true) //Colisiones con el fin del mapa
        self.destructor.imagen.setDrag(1000) //Es la velocidad de desaceleracion con el tiempo cuando se deja de mover un jugador

        destroyed(self.destructor.imagen); //Funcion que anima fuego
        self.destructor.imagen.setActive(false);
        self.destructor.imagen.setVisible(false);
        self.destructor.imagen.removeInteractive();
      }
      else
      {
        //Generamos la imagen del destructor al objeto destructor y sus propiedades (Tama??o, rotacion, profundidad y que sea empujable)
        self.destructor.imagen = self.physics.add.image(self.destructor.posX, self.destructor.posY, DEF.IMAGENES.DESTRUCTOR).setDisplaySize(200, 100).setRotation(0).setDepth(5).setPushable(false);
        self.destructor.imagen.setCollideWorldBounds(true) //Colisiones con el fin del mapa
        self.destructor.imagen.setDrag(1000) //Es la velocidad de desaceleracion con el tiempo cuando se deja de mover un jugador
 
        //Guardo la reticula y el set de balas en variables propias de la clase destructor
        self.destructor.reticula = self.physics.add.sprite(self.destructor.posX, self.destructor.posY, DEF.SPRITES.RETICULA).setCollideWorldBounds(true);
        self.destructor.bullet = self.playerBullets;
        self.destructor.cargas = 1;
        
        //Particulas
        const particles = self.add.particles(DEF.IMAGENES.PARTICULAS).setDepth(2) // Imagen Blue como particula
        const emitter = particles.createEmitter({ // Funcion emitter de phaser para emitir varias particulas
        speed: 10, //Velocidad con la que se mueven
           scale: {start: 0.08, end: 0}, //Tama??o
           blendMode: "ADD" //Efecto a aplicar
         })
         particles.setPosition(self.destructor.imagen.x, self.destructor.imagen.y)
         emitter.startFollow(self.destructor.imagen) //Le indicamos que sigan al destructor
      }

      //Se indica que la camara siga al destructor
      self.cameras.main.startFollow(self.destructor.imagen,true, 0.09, 0.09); 
      self.siguiendoDes = true;
      //Zoom de la c??mara
      self.cameras.main.setZoom(0.9);
      //Se crea una colision del destructor con las islas
      self.physics.add.collider(self.destructor.imagen, self.isla1); 
      self.physics.add.collider(self.destructor.imagen, self.isla2); 
      self.physics.add.collider(self.destructor.imagen, self.isla3); 
      self.physics.add.collider(self.destructor.imagen, self.isla4); 
      //Se crea una colision del destructor con los cargueros
      self.collDesCarg1 = self.physics.add.collider(self.destructor.imagen, self.carguero1.imagen, handleCollisionCargoDes, collisionCargoDes, self);
      self.collDesCarg2 = self.physics.add.collider(self.destructor.imagen, self.carguero2.imagen, handleCollisionCargoDes, collisionCargoDes, self);
      self.collDesCarg3 = self.physics.add.collider(self.destructor.imagen, self.carguero3.imagen, handleCollisionCargoDes, collisionCargoDes, self);
      self.collDesCarg4 = self.physics.add.collider(self.destructor.imagen, self.carguero4.imagen, handleCollisionCargoDes, collisionCargoDes, self);
      self.collDesCarg5 = self.physics.add.collider(self.destructor.imagen, self.carguero5.imagen, handleCollisionCargoDes, collisionCargoDes, self);
      self.collDesCarg6 = self.physics.add.collider(self.destructor.imagen, self.carguero6.imagen, handleCollisionCargoDes, collisionCargoDes, self);
      //Se crea una colision del barco con las costas
      self.physics.add.collider(self.destructor.imagen, self.costa1);
      self.physics.add.collider(self.destructor.imagen, self.costa2);
      //Se crea colision con el submarino
      self.colliderSub = self.physics.add.collider(self.destructor.imagen, self.submarino.imagen);

      //Se crea el evento de cambio de armas para el destructor, 0 es para ca??on, 1 para cargas de profundidad
      self.input.keyboard.on('keydown-' + 'Z', function (event){
        cambiarArmaDestr();
      });

      //Se crea el evento que al precionar la tecla V, cambia la profundidad de las cargas de profundidad del destructor
      self.input.keyboard.on('keydown-' + 'V', function (event){
        cambiarCargaDestr();
      });
    }

    //Generar destructor enemigo
    function generarDestructorEnemigo()
    {
      if(!self.cargaPartida)
      {
        //Generamos la imagen del destructor al objeto destructor y sus propiedades (Tama??o, rotacion, profundidad y que sea empujable)
        self.destructor.imagen = self.physics.add.image(self.destructor.posX,self.destructor.posY, DEF.IMAGENES.DESTRUCTOR).setDisplaySize(200, 100).setRotation(0).setDepth(5).setPushable(false);
      
        //Particulas
        self.destructor.parti = self.add.particles(DEF.IMAGENES.PARTICULAS).setDepth(2) //Imagen Blue como particula
        const emitter = self.destructor.parti.createEmitter({ //Funcion emitter de phaser para emitir varias particulas
          speed: 10, //Velocidad con la que se mueven
          scale: {start: 0.08, end: 0}, //Tama??o
          blendMode: "ADD" //Efecto a aplicar
        })
        self.destructor.parti.setPosition(self.destructor.posX,self.destructor.posY)
        emitter.startFollow(self.destructor.imagen) //Le indicamos que sigan al destructor
      }
      else if (self.destructor.vida <= 0)
      {
        //Generamos la imagen del destructor al objeto destructor y sus propiedades (Tama??o, rotacion, profundidad y que sea empujable)
        self.destructor.imagen = self.physics.add.image(self.destructor.posX,self.destructor.posY, DEF.IMAGENES.DESTRUCTOR).setDisplaySize(200, 100).setRotation(0).setDepth(5).setPushable(false);
        destroyed(self.destructor.imagen); //Funcion que anima fuego
        self.destructor.imagen.setActive(false);
        self.destructor.imagen.setVisible(false);
        self.destructor.imagen.removeInteractive();
      }
      else
      {
        //Generamos la imagen del destructor al objeto destructor y sus propiedades (Tama??o, rotacion, profundidad y que sea empujable)
        self.destructor.imagen = self.physics.add.image(self.destructor.posX,self.destructor.posY, DEF.IMAGENES.DESTRUCTOR).setDisplaySize(200, 100).setRotation(0).setDepth(5).setPushable(false);
      
        //Particulas
        const particles = self.add.particles(DEF.IMAGENES.PARTICULAS).setDepth(2) //Imagen Blue como particula
        const emitter = particles.createEmitter({ //Funcion emitter de phaser para emitir varias particulas
          speed: 10, //Velocidad con la que se mueven
          scale: {start: 0.08, end: 0}, //Tama??o
          blendMode: "ADD" //Efecto a aplicar
        })
        particles.setPosition(self.destructor.posX,self.destructor.posY)
        emitter.startFollow(self.destructor.imagen) //Le indicamos que sigan al destructor
      }
      self.colliderSub = self.physics.add.collider(self.submarino.imagen, self.destructor.imagen);
      self.colliderCarg1 = self.physics.add.collider(self.submarino.imagen, self.carguero1.imagen);
      self.colliderCarg2 = self.physics.add.collider(self.submarino.imagen, self.carguero2.imagen);
      self.colliderCarg3 = self.physics.add.collider(self.submarino.imagen, self.carguero3.imagen);
      self.colliderCarg4 = self.physics.add.collider(self.submarino.imagen, self.carguero4.imagen);
      self.colliderCarg5 = self.physics.add.collider(self.submarino.imagen, self.carguero5.imagen);
      self.colliderCarg6 = self.physics.add.collider(self.submarino.imagen, self.carguero6.imagen);
    }

    //Genero todo lo relacionado a la imagen del submarino del jugador actual y sus propiedades (Posicion X e Y, tama??o, profundidad y que sea empujable)
    function generarSubmarino(){
      //Genero las posiciones X e Y para el submarino
      if(!self.cargaPartida)
      {
        posX = Math.floor((Math.random()*((frameW-800)-(frameW*0.75)))+(frameW*0.75)), //El margen x para generarse el submarino sera desde el 70% del mapa hasta el final - 800 del lado derecho
        posY = Math.floor((Math.random()*((frameH-300)- margenCostaY))+margenCostaY), //El margen y para generarse el submarino es el mismo que los demas barcos (total - 300)
        
        //Actualizo la posicion del objeto submarino creado previamente
        self.submarino.posX = posX;
        self.submarino.posY = posY;
      }

      self.submarino.imagen = self.physics.add.image(self.submarino.posX, self.submarino.posY, DEF.IMAGENES.UBOATP0).setDisplaySize(100,50).setDepth(5).setPushable(false);
      self.submarino.imagen.setCollideWorldBounds(true) //Colisiones con el fin del mapa
      self.submarino.imagen.setDrag(1000) //Es la velocidad de desaceleracion con el tiempo cuando se deja de mover un jugador

      //Guardo la reticula y el set de balas en variables propias de la clase submarino
      self.submarino.bullet = self.playerBullets;
      self.submarino.reticula = self.physics.add.sprite(self.submarino.posX, self.submarino.posY, DEF.SPRITES.RETICULA).setCollideWorldBounds(true);
      self.submarino.reticula.setDrag(1000)
      self.submarino.reticula.x += 300;

      //Particulas
      const particles = self.add.particles(DEF.IMAGENES.PARTICULAS).setDepth(2) //Imagen Blue como particula
      const emitter = particles.createEmitter({ //Funci??n emitter de phaser para emitir varias particulas
        speed: 10, //Velocidad con la que se mueven
        scale: {start: 0.08, end: 0}, //Tama??o
        blendMode: "ADD" //Efecto a aplicar
      })
      particles.setPosition(self.submarino.imagen.x, self.submarino.imagen.y)
      emitter.startFollow(self.submarino.imagen) //Le indicamos que sigan al objeto barco.

      //Se indica que la camara siga al componente barco
      self.cameras.main.startFollow(self.submarino.imagen,true, 0.09, 0.09); 
      //Zoom de la c??mara
      self.cameras.main.setZoom(1.4);
      //Se crea una colision del barco con las islas
      self.colliderSubIsla1 = self.physics.add.collider(self.submarino.imagen, self.isla1);
      self.colliderSubIsla2 = self.physics.add.collider(self.submarino.imagen, self.isla2);
      self.colliderSubIsla3 = self.physics.add.collider(self.submarino.imagen, self.isla3);
      self.colliderSubIsla4 = self.physics.add.collider(self.submarino.imagen, self.isla4);
      //Se crea una colision del barco con las costas
      self.physics.add.collider(self.submarino.imagen, self.costa1);
      self.physics.add.collider(self.submarino.imagen, self.costa2);
      //Si el submarino se encuentra en la superficie, que colisione con el destructor
      self.colliderSub = self.physics.add.collider(self.submarino.imagen, self.destructor.imagen);
      //Se crea colision del submarino con los cargueros
      self.colliderCarg1 = self.physics.add.collider(self.submarino.imagen, self.carguero1.imagen, handleCollisionCargoSub, collisionCargoSub, self);
      self.colliderCarg2 = self.physics.add.collider(self.submarino.imagen, self.carguero2.imagen, handleCollisionCargoSub, collisionCargoSub, self);
      self.colliderCarg3 = self.physics.add.collider(self.submarino.imagen, self.carguero3.imagen, handleCollisionCargoSub, collisionCargoSub, self);
      self.colliderCarg4 = self.physics.add.collider(self.submarino.imagen, self.carguero4.imagen, handleCollisionCargoSub, collisionCargoSub, self);
      self.colliderCarg5 = self.physics.add.collider(self.submarino.imagen, self.carguero5.imagen, handleCollisionCargoSub, collisionCargoSub, self);
      self.colliderCarg6 = self.physics.add.collider(self.submarino.imagen, self.carguero6.imagen, handleCollisionCargoSub, collisionCargoSub, self);
 
      //Se crea el evento de cambio de armas
      self.input.keyboard.on('keydown-' + 'Z', function (event){
        cambiarArmaSub();
      });
      //Se crea el evento de cambio de largavistas
      self.input.keyboard.on('keydown-' + 'L', function (event){
        largaVista();
      });
      //Se crea el evento de activar sonar
      self.input.keyboard.on('keydown-' + 'F', function (event){
        sonar();
      });
      //Funci??n que al presionar la tecla Q el submarino baja, si baja a nivel 1 puede disparar solo torpedos, en nivel 2 no dispara nada
      self.input.keyboard.on('keydown-' + 'Q', function (event){
        baja();
      });
      //Funci??n que al presionar la tecla E el submarino sube
      self.input.keyboard.on('keydown-' + 'E', function (event){
        sube();
      });
    }
    
    //Genero todo lo relacionado a la imagen del submarino del equipo enemigo y sus propiedades (Tama??o, profundidad y que sea empujable)
    function generarSubmarinoEnemigo(){
      self.submarino.imagen = self.physics.add.image(0,0, DEF.IMAGENES.UBOATP0).setDisplaySize(100,50).setDepth(5).setPushable(false)
      posX = Math.floor((Math.random()*((frameW-800)-(frameW*0.75)))+(frameW*0.75)), //El margen x para generarse el submarino sera desde el 70% del mapa hasta el final - 800 del lado derecho
      posY = Math.floor((Math.random()*((frameH-300)- margenCostaY))+margenCostaY), //El margen y para generarse el submarino es el mismo que los demas barcos (total - 300)
      self.submarino.posX = posX;
      self.submarino.posY = posY;
      //Particulas
      const particles = self.add.particles(DEF.IMAGENES.PARTICULAS).setDepth(2) //Imagen Blue como particula
      const emitter = particles.createEmitter({ //Funcion emitter de phaser para emitir varias particulas
        speed: 10, //Velocidad con la que se mueven
        scale: {start: 0.08, end: 0}, //Tama??o
        blendMode: "ADD" //Efecto a aplicar
      })
      particles.setPosition(0, -11);
      self.colliderSub = self.physics.add.collider(self.destructor.imagen, self.submarino.imagen);
    }

    //Funci??n para generarle las im??genes y las particulas a cada barco
    function generarCargueros(){
      //Genero las posiciones X e Y para el primer carguero principal
      if(!self.cargaPartida)
      {
        posX = Math.floor((Math.random()*((frameW*0.2)- margenCostaX))+margenCostaX); //El margen x para generarse los cargueros sera desde la costa (689) hasta el 20% del total del mapa
        posY = Math.floor((Math.random()*((frameH-400)- margenCostaY))+margenCostaY); //El margen y para generarse los cargueros sera el (total - 400) de la parte de arriba y de abajo del mapa    
  
        //Actualizo la posici??n X e Y de todos los cargueros en base a la posicion inicial del carguero principal
        self.carguero1.posX = posX;
        self.carguero1.posY = posY;
        self.carguero2.posX = posX+200;
        self.carguero2.posY = posY+200;
        self.carguero3.posX = posX+200;
        self.carguero3.posY = posY-200;
        self.carguero4.posX = posX+350;
        self.carguero4.posY = posY;
        self.carguero5.posX = posX+500;
        self.carguero5.posY = posY+250;
        self.carguero6.posX = posX+500;
        self.carguero6.posY = posY-250;
      }      

      //Inserto los objetos cargueros en un array de cargueros para poder crear sus imagenes en una iteraci??n
      arrayCargueros[0] = self.carguero1;
      arrayCargueros[1] = self.carguero2;
      arrayCargueros[2] = self.carguero3;
      arrayCargueros[3] = self.carguero4;
      arrayCargueros[4] = self.carguero5;
      arrayCargueros[5] = self.carguero6;

      //Genero las im??genes de los cargueros, colisiones, particulas, etc.
      arrayCargueros.forEach(function(carguero){
        if(carguero.vida > 0)
        {
          carguero.imagen = self.physics.add.image(carguero.posX, carguero.posY, DEF.IMAGENES.CARGUERO).setDisplaySize(200, 75).setDepth(5).setPushable(false);
          //Particulas
          carguero.particles = self.add.particles(DEF.IMAGENES.PARTICULAS).setDepth(1) //Imagen Blue como particula
          const emitter = carguero.particles.createEmitter({ //Funci??n emitter de phaser para emitir varias particulas
            speed: 10, //Velocidad con la que se mueven
            scale: {start: 0.08, end: 0}, //Tama??o
            blendMode: "ADD" //Efecto a aplicar
          })
          carguero.particles.setPosition(0, -11)
          emitter.startFollow(carguero.imagen) //Le indicamos que sigan al destructor

          //Colisiones con el fin del mapa
          carguero.imagen.setCollideWorldBounds(true); 
          //Se crea una colision de los cargueros con la lisa
          self.physics.add.collider(carguero.imagen, self.isla1, handleCollisionCargo, collisionCargoIsland, self); 
          self.physics.add.collider(carguero.imagen, self.isla2, handleCollisionCargo, collisionCargoIsland, self); 
          self.physics.add.collider(carguero.imagen, self.isla3, handleCollisionCargo, collisionCargoIsland, self); 
          self.physics.add.collider(carguero.imagen, self.isla4, handleCollisionCargo, collisionCargoIsland, self); 
          //Se crea una colision del carguero con la costa1
          self.physics.add.collider(carguero.imagen, self.costa1);
          //Se crea una colision del carguero con la costa2
          self.physics.add.collider(carguero.imagen, self.costa2, handleCollisionCosta, colisionCargoCosta2, self);
        }
        else
        {
          carguero.imagen = self.physics.add.image(carguero.posX, carguero.posY, DEF.IMAGENES.CARGUERO).setDisplaySize(200, 75).setDepth(5).setPushable(false);
          destroyed(carguero.imagen); //Funci??n que anima fuego
          carguero.imagen.setActive(false);
          carguero.imagen.setVisible(false);
          carguero.imagen.removeInteractive();
        }
      })
    };

    //Funci??n para generarle las imagenes y las particulas a cada carguero estando en el equipo del submarino
    function generarCarguerosEnemigos(){
      //Particulas
      const particles = self.add.particles(DEF.IMAGENES.PARTICULAS).setDepth(5) //Imagen Blue como particula
      const emitter = particles.createEmitter({ //Funci??n emitter de phaser para emitir varias particulas
        speed: 10, //Velocidad con la que se mueven
        scale: {start: 0.08, end: 0}, //Tama??o
        blendMode: "ADD" //Efecto a aplicar
      })
      particles.setPosition(0, -11)
      emitter.startFollow( self.carguero1.imagen);
      emitter.startFollow( self.carguero2.imagen);
      emitter.startFollow( self.carguero3.imagen);
      emitter.startFollow( self.carguero4.imagen);
      emitter.startFollow( self.carguero5.imagen);
      emitter.startFollow( self.carguero6.imagen);

      if(self.carguero1.vida > 0)
      {
        self.carguero1.imagen = self.physics.add.image(self.carguero1.posX, self.carguero1.posY, DEF.IMAGENES.CARGUERO).setDisplaySize(200, 75).setDepth(5).setPushable(false);
      }
      else
      {
        self.carguero1.imagen = self.physics.add.image(self.carguero1.posX, self.carguero1.posY, DEF.IMAGENES.CARGUERO).setDisplaySize(200, 75).setDepth(5).setPushable(false);
        destroyed(self.carguero1.imagen); //Funcion que anima fuego
        self.carguero1.imagen.setActive(false);
        self.carguero1.imagen.setVisible(false);
        self.carguero1.imagen.removeInteractive();
      }

      if(self.carguero2.vida > 0)
      {
        self.carguero2.imagen = self.physics.add.image(self.carguero2.posX, self.carguero2.posY, DEF.IMAGENES.CARGUERO).setDisplaySize(200, 75).setDepth(5).setPushable(false);
      }
      else
      {
        self.carguero2.imagen = self.physics.add.image(self.carguero2.posX, self.carguero2.posY, DEF.IMAGENES.CARGUERO).setDisplaySize(200, 75).setDepth(5).setPushable(false);
        destroyed(self.carguero2.imagen); //Funcion que anima fuego
        self.carguero2.imagen.setActive(false);
        self.carguero2.imagen.setVisible(false);
        self.carguero2.imagen.removeInteractive();
      }

      if(self.carguero3.vida > 0)
      {
        self.carguero3.imagen = self.physics.add.image(self.carguero3.posX, self.carguero3.posY, DEF.IMAGENES.CARGUERO).setDisplaySize(200, 75).setDepth(5).setPushable(false);
      }
      else
      {
        self.carguero3.imagen = self.physics.add.image(self.carguero3.posX, self.carguero3.posY, DEF.IMAGENES.CARGUERO).setDisplaySize(200, 75).setDepth(5).setPushable(false);
        destroyed(self.carguero3.imagen); //Funcion que anima fuego
        self.carguero3.imagen.setActive(false);
        self.carguero3.imagen.setVisible(false);
        self.carguero3.imagen.removeInteractive();
      }

      if(self.carguero4.vida > 0)
      {
        self.carguero4.imagen = self.physics.add.image(self.carguero4.posX, self.carguero4.posY, DEF.IMAGENES.CARGUERO).setDisplaySize(200, 75).setDepth(5).setPushable(false);
      }
      else
      {
        self.carguero4.imagen = self.physics.add.image(self.carguero4.posX, self.carguero4.posY, DEF.IMAGENES.CARGUERO).setDisplaySize(200, 75).setDepth(5).setPushable(false);
        destroyed(self.carguero4.imagen); //Funcion que anima fuego
        self.carguero4.imagen.setActive(false);
        self.carguero4.imagen.setVisible(false);
        self.carguero4.imagen.removeInteractive();
      }

      if(self.carguero5.vida > 0)
      {
        self.carguero5.imagen = self.physics.add.image(self.carguero5.posX, self.carguero5.posY, DEF.IMAGENES.CARGUERO).setDisplaySize(200, 75).setDepth(5).setPushable(false);
      }
      else
      {
        self.carguero5.imagen = self.physics.add.image(self.carguero5.posX, self.carguero5.posY, DEF.IMAGENES.CARGUERO).setDisplaySize(200, 75).setDepth(5).setPushable(false);
        destroyed(self.carguero5.imagen); //Funcion que anima fuego
        self.carguero5.imagen.setActive(false);
        self.carguero5.imagen.setVisible(false);
        self.carguero5.imagen.removeInteractive();
      }

      if(self.carguero6.vida > 0)
      {
        self.carguero6.imagen = self.physics.add.image(self.carguero6.posX, self.carguero6.posY, DEF.IMAGENES.CARGUERO).setDisplaySize(200, 75).setDepth(5).setPushable(false);
      }
      else
      {
        self.carguero6.imagen = self.physics.add.image(self.carguero6.posX, self.carguero6.posY, DEF.IMAGENES.CARGUERO).setDisplaySize(200, 75).setDepth(5).setPushable(false);
        destroyed(self.carguero6.imagen); //Funcion que anima fuego
        self.carguero6.imagen.setActive(false);
        self.carguero6.imagen.setVisible(false);
        self.carguero6.imagen.removeInteractive();
      }
      
      //Colisiones de cargueros con el submarino
      self.colliderCarg1 = self.physics.add.collider(self.submarino.imagen, self.carguero1.imagen);
      self.colliderCarg2 = self.physics.add.collider(self.submarino.imagen, self.carguero2.imagen);
      self.colliderCarg3 = self.physics.add.collider(self.submarino.imagen, self.carguero3.imagen);
      self.colliderCarg4 = self.physics.add.collider(self.submarino.imagen, self.carguero4.imagen);
      self.colliderCarg5 = self.physics.add.collider(self.submarino.imagen, self.carguero5.imagen);
      self.colliderCarg6 = self.physics.add.collider(self.submarino.imagen, self.carguero6.imagen);
    };

    function collisionCargoIsland(carguero, isla){
      return true;
    }

    //Funcion que maneja la colision entre el carguero y la isla
    function handleCollisionCargo(carguero, isla){
      if (carguero.body.touching.right) //Cuando la el carguero colisiona de "frente" gira 90 grados hacia abajo o hacia abajo, espera 2 segundos y continua con su marcha.
      {
        if(Math.floor(Math.random() * 2) === 0)
        {
          carguero.angle = carguero.angle + 90;
          const velCY = Math.sin((carguero.angle - 360) * 0.01745)
          carguero.setVelocityY(self.velocidadBaja * velCY)
          setTimeout(() => {
            carguero.angle = carguero.angle - 90;
            contMarcha(carguero);
          }, 2000)
        }
        else
        {
          carguero.angle = carguero.angle - 90;
          const velCY = Math.sin((carguero.angle - 360) * 0.01745)
          carguero.setVelocityY(self.velocidadBaja * velCY)
          setTimeout(() => {
            carguero.angle = carguero.angle + 90;
            contMarcha(carguero);
          }, 2000)
        }
      }
    }

    function collisionCargoDes(){
      return true;
    }

    //Funci??n que maneja la colision entre el carguero y el destructor
    function handleCollisionCargoDes(destructor, carguero){
      if (carguero.body.touching.right) //Cuando la el carguero colisiona de "frente" gira 90 grados hacia abajo o hacia abajo, espera 2 segundos y continua con su marcha.
      {
        if(Math.floor(Math.random() * 2) === 0)
        {
          carguero.angle = carguero.angle + 90;
          const velCY = Math.sin((carguero.angle - 360) * 0.01745)
          carguero.setVelocityY(self.velocidadBaja * velCY)
          setTimeout(() => {
            carguero.angle = carguero.angle - 90;
            contMarcha(carguero);
          }, 2000)
        }
        else
        {
          carguero.angle = carguero.angle - 90;
          const velCY = Math.sin((carguero.angle - 360) * 0.01745)
          carguero.setVelocityY(self.velocidadBaja * velCY)
          setTimeout(() => {
            carguero.angle = carguero.angle + 90;
            contMarcha(carguero);
          }, 2000)
        }
      }
    }

    function collisionCargoSub(submarino, carguero){
      return true;
    }

    //Funci??n que maneja la colision entre el carguero y el submarino
    function handleCollisionCargoSub(submarino, carguero)
    {
      if (carguero.body.touching.right) //Cuando la el carguero colisiona de "frente" gira 90 grados hacia abajo o hacia abajo, espera 2 segundos y continua con su marcha.
      {
        if(Math.floor(Math.random() * 2) === 0)
        {
          carguero.angle = carguero.angle + 90;
          const velCY = Math.sin((carguero.angle - 360) * 0.01745)
          carguero.setVelocityY(self.velocidadBaja * velCY)
          setTimeout(() => {
            carguero.angle = carguero.angle - 90;
            contMarcha(carguero);
          }, 2000)
        }
        else
        {
          carguero.angle = carguero.angle - 90;
          const velCY = Math.sin((carguero.angle - 360) * 0.01745)
          carguero.setVelocityY(self.velocidadBaja * velCY)
          setTimeout(() => {
            carguero.angle = carguero.angle + 90;
            contMarcha(carguero);
          }, 2000)
        }
      }
    }

    //Manejo de la colisi??n entre los cargueros y la costa
    function handleCollisionCosta(carguero, costa2){
      if(carguero === self.carguero1.imagen)
        cargueroSalvado(self.carguero1);
      else if(carguero === self.carguero2.imagen)
        cargueroSalvado(self.carguero2);
      else if(carguero === self.carguero3.imagen)
        cargueroSalvado(self.carguero3);
      else if(carguero === self.carguero4.imagen)
        cargueroSalvado(self.carguero4);
      else if(carguero === self.carguero5.imagen)
        cargueroSalvado(self.carguero5);
      else if(carguero === self.carguero6.imagen)
        cargueroSalvado(self.carguero6);
      if (carguerosAsalvo >= 3){
        let envio={
          socket: self.socket,
          resultado: 1,
          equipo: 1
        }
        let envioSocket= {
          resultado: 1,
          equipo: 1
        }
        self.soundBackground.stop();
        self.soundAction.stop();
        self.socket.emit('Finalizo', envioSocket);
        self.scene.start(DEF.SCENES.FinScene, envio);
      }
    }

    //Funci??n que cuenta la cantidad de cargueros que llegan a salvo a la costa
    function cargueroSalvado(carguero){
      if (carguero.vida > 0){
        carguerosAsalvo++;
        carguero.vida = 0;
      }
    }
    
    function colisionCargoCosta2(carguero, costa2){
      return true;
    }

    function contMarcha(carguero){
      const velCX = Math.cos((carguero.angle - 360) * 0.01745)
      const velCY = Math.sin((carguero.angle - 360) * 0.01745)
      carguero.setVelocityX(self.velocidadBaja * velCX)
      carguero.setVelocityY(self.velocidadBaja * velCY)
    } 
   
    //Ajustes de profundidad
    //Cuando el submarino baja 
    function baja(){
      if(self.equipo === 2){
        //Paso de nivel 0 a 1, ajusto armas en 4 (que es exclusivamente torpedos) y emito al socket para que el otro jugador vea mi cambio de profundidad
        if (self.submarino.profundidad === 0 && self.submarino.largavista === false){
          self.submarino.profundidad = 1;
          self.submarino.imagen.setTexture(DEF.IMAGENES.UBOATP1);
          self.submarino.armas = 4;
          self.socket.emit('playerProf', {Pr: self.submarino.profundidad});
          //Cambio de c??mara
          if (self.lvactivado === true){
            self.cameras.main.setMask(self.mask);
            self.cameras.main.setZoom(1.4);
          }
          cambiarArmaSub();
        }else if (self.submarino.profundidad === 1 && self.submarino.largavista === false){
          if (self.usoSonar !== true){
            //Paso de nivel 0 a 1, ajusto armas en -1 (sin armas) y emito al socket para que el otro jugador vea mi cambio de profundidad
            self.submarino.profundidad = 2;
            self.submarino.armas = -1;
            self.submarino.imagen.setTexture(DEF.IMAGENES.UBOATP2);
            self.socket.emit('playerProf', {Pr: self.submarino.profundidad});
            cambiarArmaSub();
          }
        }
        self.physics.world.removeCollider(self.colliderSub); 
        self.physics.world.removeCollider(self.colliderCarg1);
        self.physics.world.removeCollider(self.colliderCarg2);
        self.physics.world.removeCollider(self.colliderCarg3);
        self.physics.world.removeCollider(self.colliderCarg4);
        self.physics.world.removeCollider(self.colliderCarg5);
        self.physics.world.removeCollider(self.colliderCarg6); 
      
        //Ajusto la velocidad del submarino dependiendo a la profundidad en que se encuentre
        if (self.submarino.profundidad === 0){
          //Si me encuentro en la superficie la velocidad va a ser lenta
          self.submarino.velocidad = self.velocidadBaja; 
        }else if(self.submarino.profundidad === 1){
          //Si me encuentro a baja profundidad la velocidad va a ser media
          self.submarino.velocidad = self.velocidadMedia; 
        }else if(self.submarino.profundidad === 2){
          //Si me encuentro a mucha profundidad la velocidad va a ser media
          self.submarino.velocidad = self.velocidadMedia; 
        }
      }
    }

    //Cuando el submarino sube
    function sube(){
      //Paso de nivel 1 a 0, ajusto armas en 0 y emito al socket para que el otro jugador vea mi cambio de profundidad
      if (self.submarino.profundidad == 1 && self.submarino.largavista === false){
        if (self.usoSonar !== true){
          self.submarino.profundidad = 0;
          self.submarino.armas = 0;
          self.submarino.imagen.setTexture(DEF.IMAGENES.UBOATP0);
          self.socket.emit('playerProf', {Pr: self.submarino.profundidad});
          cambiarArmaSub();
        }
      } else if (self.submarino.profundidad == 2 && self.submarino.largavista === false){
        //Paso de nivel 2 a 1, ajusto armas en 4 y emito al socket para que el otro jugador vea mi cambio de profundidad
        self.submarino.profundidad = 1;
        self.submarino.armas = 4;
        self.submarino.imagen.setTexture(DEF.IMAGENES.UBOATP1);
        self.socket.emit('playerProf', {Pr: self.submarino.profundidad});
        cambiarArmaSub();
      }
      if(self.submarino.profundidad === 0){
        self.colliderSub = self.physics.add.collider(self.submarino.imagen, self.destructor.imagen);
        self.colliderCarg1 = self.physics.add.collider(self.submarino.imagen, self.carguero1.imagen,  handleCollisionCargoSub, collisionCargoSub, self);
        self.colliderCarg2 = self.physics.add.collider(self.submarino.imagen, self.carguero2.imagen,  handleCollisionCargoSub, collisionCargoSub, self);
        self.colliderCarg3 = self.physics.add.collider(self.submarino.imagen, self.carguero3.imagen,  handleCollisionCargoSub, collisionCargoSub, self);
        self.colliderCarg4 = self.physics.add.collider(self.submarino.imagen, self.carguero4.imagen,  handleCollisionCargoSub, collisionCargoSub, self);
        self.colliderCarg5 = self.physics.add.collider(self.submarino.imagen, self.carguero5.imagen,  handleCollisionCargoSub, collisionCargoSub, self);
        self.colliderCarg6 = self.physics.add.collider(self.submarino.imagen, self.carguero6.imagen,  handleCollisionCargoSub, collisionCargoSub, self);
      }

      //Ajusto la velocidad del submarino dependiendo a la profundidad en que se encuentre
      if (self.submarino.profundidad == 0){
        //Si me encuentro en la superficie la velocidad va a ser lenta
        self.submarino.velocidad = self.velocidadBaja; 
      }else if(self.submarino.profundidad == 1){
        //Si me encuentro a baja profundidad la velocidad va a ser media
        self.submarino.velocidad = self.velocidadMedia; 
      }else if(self.submarino.profundidad == 2){
        //Si me encuentro a mucha profundidad la velocidad va a ser lenta
        self.submarino.velocidad = self.velocidadBaja; 
      }
    }

    //Sonar del submarino
    function sonar(){
      //Activo sonar si hay sonares disponibles
      if(self.submarino.sonar>0){
        if (self.usoSonar !== true && self.nhSonar !== true && self.submarino.profundidad === 1 && self.noLargavistas !== true){
          //Texto de aviso
          self.statusSonar = self.add.text(550, 700, '', { font: '45px Britannic bold', fill: '#000000', stroke : '#FFFFFF', strokeThickness: 8 }).setScrollFactor(0).setDepth(10);
          self.usoSonar = true;
          //Activo sonido de sonar
          self.soundSonar.play();
          //Cambio de zoom de la c??mara
          self.cameras.main.setZoom(0.9);
          //Activo cuenta regresiva
          self.cuentaSonar = self.time.addEvent({ delay: 1000, callback: actualizarContSonar, callbackScope: self, loop: true});
          //Vuelvo a vista normal y elimino aviso
          self.resetSonar = self.time.addEvent({ delay: 10000, callback: camaraSonar, callbackScope: self, repeat: 0 });
          
          function camaraSonar(){
            //Restablezco zoom de la c??mara   
            self.cameras.main.setZoom(1.4);
            self.usoSonar = false;
            //Elimino texto de tiempo restante
            removeText();
            self.soundSonar.stop();
            contadorS=0;
          }
          function actualizarContSonar(){
            contadorS++;
            self.statusSonar.setText('SONAR ACTIVADO - TIEMPO RESTANTE: '+(10-contadorS)+'s'+ '\n             SONARES RESTANTES: '+(self.submarino.sonar));
            if (contadorS === 10){
              self.cuentaSonar.remove(true);
            }
          }
          function removeText() {
            self.statusSonar.destroy();
          }
          self.submarino.sonar--;
        }else if(self.submarino.profundidad === 0 || self.submarino.profundidad === 2 && self.noLargavistas !== true && self.submarino.largavista !== true){
          if(self.nhSonar !== true){
            self.nhSonar=true;
            //Texto de aviso
            self.statusSonar = self.add.text(550, 750, '', { font: '45px Britannic bold', fill: '#000000', stroke : '#FFFFFF', strokeThickness: 8 }).setScrollFactor(0).setDepth(10);
            //Activo cuenta regresiva
            self.cuentaSonar = self.time.addEvent({ delay: 1000, callback: avisoSonarProf, callbackScope: self, loop: true});
            //Elimino aviso
            self.resetSonar = self.time.addEvent({ delay: 5000, callback: eliminoAvisoSP, callbackScope: self, repeat: 0 });
            
            function eliminoAvisoSP(){
              self.nhSonar = false;
              //Elimino texto de aviso no hay sonar
              removeText();
              contadorS=0;
            }
            function avisoSonarProf(){
              contadorS++;
              self.statusSonar.setText('??SONAR SOLO A BAJA PROFUNDIDAD!');
              if (contadorS === 5){
                self.cuentaSonar.remove(true);
              }
            }
            function removeText() {
              self.statusSonar.destroy();
            }
          }
        }
      }else{
        if (self.usoSonar !== true && self.nhSonar !== true && self.submarino.profundidad === 1 && self.noLargavistas !== true && self.submarino.largavista !== true){
          self.nhSonar = true;
          //Texto de aviso
          self.statusSonar = self.add.text(550, 750, '', { font: '45px Britannic bold', fill: '#000000', stroke : '#FFFFFF', strokeThickness: 8 }).setScrollFactor(0).setDepth(10);
          //Activo cuenta regresiva
          self.cuentaSonar = self.time.addEvent({ delay: 1000, callback: avisoNoHaySonar, callbackScope: self, loop: true});
          //Elimino aviso
          self.resetSonar = self.time.addEvent({ delay: 5000, callback: eliminoAvisoNHS, callbackScope: self, repeat: 0 });
          
          function eliminoAvisoNHS(){
            self.nhSonar = false;
            //Elimino texto de aviso no hay sonar
            removeText();
            contadorS=0;
          }
          function avisoNoHaySonar(){
            contadorS++;
            self.statusSonar.setText('                  ??SONAR AGOTADO!');
            if (contadorS === 5){
              self.cuentaSonar.remove(true);
            }
          }
          function removeText() {
            self.statusSonar.destroy();
          }
        }else if(self.submarino.profundidad === 0 || self.submarino.profundidad === 2 && self.noLargavistas !== true && self.submarino.largavista !== true){
          if(self.nhSonar !== true){
            self.nhSonar=true;
            //Texto de aviso
            self.statusSonar = self.add.text(550, 750, '', { font: '45px Britannic bold', fill: '#000000', stroke : '#FFFFFF', strokeThickness: 8 }).setScrollFactor(0).setDepth(10);
            //Activo cuenta regresiva
            self.cuentaSonar = self.time.addEvent({ delay: 1000, callback: avisoSonarProf, callbackScope: self, loop: true});
            //Elimino aviso
            self.resetSonar = self.time.addEvent({ delay: 5000, callback: eliminoAvisoSP, callbackScope: self, repeat: 0 });
            
            function eliminoAvisoSP(){
              self.nhSonar = false;
              //Elimino texto de aviso no hay sonar
              removeText();
              contadorS=0;
            }
            function avisoSonarProf(){
              contadorS++;
              self.statusSonar.setText('??SONAR SOLO A BAJA PROFUNDIDAD!');
              if (contadorS === 5){
                self.cuentaSonar.remove(true);
              }
            }
            function removeText() {
              self.statusSonar.destroy();
            }
          }
        }
      }
    }

    //Cambiar arma del submarino
    function cambiarArmaSub(){
      //Si esta en superficie que pueda cambiar armas
      if(self.submarino.profundidad === 0){
        if (self.submarino.armas === 0){
          self.submarino.armas = 1;
          self.UISubArmAct.setText('Arma actual: torpedos');
        }else{
          self.submarino.armas = 0;
          self.UISubArmAct.setText('Arma actual: ca??on');
        }
      }else if(self.submarino.profundidad === 1){
        //Si esta a profundidad 1 que solo pueda usar el arma 1 torpedos
        self.submarino.armas = 4;
        self.UISubArmAct.setText('Arma actual: torpedos'); 
      }else if(self.submarino.profundidad === 2){
        //Si esta en profundidad 2 que no pueda disparar
        self.submarino.armas = -1;
        self.UISubArmAct.setText('Arma actual: -');
      }
      if(self.submarino.armas === 0){
        self.distMax = 450;
      }else if(self.submarino.armas === 1 || self.submarino.armas === 4){
        self.distMax = 550;
      }   
      self.submarino.reticula.x = self.submarino.imagen.x + (Math.cos((self.submarino.imagen.angle - 360) * 0.01745) * self.distMax);
      self.submarino.reticula.y = self.submarino.imagen.y + (Math.sin((self.submarino.imagen.angle - 360) * 0.01745) * self.distMax);
    }

    //Largavistas del submarino
    function largaVista(){
      if(self.submarino.largavista === false && self.submarino.profundidad === 0 && self.usoSonar !== true && self.nhSonar !== true){
        self.submarino.largavista = true;
        self.largaVistas.angle=self.submarino.imagen.angle+270;
        self.cameras.main.setMask(self.mar.masklv);
        self.cameras.main.setZoom(0.9);
      }else if(self.submarino.largavista === true && (self.submarino.profundidad === 0) && self.nhSonar !== true){
        self.submarino.largavista = false;
        restablezcoMask();
      }else if((self.submarino.profundidad === 1 || self.submarino.profundidad === 2) && self.noLargavistas !== true && self.usoSonar !== true && self.nhSonar !== true){
        self.noLargavistas=true;
        //Texto de aviso
        self.statusSonar = self.add.text(550, 750, '', { font: '45px Britannic bold', fill: '#000000', stroke : '#FFFFFF', strokeThickness: 8 }).setScrollFactor(0).setDepth(10);
        self.cuentaSonar = self.time.addEvent({ delay: 1000, callback: avisoLargavistaSup, callbackScope: self, loop: true});
        self.resetSonar = self.time.addEvent({ delay: 5000, callback: eliminoAvisoLS, callbackScope: self, repeat: 0 });
        function eliminoAvisoLS(){
          self.noLargavistas = false;
          //Elimino texto de aviso de largavistas solo en superficie
          removeText();
          contadorS=0;
        }
        function avisoLargavistaSup(){
          contadorS++;
          self.statusSonar.setText('??LARGAVISTAS SOLO EN SUPERFICIE!');
          if (contadorS === 5){
            self.cuentaSonar.remove(true);
          }
        }
        function removeText() {
          self.statusSonar.destroy();
        }
      }
      function restablezcoMask(){
        self.cameras.main.setMask(mask);
        self.cameras.main.setZoom(1.4);
      }
    }

    //Cambiar arma del destructor
    function cambiarArmaDestr(){
      if (self.destructor.armas === 0){
        self.destructor.armas = 1;
        if (self.destructor.cargas === 1){
          self.UIDesArmCargProf.setText('Cargas de profundidad: poca');
        }else{
          self.UIDesArmCargProf.setText('Cargas de profundidad: mucha');
        }
        self.UIDesArmAct.setText('Arma actual: cargas de prof.');
      }else{
        self.destructor.armas = 0;
        self.UIDesArmAct.setText('Arma actual: ca??on');
        self.UIDesArmCargProf.setText('Cargas de profundidad: -');
      }
    }

    //Cambiar cargas de profundidad del destructor
    function cambiarCargaDestr(){
      if(self.destructor.cargas === 1){
        self.destructor.cargas = 2;
        self.UIDesArmCargProf.setText('Cargas de profundidad: mucha');
      }else{
        self.destructor.cargas = 1;
        self.UIDesArmCargProf.setText('Cargas de profundidad: poca');
      }
    }

    //Cambio de c??maras entre los cargueros
    function camaraDestrCarg(){
      if(camaraActual == 0){
        self.cameras.main.startFollow(self.carguero1.imagen,true, 0.09, 0.09); 
        self.cameras.main.setZoom(1.4);
        camaraActual = 1;
      }else if(camaraActual == 1){
        self.cameras.main.startFollow(self.carguero2.imagen,true, 0.09, 0.09); 
        self.cameras.main.setZoom(1.4);
        camaraActual = 2;
      }else if(camaraActual == 2){
        self.cameras.main.startFollow(self.carguero3.imagen,true, 0.09, 0.09); 
        self.cameras.main.setZoom(1.4);
        camaraActual = 3;
      }else if(camaraActual == 3){
        self.cameras.main.startFollow(self.carguero4.imagen,true, 0.09, 0.09); 
        self.cameras.main.setZoom(1.4);
        camaraActual = 4;
      }else if(camaraActual == 4){
        self.cameras.main.startFollow(self.carguero5.imagen,true, 0.09, 0.09); 
        self.cameras.main.setZoom(1.4);
        camaraActual = 5;
      }else if(camaraActual == 5){
        self.cameras.main.startFollow(self.carguero6.imagen,true, 0.09, 0.09); 
        self.cameras.main.setZoom(1.4);
        camaraActual = 6;
      }else if(camaraActual == 6){
        self.cameras.main.setZoom(0.9);
        camaraActual = 0;
      }
    }

    //Cambio de c??maras con la minicamara entre los cargueros
    function camaraCargMini(){
      if(camaraActCarg == 0){
        self.camaraEventos.startFollow(self.carguero1.imagen,true, 0.09, 0.09);
        camaraActCarg = 1;
        self.UIDesCargCamMini.setText('MiniCam: \nCarguero 1');
      }else if(camaraActCarg == 1){
        self.camaraEventos.startFollow(self.carguero2.imagen,true, 0.09, 0.09); 
        camaraActCarg = 2;
        self.UIDesCargCamMini.setText('MiniCam: \nCarguero 2');
      }else if(camaraActCarg == 2){
        self.camaraEventos.startFollow(self.carguero3.imagen,true, 0.09, 0.09);
        camaraActCarg = 3;
        self.UIDesCargCamMini.setText('MiniCam: \nCarguero 3');
      }else if(camaraActCarg == 3){
        self.camaraEventos.startFollow(self.carguero4.imagen,true, 0.09, 0.09);
        camaraActCarg = 4;
        self.UIDesCargCamMini.setText('MiniCam: \nCarguero 4');
      }else if(camaraActCarg == 4){
        self.camaraEventos.startFollow(self.carguero5.imagen,true, 0.09, 0.09);
        camaraActCarg = 5;
        self.UIDesCargCamMini.setText('MiniCam: \nCarguero 5');
      }else if(camaraActCarg == 5){
        self.camaraEventos.startFollow(self.carguero6.imagen,true, 0.09, 0.09);
        camaraActCarg = 0;
        self.UIDesCargCamMini.setText('MiniCam: \nCarguero 6');
      }
    }

    //Detener el movimiento de los cargueros
    function detenerMovimientoCargueros(){
      // Detengo el movimiento de todos los cargueros
      self.carguero1.imagen.setAcceleration(0);
      self.carguero1.imagen.setVelocityX(0);
      self.carguero1.imagen.setVelocityY(0);
      self.carguero2.imagen.setAcceleration(0);
      self.carguero2.imagen.setVelocityX(0);
      self.carguero2.imagen.setVelocityY(0);
      self.carguero3.imagen.setAcceleration(0);
      self.carguero3.imagen.setVelocityX(0);
      self.carguero3.imagen.setVelocityY(0);
      self.carguero4.imagen.setAcceleration(0);
      self.carguero4.imagen.setVelocityX(0);
      self.carguero4.imagen.setVelocityY(0);
      self.carguero5.imagen.setAcceleration(0);
      self.carguero5.imagen.setVelocityX(0);
      self.carguero5.imagen.setVelocityY(0);
      self.carguero6.imagen.setAcceleration(0);
      self.carguero6.imagen.setVelocityX(0);
      self.carguero6.imagen.setVelocityY(0);
    }

    //Timer de disparo
    function timerDisparo(){
      self.puedoDisparar = 1;
    }

    //Evento destacado explosi??n de carguero
    function explosionCarguero(){
      //Explosi??n 
      self.videoExC = self.add.video(centroW,centroH,DEF.VIDEO.EXPLOSIONLIBERTY).setScrollFactor(0).setScale(0.7).setDepth(10);
      self.videoExC.play();
      //Elimino video
      self.resetExplosion = self.time.addEvent({ delay: 5000, callback: reseteoExplC, callbackScope: self});
      function reseteoExplC(){
        self.videoExC.destroy();
      }
    }

    //Evento destacado explosi??n de destructor
    function explosionDestructor(){
      //Explosi??n 
      self.videoExD = self.add.video(centroW,centroH,DEF.VIDEO.EXPOSIONFLETCHER).setScrollFactor(0).setScale(0.7).setDepth(10);
      self.videoExD.play();
      //Elimino video
      self.resetExplosion = self.time.addEvent({ delay: 5000, callback: reseteoExplD, callbackScope: self});
      function reseteoExplD(){
        self.videoExD.destroy();
      }
    }

    //Evento destacado explosi??n de submarino
    function explosionSubmarino(){
      //Explosion 
      self.videoExU = self.add.video(centroW,centroH,DEF.VIDEO.EXPLOSIONUBOAT).setScrollFactor(0).setScale(0.7).setDepth(10);
      self.videoExU.play();
      //Elimino video
      self.resetExplosion = self.time.addEvent({ delay: 5000, callback: reseteoExplS, callbackScope: self});
      function reseteoExplS(){
        self.videoExU.destroy();
      }
    }

    //Funci??n que recibe un click y ejecuta el evento disparo el cual activa una bala del set de balas de la clase
    this.input.on('pointerdown', function (pointer, time){
      if (self.puedoDisparar != 0){
        //Agrego un timer de 3 segundos entre cada disparo
        self.puedoDisparar = 0;
        self.time.addEvent({delay: 3000, callback: timerDisparo, callbackScope: self});

        if(self.equipo === 1){
          //Si el jugador es del equipo 1 es el destructor, entonces genera el bullet desde destructor
          bullet = self.destructor.bullet.get().setActive(true).setVisible(true).setDisplaySize(10,10);
          
          //En el caso en que se destruya el jugador se borran las balas y no permite hacer da??o al enemigo
          if(self.destructor.vida <= 0){
            bullet.destroy();
          }

          //Manejo de la munici??n del destructor
          if(self.destructor.armas === 0 && self.destructor.vida > 0 && self.destructor.ammoCanion > 0)
          {
            self.soundCanionDes.play({volume: 0.1, loop: false});
            self.destructor.ammoCanion--;
            
            //M??todo de disparo, paso las balas, el jugador que hace el disparo, la mira del jugador y el enemigo
            disparo(self.destructor, bullet, self.submarino);
  
            //Actualizo en la gr??fica la cantidad de munici??n de ca??on restante
            self.UIDesMunicionCan.setText('Munici??n ca??on: ' + self.destructor.ammoCanion);
          }
          if (self.destructor.armas === 1 && self.destructor.vida > 0 && self.destructor.ammoCargas > 0)
          {
            self.soundCargas.play({volume: 0.15, loop: false});
            self.destructor.ammoCargas--;
        
            //M??todo de disparo, paso las balas, el jugador que hace el disparo, la mira del jugador y el enemigo
            disparo(self.destructor, bullet, self.submarino);
  
            //Actualizo en la grafica la cantidad de munici??n de ca??on restante
            self.UIDesMunicionCar.setText('Munici??n cargas: ' + self.destructor.ammoCargas);
          }
        }
        else {
          //Si el jugador es del equipo 2 es el submarino, entonces genera el bullet desde submarino
          bullet = self.submarino.bullet.get().setActive(true).setVisible(true).setDisplaySize(10,10);
          
          //En el caso en que se destruya el jugador se borran las balas y no permite hacer da??o al enemigo
          if(self.submarino.vida <= 0){
            bullet.destroy();
          }

          //Si el submarino no tiene armas es porque esta sumergido
          if(self.submarino.armas === -1){
            bullet.destroy();
          }

          //Manejo de munici??n del submarino
          if(self.submarino.armas === 0 && self.submarino.vida > 0 && self.submarino.ammoCanion > 0)
          {
            self.soundCanionSub.play({volume: 0.1, loop: false});
            self.submarino.ammoCanion--;
            
            self.SubAmmo[0]=self.submarino.ammoCanion;
            self.socket.emit('submarinoAmmo', self.SubAmmo);
  
            //M??todo de disparo, paso las balas, el jugador que hace el disparo, la mira del jugador y el enemigo
            disparo(self.submarino, bullet, self.destructor);
            disparo(self.submarino, bullet, self.carguero1);
            disparo(self.submarino, bullet, self.carguero2);
            disparo(self.submarino, bullet, self.carguero3);
            disparo(self.submarino, bullet, self.carguero4);
            disparo(self.submarino, bullet, self.carguero5);
            disparo(self.submarino, bullet, self.carguero6);    
  
            //Actualizo en la gr??fica la cantidad de munici??n restante
            self.UISubMunicionCan.setText('Munici??n ca??on: ' + self.submarino.ammoCanion);
          }
          if ((self.submarino.armas === 1 || self.submarino.armas === 4) && self.submarino.vida > 0 && self.submarino.ammoTorpedos > 0)
          {
            self.soundTorpedo.play({volume: 0.15, loop: false});
            self.submarino.ammoTorpedos--;
            
            self.SubAmmo[1]=self.submarino.ammoTorpedos;
            self.socket.emit('submarinoAmmo', self.SubAmmo);
            //M??todo de disparo, paso las balas, el jugador que hace el disparo, la mira del jugador y el enemigo
            disparo(self.submarino, bullet, self.destructor);
            disparo(self.submarino, bullet, self.carguero1);
            disparo(self.submarino, bullet, self.carguero2);
            disparo(self.submarino, bullet, self.carguero3);
            disparo(self.submarino, bullet, self.carguero4);
            disparo(self.submarino, bullet, self.carguero5);
            disparo(self.submarino, bullet, self.carguero6);    
  
            //Actualizo en la gr??fica la cantidad de munici??n restante
            self.UISubMunicionTor.setText('Munici??n torpedos: ' + self.submarino.ammoTorpedos);
          }
        }
      }
    }, this);

    //Disparo del jugador
    function disparo(nave, bullet, enemy){
      let player = nave.imagen;
      let reticula = nave.reticula;
      let enemyImag = enemy.imagen;

      if (bullet){ //Funci??n que maneja la colsi??n de la bala con los bordes del mundo
          bullet.fire(player, reticula); //M??todo disparar de bullet
          bullet.setCollideWorldBounds(true);
          bullet.body.onWorldBounds = true;
          bullet.body.world.on('worldbounds', function(body) {
            //Colisi??n con los bordes del mundo 
            if (body.gameObject === this ) {
              this.setActive(false);
              this.setVisible(false);
            }
          }, bullet);
          
          //Colisi??n con las islas
          self.physics.add.collider(bullet, self.isla1, function(bullet){
            bullet.destroy();
          });
          self.physics.add.collider(bullet, self.isla2, function(bullet){
            bullet.destroy();
          });
          self.physics.add.collider(bullet, self.isla3, function(bullet){
            bullet.destroy();
          });
          self.physics.add.collider(bullet, self.isla4, function(bullet){
            bullet.destroy();
          });

          //Colisi??n con la mira
          self.physics.add.collider(bullet, reticula, function(bullet){
            bullet.destroy();
          });

          //Manejo de la colisi??n de la bala y otros jugadores
          if(enemy.vida>0){
            self.physics.add.collider(bullet, enemyImag, function(bullet){
              distCorta = 100;
              distMedia = 250;
              corta = false;
              media = false;
              larga = false;  
              let distancia = Math.sqrt((bullet.x - player.x)**2 + (bullet.y - player.y)**2);
              let dist;
              if(distancia <= distCorta)
              {
                dist = "corta";
              }
              else if(distancia > distCorta && distancia<= distMedia)
              {
                dist = "media";
              }
              else if(distancia > distMedia)
              {
                dist = "larga";
              }
              bullet.destroy();
              handleHit(nave, dist, enemy);
            });
          }  
      }
    }

    /*Funci??n que maneja el da??o hecho por cada vez que se lanza el evento disparo del click, seg??n el tipo de arma es el da??o hecho.
    el da??o luego es enviado por socket al otro jugador. Tambi??n realiza la gesti??n de vida del oponente - da??o para poder
    mostrar que estamos haciendole da??o al otro jugador y que este se queda sin vida.*/
    function handleHit(nave, dist, enemy){
      probabilidad = Math.floor(Math.random() * (11)); //Probabilidad Base
      let Escarguero;
      if(self.equipo === 1){
        //--------------------------------------------------------------------------------------------------------------------------------
        //                                                  CA??ON DEL DESTRUCTOR
        //--------------------------------------------------------------------------------------------------------------------------------
        if(nave.armas === 0)
        {
          if(enemy.profundidad === 0){
            if(dist === "corta")
            {
              probExtra = Math.floor(Math.random() * (2)); //Bonificaci??n de probabilidad
              if((probabilidad + probExtra) > 3)
              {
                hitted(enemy.imagen.x, enemy.imagen.y); 
                danio = 6;             
                let contadorAviso = 0;

                //----------------------- Texto que muestra el da??o hecho en el juego -----------------------
                self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                  '', {font: '30px monospace', fill: '#024A86', align: 'center'});

                function aviso(){
                  self.Hit2.setText('Da??o: ' + danio);
                  contadorAviso++;
                  if (contadorAviso==3){
                    self.statusEnvio.remove(true);
                  }
                }
                function elimAvisoDam(){
                  self.Hit2.destroy();
                }
                //Timer de aviso
                self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
                //Elimino aviso
                self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: elimAvisoDam, callbackScope: self});
                
                //----------------------- Env??o el da??o y el carguero da??ado al socket -----------------------
                pack = {
                  danio: danio,
                  carguero: 0
                } 
                self.socket.emit('playerHit', pack);

                if(danio >= enemy.vida)
                {
                  enemy.vida = 0;
                  destroyed(enemy.imagen); //Funci??n que anima fuego
                  enemy.imagen.setActive(false);
                  enemy.imagen.setVisible(false);
                  enemy.imagen.removeInteractive();
                  
                  let envio = {
                    socket: self.socket,
                    resultado: 1,
                    equipo: 1
                  }

                  let envioSocket = {
                    resultado: 1,
                    equipo: 1
                  }
                  
                  //Evento de explosi??n del submarino
                  explosionSubmarino();
                  self.voyGameOver = self.time.addEvent({ delay: 6000, callback: voyFindScene, callbackScope: self});
                  function voyFindScene(){
                    self.soundBackground.stop();
                    self.soundAction.stop();
                    self.socket.emit('Finalizo', envioSocket);
                    self.scene.start(DEF.SCENES.FinScene, envio);
                  }
                }
                else
                {
                  enemy.vida = enemy.vida - danio;  
                }
              }else{
                if(enemy.vida > 0){
                  let contadorAviso = 0;

                  //----------------------- Texto que muestra el da??o hecho en el juego -----------------------
                  self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                    '', {font: '30px monospace', fill: '#fff', align: 'center'});

                  function aviso(){
                    self.Hit2.setText('Miss');
                    contadorAviso++;
                    if (contadorAviso==3){
                      self.statusEnvio.remove(true);
                    }
                  }
                  function elimAvisoDam(){
                    self.Hit2.destroy();
                  }
                  //Timer de aviso
                  self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
                  //Elimino aviso
                  self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: elimAvisoDam, callbackScope: self});
                }
              }  
            }
            else if(dist === "media")
            {
              probExtra = Math.floor(Math.random() * (3));
              if((probabilidad + probExtra) > 3){
                hitted(enemy.imagen.x, enemy.imagen.y); 
                danio = 6;
                let contadorAviso = 0;

                //----------------------- Texto que muestra el da??o hecho en el juego -----------------------
                self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                  '', {font: '30px monospace', fill: '#024A86', align: 'center'});

                function aviso(){
                  self.Hit2.setText('Da??o: ' + danio);
                  contadorAviso++;
                  if (contadorAviso==3){
                    self.statusEnvio.remove(true);
                  }
                }
                function elimAvisoDam(){
                  self.Hit2.destroy();
                }
                //Timer de aviso
                self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
                //Elimino aviso
                self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: elimAvisoDam, callbackScope: self});
                
                //----------------------- Env??o el da??o y el carguero da??ado al socket -----------------------
                pack ={
                  danio: danio,
                  carguero: 0
                } 
                self.socket.emit('playerHit', pack);

                if(danio >= enemy.vida)
                {
                  enemy.vida = 0;
                  destroyed(enemy.imagen); //Funcion que anima fuego
                  enemy.imagen.setActive(false);
                  enemy.imagen.setVisible(false);
                  enemy.imagen.removeInteractive();
                  
                  let envio={
                    socket: self.socket,
                    resultado: 1,
                    equipo: 1
                  }

                  let envioSocket= {
                    resultado: 1,
                    equipo: 1
                  }
                  
                  //Evento de explosi??n del submarino
                  explosionSubmarino();
                  self.voyGameOver = self.time.addEvent({ delay: 6000, callback: voyFindScene, callbackScope: self});
                  function voyFindScene(){
                    self.soundBackground.stop();
                    self.soundAction.stop();
                    self.socket.emit('Finalizo', envioSocket);
                    self.scene.start(DEF.SCENES.FinScene, envio);
                  }
                }
                else
                {
                  enemy.vida = enemy.vida - danio;  
                }
              }else{
                if(enemy.vida > 0){
                  let contadorAviso = 0;

                  //----------------------- Texto que muestra el da??o hecho en el juego -----------------------
                  self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                    '', {font: '30px monospace', fill: '#fff', align: 'center'});

                  function aviso(){
                    self.Hit2.setText('Miss');
                    contadorAviso++;
                    if (contadorAviso==3){
                      self.statusEnvio.remove(true);
                    }
                  }
                  function elimAvisoDam(){
                    self.Hit2.destroy();
                  }
                  //Timer de aviso
                  self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
                  //Elimino aviso
                  self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: elimAvisoDam, callbackScope: self});
                }
              }  
            }
            else if(dist === "larga")
            {
              probExtra = Math.floor(Math.random() * (3));
              if((probabilidad + probExtra) > 6){
                hitted(enemy.imagen.x, enemy.imagen.y); 
                danio = 6;
                let contadorAviso = 0;

                //----------------------- Texto que muestra el da??o hecho en el juego -----------------------
                self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                  '', {font: '30px monospace', fill: '#024A86', align: 'center'});

                function aviso(){
                  self.Hit2.setText('Da??o: ' + danio);
                  contadorAviso++;
                  if (contadorAviso==3){
                    self.statusEnvio.remove(true);
                  }
                }
                function elimAvisoDam(){
                  self.Hit2.destroy();
                }
                //Timer de aviso     
                self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
                //Elimino aviso
                self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: elimAvisoDam, callbackScope: self});
                
                //----------------------- Env??o el da??o y el carguero da??ado al socket -----------------------
                pack ={
                  danio: danio,
                  carguero: 0
                } 
                self.socket.emit('playerHit', pack);

                if(danio >= enemy.vida)
                {
                  enemy.vida = 0;
                  destroyed(enemy.imagen); //Funci??n que anima fuego
                  enemy.imagen.setActive(false);
                  enemy.imagen.setVisible(false);
                  enemy.imagen.removeInteractive();
                  
                  let envio={
                    socket: self.socket,
                    resultado: 1,
                    equipo: 1
                  }

                  let envioSocket= {
                    resultado: 1,
                    equipo: 1
                  }
                  
                  //Evento de explosi??n del submarino
                  explosionSubmarino();
                  self.voyGameOver = self.time.addEvent({ delay: 6000, callback: voyFindScene, callbackScope: self});
                  function voyFindScene(){
                    self.soundBackground.stop();
                    self.soundAction.stop();
                    self.socket.emit('Finalizo', envioSocket);
                    self.scene.start(DEF.SCENES.FinScene, envio);
                  }
                }
                else
                {
                  enemy.vida = enemy.vida - danio;  
                }
              }else{
                if(enemy.vida > 0){
                  let contadorAviso = 0;

                  //----------------------- Texto que muestra el da??o hecho en el juego -----------------------
                  self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                    '', {font: '30px monospace', fill: '#fff', align: 'center'});

                  function aviso(){
                    self.Hit2.setText('Miss');
                    contadorAviso++;
                    if (contadorAviso==3){
                      self.statusEnvio.remove(true);
                    }
                  }
                  function elimAvisoDam(){
                    self.Hit2.destroy();
                  }
                  //Timer de aviso
                  self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
                  //Elimino aviso
                  self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: elimAvisoDam, callbackScope: self});
                }
              } 
            }
          }else{
            let contadorAviso = 0;

            //----------------------- Texto que muestra el da??o hecho en el juego -----------------------
            self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
              '', {font: '30px monospace', fill: '#fff', align: 'center'});

            function aviso(){
              self.Hit2.setText('Miss');
              contadorAviso++;
              if (contadorAviso==3){
                self.statusEnvio.remove(true);
              }
            }
            function elimAvisoDam(){
              self.Hit2.destroy();
            }
            //Timer de aviso
            self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
            //Elimino aviso
            self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: elimAvisoDam, callbackScope: self});
          }
        //--------------------------------------------------------------------------------------------------------------------------------
        //                                                  CARGAS DE PROFUNDIDAD DEL DESTRUCTOR
        //--------------------------------------------------------------------------------------------------------------------------------
        }else if (nave.armas === 1){
          if(dist === "corta")
          {
            probExtra = Math.floor(Math.random() * (2));
            if((probabilidad + probExtra) > 1)
            {
              if(nave.cargas === enemy.profundidad)
              {
                danio = 8;
                hitted(enemy.imagen.x, enemy.imagen.y); 
                let contadorAviso = 0;

                //----------------------- Texto que muestra el da??o hecho en el juego -----------------------
                self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                  '', {font: '30px monospace', fill: '#024A86', align: 'center'});

                function aviso(){
                  self.Hit2.setText('Da??o: ' + danio);
                  contadorAviso++;
                  if (contadorAviso==3){
                    self.statusEnvio.remove(true);
                  }
                }
                function elimAvisoDam(){
                  self.Hit2.destroy();
                }
                //Timer de aviso
                self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
                //Elimino aviso
                self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: elimAvisoDam, callbackScope: self});
                
                //----------------------- Env??o el da??o y el carguero da??ado al socket -----------------------
                pack ={
                  danio: danio,
                  carguero: 0
                } 
                self.socket.emit('playerHit', pack);

                if(danio >= enemy.vida)
                {
                  enemy.vida = 0;
                  destroyed(enemy.imagen); //Funcion que anima fuego
                  enemy.imagen.setActive(false);
                  enemy.imagen.setVisible(false);
                  enemy.imagen.removeInteractive();
                  
                  let envio={
                    socket: self.socket,
                    resultado: 1,
                    equipo: 1
                  }

                  let envioSocket= {
                    resultado: 1,
                    equipo: 1
                  }
                  
                  //Evento de explosi??n del submarino
                  explosionSubmarino();
                  self.voyGameOver = self.time.addEvent({ delay: 6000, callback: voyFindScene, callbackScope: self});
                  function voyFindScene(){
                    self.soundBackground.stop();
                    self.soundAction.stop();
                    self.socket.emit('Finalizo', envioSocket);
                    self.scene.start(DEF.SCENES.FinScene, envio);
                  }
                }
                else
                {
                  enemy.vida = enemy.vida - danio;  
                }
              }else{
                if(enemy.vida > 0){
                  let contadorAviso = 0;

                  //----------------------- Texto que muestra el da??o hecho en el juego -----------------------
                  self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                    '', {font: '30px monospace', fill: '#fff', align: 'center'});

                  function aviso(){
                    self.Hit2.setText('Miss');
                    contadorAviso++;
                    if (contadorAviso==3){
                      self.statusEnvio.remove(true);
                    }
                  }
                  function elimAvisoDam(){
                    self.Hit2.destroy();
                  }
                  //Timer de aviso
                  self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
                  //Elimino aviso
                  self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: elimAvisoDam, callbackScope: self});
                }
              }  
            }else{
              if(enemy.vida > 0){
                let contadorAviso = 0;

                //----------------------- Texto que muestra el da??o hecho en el juego -----------------------
                self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                  '', {font: '20px monospace', fill: '#fff', align: 'center'});

                function aviso(){
                  self.Hit2.setText('Miss');
                  contadorAviso++;
                  if (contadorAviso==3){
                    self.statusEnvio.remove(true);
                  }
                }
                function elimAvisoDam(){
                  self.Hit2.destroy();
                }
                //Timer de aviso
                self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
                //Elimino aviso
                self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: elimAvisoDam, callbackScope: self});
              }
            }  
          }
          else if(dist === "media")
          {
            probExtra = Math.floor(Math.random() * (3));
            if((probabilidad + probExtra) > 7)
            {
              if(nave.cargas === enemy.profundidad)
              {
                danio = 8;
                hitted(enemy.imagen.x, enemy.imagen.y); 
                let contadorAviso = 0;

                //----------------------- Texto que muestra el da??o hecho en el juego -----------------------
                self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                  '', {font: '30px monospace', fill: '#024A86', align: 'center'});

                function aviso(){
                  self.Hit2.setText('Da??o: ' + danio);
                  contadorAviso++;
                  if (contadorAviso==3){
                    self.statusEnvio.remove(true);
                  }
                }
                function elimAvisoDam(){
                  self.Hit2.destroy();
                }
                //Timer de aviso
                self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
                //Elimino aviso 
                self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: elimAvisoDam, callbackScope: self});
                
                //----------------------- Env??o el da??o y el carguero da??ado al socket -----------------------
                pack ={
                  danio: danio,
                  carguero: 0
                }
                self.socket.emit('playerHit', pack);

                if(danio >= enemy.vida)
                {
                  enemy.vida = 0;
                  destroyed(enemy.imagen); //Funcion que anima fuego
                  enemy.imagen.setActive(false);
                  enemy.imagen.setVisible(false);
                  enemy.imagen.removeInteractive();
                  
                  let envio={
                    socket: self.socket,
                    resultado: 1,
                    equipo: 1
                  }

                  let envioSocket= {
                    resultado: 1,
                    equipo: 1
                  }
                  
                  //Evento de explosi??n del submarino
                  explosionSubmarino();
                  self.voyGameOver = self.time.addEvent({ delay: 6000, callback: voyFindScene, callbackScope: self});
                  function voyFindScene(){
                    self.soundBackground.stop();
                    self.soundAction.stop();
                    self.socket.emit('Finalizo', envioSocket);
                    self.scene.start(DEF.SCENES.FinScene, envio);
                  }
                }
                else
                {
                  enemy.vida = enemy.vida - danio;  
                }
              }else{
                if(enemy.vida > 0){
                  let contadorAviso = 0;

                  //----------------------- Texto que muestra el da??o hecho en el juego -----------------------
                  self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                    '', {font: '30px monospace', fill: '#fff', align: 'center'});

                  function aviso(){
                    self.Hit2.setText('Miss');
                    contadorAviso++;
                    if (contadorAviso==3){
                      self.statusEnvio.remove(true);
                    }
                  }
                  function elimAvisoDam(){
                    self.Hit2.destroy();
                  }
                  //Timer de aviso
                  self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
                  //Elimino aviso
                  self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: elimAvisoDam, callbackScope: self});
                }
              }  
            }else{
              if(enemy.vida > 0){
                let contadorAviso = 0;

                //----------------------- Texto que muestra el da??o hecho en el juego -----------------------
                self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                  '', {font: '30px monospace', fill: '#fff', align: 'center'});

                function aviso(){
                  self.Hit2.setText('Miss');
                  contadorAviso++;
                  if (contadorAviso==3){
                    self.statusEnvio.remove(true);
                  }
                }
                function elimAvisoDam(){
                  self.Hit2.destroy();
                }
                //Timer de aviso
                self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
                //Elimino aviso
                self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: elimAvisoDam, callbackScope: self});
              }
            }  
          }
        }
      }
      else if (self.equipo === 2)
      {
        //--------------------------------------------------------------------------------------------------------------------------------
        //                                                  CA??ON DEL SUBMARINO
        //--------------------------------------------------------------------------------------------------------------------------------                  
        if(nave.armas === 0){
          if(dist === "corta")
          {
            probExtra = Math.floor(Math.random() * (2));
            if((probabilidad + probExtra) > 2)
            {
              hitted(enemy.imagen.x, enemy.imagen.y); 
              danio = 4;
              
              //----------------------- Texto que muestra el da??o hecho en el juego -----------------------
              let contadorAviso = 0;
              self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                '', {font: '20px monospace', fill: '#024A86', align: 'center'});

              function aviso(){
                self.Hit2.setText('Da??o: ' + danio);
                contadorAviso++;
                if (contadorAviso==3){
                  self.statusEnvio.remove(true);
                }
              }
              function elimAvisoDam(){
                self.Hit2.destroy();
              }
              //Timer de aviso
              self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
              //Elimino aviso
              self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: elimAvisoDam, callbackScope: self});
              
              //----------------------- Env??o el da??o y el carguero da??ado al socket -----------------------
              switch(enemy)
              {
                case self.carguero1:
                  Escarguero = 1;
                  break;
                case self.carguero2:
                  Escarguero = 2;
                  break;
                case self.carguero3:
                  Escarguero = 3;
                  break;
                case self.carguero4:
                  Escarguero = 4;
                  break;
                case self.carguero5:
                  Escarguero = 5;
                  break;
                case self.carguero6:
                  Escarguero = 6;
                  break;
                default:
                  Escarguero = 0;
                  break;
              }
              pack = {
                danio: danio,
                carguero: Escarguero
              }              
              self.socket.emit('playerHit', pack);

              if(enemy.vida <= danio)
              {
                enemy.vida = 0;
                destroyed(enemy.imagen);
                enemy.imagen.setActive(false);
                enemy.imagen.setVisible(false);
                enemy.imagen.removeInteractive();
                
                //Evento de explosi??n si enemigo es carguero o destructor
                if(Escarguero === 1 || Escarguero === 2 || Escarguero === 3 || Escarguero === 4 || Escarguero === 5 || Escarguero === 6){
                  explosionCarguero();
                }else if(Escarguero === 0){
                  explosionDestructor();
                }
              }else{
                enemy.vida = enemy.vida - danio;
              }
            }else{
              if(enemy.vida > 0){
                let contadorAviso = 0;

                //----------------------- Texto que muestra el da??o hecho en el juego -----------------------
                self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                  '', {font: '20px monospace', fill: '#fff', align: 'center'});

                function aviso(){
                  self.Hit2.setText('Miss');
                  contadorAviso++;
                  if (contadorAviso==3){
                    self.statusEnvio.remove(true);
                  }
                }
                function elimAvisoDam(){
                  self.Hit2.destroy();
                }
                //Timer de aviso
                self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
                //Elimino aviso
                self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: elimAvisoDam, callbackScope: self});
              }
            } 
          }
          else if(dist === "media"){
             probExtra = Math.floor(Math.random() * (3));
             if((probabilidad + probExtra) > 3){
              hitted(enemy.imagen.x, enemy.imagen.y); 
              danio = 4;
              let contadorAviso = 0;

              //----------------------- Texto que muestra el da??o hecho en el juego -----------------------
              self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                '', {font: '20px monospace', fill: '#024A86', align: 'center'});

              function aviso(){
                self.Hit2.setText('Da??o: ' + danio);
                contadorAviso++;
                if (contadorAviso==3){
                  self.statusEnvio.remove(true);
                }
              }
              function elimAvisoDam(){
                self.Hit2.destroy();
              }
              //Timer de aviso
              self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
              //Elimino aviso
              self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: elimAvisoDam, callbackScope: self});
              
              //----------------------- Env??o el da??o y el carguero da??ado al socket -----------------------
              switch(enemy)
              {
                case self.carguero1:
                  Escarguero = 1;
                  break;
                case self.carguero2:
                  Escarguero = 2;
                  break;
                case self.carguero3:
                  Escarguero = 3;
                  break;
                case self.carguero4:
                  Escarguero = 4;
                  break;
                case self.carguero5:
                  Escarguero = 5;
                  break;
                case self.carguero6:
                  Escarguero = 6;
                  break;
                default:
                  Escarguero = 0;
                  break;
              }
              pack ={
                danio: danio,
                carguero: Escarguero
              }              
              self.socket.emit('playerHit', pack);

              if(enemy.vida <= danio)
              {
                enemy.vida = 0;
                destroyed(enemy.imagen);
                enemy.imagen.setActive(false);
                enemy.imagen.setVisible(false);
                enemy.imagen.removeInteractive();
                
                //Evento de explosi??n si enemigo es carguero o destructor
                if(Escarguero === 1 || Escarguero === 2 || Escarguero === 3 || Escarguero === 4 || Escarguero === 5 || Escarguero === 6){
                  explosionCarguero();
                }else if(Escarguero === 0){
                  explosionDestructor();
                }
              }else{
                enemy.vida = enemy.vida - danio;
              }
            }else{
              if(enemy.vida > 0){
                let contadorAviso = 0;

                //----------------------- Texto que muestra el da??o hecho en el juego -----------------------
                self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                  '', {font: '20px monospace', fill: '#fff', align: 'center'});

                function aviso(){
                  self.Hit2.setText('Miss');
                  contadorAviso++;
                  if (contadorAviso==3){
                    self.statusEnvio.remove(true);
                  }
                }
                function elimAvisoDam(){
                  self.Hit2.destroy();
                }
                //Timer de aviso
                self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
                //Elimino aviso
                self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: elimAvisoDam, callbackScope: self});
              }
            }  
          }
          else if(dist === "larga"){
            probExtra = Math.floor(Math.random() * (3));
            if((probabilidad + probExtra) > 8){
              hitted(enemy.imagen.x, enemy.imagen.y); 
              danio = 4;
              let contadorAviso = 0;

              //----------------------- Texto que muestra el da??o hecho en el juego -----------------------
              self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                '', {font: '20px monospace', fill: '#024A86', align: 'center'});

              function aviso(){
                self.Hit2.setText('Da??o: ' + danio);
                contadorAviso++;
                if (contadorAviso==3){
                  self.statusEnvio.remove(true);
                }
              }
              function elimAvisoDam(){
                self.Hit2.destroy();
              }
              //Timer de aviso
              self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
              //Elimino aviso
              self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: elimAvisoDam, callbackScope: self});
              
              //----------------------- Env??o el da??o y el carguero da??ado al socket -----------------------
              switch(enemy)
              {
                case self.carguero1:
                  Escarguero = 1;
                  break;
                case self.carguero2:
                  Escarguero = 2;
                  break;
                case self.carguero3:
                  Escarguero = 3;
                  break;
                case self.carguero4:
                  Escarguero = 4;
                  break;
                case self.carguero5:
                  Escarguero = 5;
                  break;
                case self.carguero6:
                  Escarguero = 6;
                  break;
                default:
                  Escarguero = 0;
                  break;
              }
              pack ={
                danio: danio,
                carguero: Escarguero
              }              
              self.socket.emit('playerHit', pack);

              if(enemy.vida <= danio)
              {
                enemy.vida = 0;
                destroyed(enemy.imagen);
                enemy.imagen.setActive(false);
                enemy.imagen.setVisible(false);
                enemy.imagen.removeInteractive();
                
                //Evento de explosi??n si enemigo es carguero o destructor
                if(Escarguero === 1 || Escarguero === 2 || Escarguero === 3 || Escarguero === 4 || Escarguero === 5 || Escarguero === 6){
                  explosionCarguero();
                }else if(Escarguero === 0){
                  explosionDestructor();
                }
              }else{
                enemy.vida = enemy.vida - danio;
              }
            }else{
              if(enemy.vida > 0){
                let contadorAviso = 0;

                //----------------------- Texto que muestra el da??o hecho en el juego -----------------------
                self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                  '', {font: '20px monospace', fill: '#fff', align: 'center'});

                function aviso(){
                  self.Hit2.setText('Miss');
                  contadorAviso++;
                  if (contadorAviso==3){
                    self.statusEnvio.remove(true);
                  }
                }
                function elimAvisoDam(){
                  self.Hit2.destroy();
                }
                //Timer de aviso
                self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
                //Elimino aviso
                self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: elimAvisoDam, callbackScope: self});
              }
            }
          }
        }
        else if (nave.armas === 1 || nave.armas === 4){
          //--------------------------------------------------------------------------------------------------------------------------------
          //                                                  TORPEDOS DEL SUBMARINO
          //--------------------------------------------------------------------------------------------------------------------------------
          if(dist === "corta"){
            probExtra = Math.floor(Math.random() * (2));
            if((probabilidad + probExtra) > 2){
              danio = 6;
              hitted(enemy.imagen.x, enemy.imagen.y); 
              let contadorAviso = 0;

              //----------------------- Texto que muestra el da??o hecho en el juego -----------------------
              self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                '', {font: '20px monospace', fill: '#024A86', align: 'center'});

              function aviso(){
                self.Hit2.setText('Da??o: ' + danio);
                contadorAviso++;
                if (contadorAviso==3){
                  self.statusEnvio.remove(true);
                }
              }
              function elimAvisoDam(){
                self.Hit2.destroy();
              }
              //Timer de aviso
              self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
              //Elimino aviso
              self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: elimAvisoDam, callbackScope: self});
              
              //----------------------- Env??o el da??o y el carguero da??ado al socket -----------------------
              switch(enemy)
              {
                case self.carguero1:
                  Escarguero = 1;
                  break;
                case self.carguero2:
                  Escarguero = 2;
                  break;
                case self.carguero3:
                  Escarguero = 3;
                  break;
                case self.carguero4:
                  Escarguero = 4;
                  break;
                case self.carguero5:
                  Escarguero = 5;
                  break;
                case self.carguero6:
                  Escarguero = 6;
                  break;
                default:
                  Escarguero = 0;
                  break;
              }
              pack = {
                danio: danio,
                carguero: Escarguero
              }              
              self.socket.emit('playerHit', pack);

              if(enemy.vida <= danio)
              {
                enemy.vida = 0;
                destroyed(enemy.imagen);
                enemy.imagen.removeInteractive();
                enemy.imagen.setActive(false);
                enemy.imagen.setVisible(false);
                self.textures.remove(enemy.imagen);
                
                //Evento de explosi??n si enemigo es carguero o destructor
                if(Escarguero === 1 || Escarguero === 2 || Escarguero === 3 || Escarguero === 4 || Escarguero === 5 || Escarguero === 6){
                  explosionCarguero();
                }else if(Escarguero === 0){
                  explosionDestructor();
                }
              }else{
                enemy.vida = enemy.vida - danio;
              }
            }else{
              if(enemy.vida > 0){
                let contadorAviso = 0;

                //----------------------- Texto que muestra el da??o hecho en el juego -----------------------
                self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                  '', {font: '20px monospace', fill: '#fff', align: 'center'});

                function aviso(){
                  self.Hit2.setText('Miss');
                  contadorAviso++;
                  if (contadorAviso==3){
                    self.statusEnvio.remove(true);
                  }
                }
                function elimAvisoDam(){
                  self.Hit2.destroy();
                }
                //Timer de aviso
                self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
                //Elimino aviso
                self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: elimAvisoDam, callbackScope: self});
              }
            }
          }
          else if(dist === "media"){
            probExtra = Math.floor(Math.random() * (3));
            if((probabilidad + probExtra) > 3){
              danio = 6;
              hitted(enemy.imagen.x, enemy.imagen.y); 
              let contadorAviso = 0;

              //----------------------- Texto que muestra el da??o hecho en el juego -----------------------
              self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                '', {font: '20px monospace', fill: '#024A86', align: 'center'});

              function aviso(){
                self.Hit2.setText('Da??o: ' + danio);
                contadorAviso++;
                if (contadorAviso==3){
                  self.statusEnvio.remove(true);
                }
              }
              function elimAvisoDam(){
                self.Hit2.destroy();
              }
              //Timer de aviso
              self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
              //Elimino aviso
              self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: elimAvisoDam, callbackScope: self});

              //----------------------- Env??o el da??o y el carguero da??ado al socket -----------------------
              switch(enemy)
              {
                case self.carguero1:
                  Escarguero = 1;
                  break;
                case self.carguero2:
                  Escarguero = 2;
                  break;
                case self.carguero3:
                  Escarguero = 3;
                  break;
                case self.carguero4:
                  Escarguero = 4;
                  break;
                case self.carguero5:
                  Escarguero = 5;
                  break;
                case self.carguero6:
                  Escarguero = 6;
                  break;
                default:
                  Escarguero = 0;
                  break;
              }
              pack ={
                danio: danio,
                carguero: Escarguero
              }              
              self.socket.emit('playerHit', pack);

              if(enemy.vida <= danio)
              {
                enemy.vida = 0;
                destroyed(enemy.imagen);
                enemy.imagen.removeInteractive();
                enemy.imagen.setActive(false);
                enemy.imagen.setVisible(false);
                self.textures.remove(enemy.imagen);

                //Evento de explosi??n si enemigo es carguero o destructor
                if(Escarguero === 1 || Escarguero === 2 || Escarguero === 3 || Escarguero === 4 || Escarguero === 5 || Escarguero === 6){
                  explosionCarguero();
                }else if(Escarguero === 0){
                  explosionDestructor();
                }
              }else{
                enemy.vida = enemy.vida - danio;
              }
            }else{
               if(enemy.vida > 0){
                let contadorAviso = 0;

                //----------------------- Texto que muestra el da??o hecho en el juego -----------------------
                self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                  '', {font: '20px monospace', fill: '#fff', align: 'center'});

                function aviso(){
                  self.Hit2.setText('Miss');
                  contadorAviso++;
                  if (contadorAviso==3){
                    self.statusEnvio.remove(true);
                  }
                }
                function elimAvisoDam(){
                  self.Hit2.destroy();
                }
                //Timer de aviso
                self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
                //Elimino aviso
                self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: elimAvisoDam, callbackScope: self});
              }
            } 
          }
          else if(dist === "larga"){
            probExtra = Math.floor(Math.random() * (3));
            if((probabilidad + probExtra) > 5)
            {
              danio = 6;
              hitted(enemy.imagen.x, enemy.imagen.y); 
              let contadorAviso = 0;

              //----------------------- Texto que muestra el da??o hecho en el juego -----------------------
              self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                '', {font: '20px monospace', fill: '#024A86', align: 'center'});
              function aviso(){
                self.Hit2.setText('Da??o: ' + danio);
                contadorAviso++;
                if (contadorAviso==3){
                  self.statusEnvio.remove(true);
                }
              }
              function elimAvisoDam(){
                self.Hit2.destroy();
              }
              //Timer de aviso
              self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
              //Elimino aviso
              self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: elimAvisoDam, callbackScope: self});
              
              //----------------------- Env??o el da??o y el carguero da??ado al socket -----------------------
              switch(enemy)
              {
                case self.carguero1:
                  Escarguero = 1;
                  break;
                case self.carguero2:
                  Escarguero = 2;
                  break;
                case self.carguero3:
                  Escarguero = 3;
                  break;
                case self.carguero4:
                  Escarguero = 4;
                  break;
                case self.carguero5:
                  Escarguero = 5;
                  break;
                case self.carguero6:
                  Escarguero = 6;
                  break;
                default:
                  Escarguero = 0;
                  break;
              }
              pack ={
                danio: danio,
                carguero: Escarguero
              }              
              self.socket.emit('playerHit', pack);

              if(enemy.vida <= danio)
              {
                enemy.vida = 0;
                destroyed(enemy.imagen);
                enemy.imagen.removeInteractive();
                enemy.imagen.setActive(false);
                enemy.imagen.setVisible(false);
                self.textures.remove(enemy.imagen);

                //Evento de explosi??n si enemigo es carguero o destructor
                if(Escarguero === 1 || Escarguero === 2 || Escarguero === 3 || Escarguero === 4 || Escarguero === 5 || Escarguero === 6){
                  explosionCarguero();
                }else if(Escarguero === 0){
                  explosionDestructor();
                }
              }else{
                enemy.vida = enemy.vida - danio;
              } 
            }else{
              if(enemy.vida > 0){
                let contadorAviso = 0;

                //----------------------- Texto que muestra el da??o hecho en el juego -----------------------
                self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                  '', {font: '20px monospace', fill: '#fff', align: 'center'});

                function aviso(){
                  self.Hit2.setText('Miss');
                  contadorAviso++;
                  if (contadorAviso==3){
                    self.statusEnvio.remove(true);
                  }
                }
                function elimAvisoDam(){
                  self.Hit2.destroy();
                }
                //Timer de aviso
                self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
                //Elimino aviso
                self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: elimAvisoDam, callbackScope: self});
              }
            }
          }     
        }      
      } 
    }
   
    //Funci??n que muestra la explosi??n en la posici??n determinada
    function hitted(x, y){
      //Se crea el sprite de explosiones
      self.explotion2 = self.add.sprite(x,y,'explot').setDisplaySize(120, 120).setDepth(5); 
      //Se crea la animaci??n para la explosi??n luego de recibir disparo 
      self.anims.create({  
      key: 'explot2',
      frames: [
          { key: 'explot',frame:"PngItem_4145768_01_29.gif" },
          { key: 'explot',frame:"PngItem_4145768_01_30.gif" },
          { key: 'explot',frame:"PngItem_4145768_01_31.gif" },
          { key: 'explot',frame:"PngItem_4145768_01_32.gif" },
      ],
      hideOnComplete: true,
      });
      self.explotion2.play('explot2');
    }

    //Funci??n que muestra y destruye un jugador
    function destroyed(playerIMG){
      //Se crea el sprite de explosiones
      self.explotion3 = self.add.sprite(playerIMG.x ,playerIMG.y, 'explot').setDisplaySize(200, 200).setDepth(5); 
      //Se crea la animaci??n para la explosi??n luego de recibir disparo 
      self.anims.create({  
        key: 'explot3',
        frames: [
            { key: 'explot',frame:"PngItem_4145768_01_29.gif" },
            { key: 'explot',frame:"PngItem_4145768_01_30.gif" },
            { key: 'explot',frame:"PngItem_4145768_01_31.gif" },
            { key: 'explot',frame:"PngItem_4145768_01_32.gif" },
        ],
        frameRate: 5,
        repeat:-1,
        hideOnComplete: false,
      });
      self.explotion3.play('explot3');
    }

    //Funci??n que muestra una cruz animada se??alando de donde vino el disparo enemigo
    function cruz(imagen){
      self.cruz = self.add.sprite(imagen.x, imagen.y, 'CRUZ').setDepth(10).setDisplaySize(80,80);
      self.anims.create({  
        key: 'ani',
        frames: [
            { key: 'CRUZ',frame:"cruzaler.png" },
            { key: 'CRUZ',frame:"cruzalerr.png" }
        ],
        frameRate: 5,
        repeat:3,
        hideOnComplete: true,
      });
      self.cruz.play('ani');
    }

    //Funcion que procesa el da??o y el porcentaje de acierto
    function recibeHit(player, damage, escar, enemy, expl){
      if(musicaCombate === false){
        self.soundBackground.stop();
        self.soundAction.play({volume: 0.2, loop: true});
        musicaCombate = true;
      }
      let contadorAviso = 0;
      playerIMG = player.imagen;

      //Muestro la cruz en el mapa
      cruz(enemy.imagen);
      hitted(playerIMG.x, playerIMG.y);

      //----------------------- Texto que muestra el da??o hecho en el juego -----------------------
      self.Hit = self.add.text( playerIMG.x + 25, playerIMG.y + 25, 
        '', {font: '30px monospace', fill: '#FF0000', align: 'center'});
      
      function aviso(){
        self.Hit.setText('??Impacto Recibido! Da??o: ' + damage);
        contadorAviso++;
        if (contadorAviso==3){
          self.status.remove(true);
        }
      }
      function elimAvisoDam(){
        self.Hit.destroy();
      }
      //Timer de aviso
      self.status = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
      //Elimino aviso
      self.statusReset = self.time.addEvent({ delay: 700, callback: elimAvisoDam, callbackScope: self});

      if(player.vida > 0){
        self.soundImpacto.play({volume: 0.08, loop: false});
        player.vida = player.vida - damage; 
        if(escar){
          //Activo alerta de da??o sobre cargueros
          alertaCargueros();
          self.soundAlarm.play({volume: 0.06, loop: false});
        }
        //Muestro en la parte gr??fica la vida actualizada de cada barco luego del disparo
        if (self.equipo == 1){
          self.UIDesVida.setText('Vida: ' + self.destructor.vida);
          self.UIDesCarg1.setText('Vida carguero 1: ' + self.carguero1.vida);
          self.UIDesCarg2.setText('Vida carguero 2: ' + self.carguero2.vida);
          self.UIDesCarg3.setText('Vida carguero 3: ' + self.carguero3.vida);
          self.UIDesCarg4.setText('Vida carguero 4: ' + self.carguero4.vida);
          self.UIDesCarg5.setText('Vida carguero 5: ' + self.carguero5.vida);
          self.UIDesCarg6.setText('Vida carguero 6: ' + self.carguero6.vida);
        }else{
          self.UISubVida.setText('Vida: ' + player.vida);
        }
      }
      if(player.vida <= 0){
        switch(player){
          case self.carguero1:
            self.carguero1.particles.setActive(false).setVisible(false);
            self.physics.world.removeCollider(self.collDesCarg1);
            self.particles()
            break;
          case self.carguero2:
            self.physics.world.removeCollider(self.collDesCarg2);
            self.carguero2.particles.setActive(false).setVisible(false);
            break;
          case self.carguero3:
            self.physics.world.removeCollider(self.collDesCarg3);
            self.carguero3.particles.setActive(false).setVisible(false);
            break;
          case self.carguero4:
            self.physics.world.removeCollider(self.collDesCarg4);
            self.carguero4.particles.setActive(false).setVisible(false);
            break;
          case self.carguero5:
            self.physics.world.removeCollider(self.collDesCarg5);
            self.carguero5.particles.setActive(false).setVisible(false);
            break;
          case self.carguero6:
            self.physics.world.removeCollider(self.collDesCarg6);
            self.carguero6.particles.setActive(false).setVisible(false);
            break;
        }
        destroyed(playerIMG);
        playerIMG.removeInteractive();
        playerIMG.setActive(false);
        playerIMG.setVisible(false);
        self.textures.remove(playerIMG);
        if(escar){
          alertaCargueros();
          self.soundAlarm.play({volume: 0.06, loop: false});
          if(expl === 0){
            //Evento de explosi??n de carguero 
            explosionCarguero();
          }   
          carguerosMuertos++;
        }
        if(expl === 1){
          //Evento de explosi??n de destructor 
          explosionDestructor();
        }else if(expl ===2){
          //Evento de explosi??n de submarino 
          explosionSubmarino();
        }
      }
      if(carguerosMuertos > 3){
        let envio={
          socket: self.socket,
          resultado: 1,
          equipo: 2
        }
        let envioSocket= {
          resultado: 2,
          equipo: 1
        }
        self.voyGameOver = self.time.addEvent({ delay: 5000, callback: voyFindScene, callbackScope: self});
        function voyFindScene(){
          self.soundBackground.stop();
          self.soundAction.stop();
          self.socket.emit('Finalizo', envioSocket);
          self.scene.start(DEF.SCENES.FinScene, envio);
        }
      }
    }
    
    //Funci??n que convierte el cursor en una mira
    this.input.on('pointermove', function (pointer){
      //Maneja la mira del destructor con el cursor  
      if(self.equipo === 1){
        if (this.input.mouse.locked){
          self.destructor.reticula.x += pointer.movementX;
          self.destructor.reticula.y += pointer.movementY;
        }
        if(self.destructor.armas == 0){
          distMaxima = 600;
          distAlto = 500;
          if ((self.destructor.reticula.x - self.destructor.imagen.x) > distMaxima)
              self.destructor.reticula.x = self.destructor.imagen.x +distMaxima;
            else if (self.destructor.reticula.x - self.destructor.imagen.x < -distMaxima)
              self.destructor.reticula.x = self.destructor.imagen.x -distMaxima;
            if (self.destructor.reticula.y - self.destructor.imagen.y > distAlto)
              self.destructor.reticula.y = self.destructor.imagen.y +distAlto;
            else if (self.destructor.reticula.y - self.destructor.imagen.y < -distAlto)
              self.destructor.reticula.y = self.destructor.imagen.y-distAlto;
        }else if (self.destructor.armas == 1){
          distMaxima = 300;
          if ((self.destructor.reticula.x - self.destructor.imagen.x) > distMaxima)
              self.destructor.reticula.x = self.destructor.imagen.x +distMaxima;
            else if (self.destructor.reticula.x - self.destructor.imagen.x < -distMaxima)
              self.destructor.reticula.x = self.destructor.imagen.x -distMaxima;
            if (self.destructor.reticula.y - self.destructor.imagen.y > distMaxima)
              self.destructor.reticula.y = self.destructor.imagen.y +distMaxima;
            else if (self.destructor.reticula.y - self.destructor.imagen.y < -distMaxima)
              self.destructor.reticula.y = self.destructor.imagen.y-distMaxima;
        }
      } 
    }, this);

    //Procedimientos sockets
    //Destruye a un jugador cuando se desconecta del socket y env??a autom??ticamente a la escena de finalizaci??n indicando que se gan?? la partida
    this.socket.on('playerDisconnected', function (playerId){
      if (playerId != self.socket.id){
        if(self.equipo===1){
          self.submarino.imagen.destroy();
        }else{
          self.destructor.imagen.destroy();
          self.carguero1.imagen.destroy();
          self.carguero2.imagen.destroy();
          self.carguero3.imagen.destroy();
          self.carguero4.imagen.destroy();
          self.carguero5.imagen.destroy();
          self.carguero6.imagen.destroy();
        }

        //Dirijo al jugador actual a la pantalla de finalizaci??n
        let envio= {
          socket: self.socket,
          resultado: 1,
          equipo: self.equipo
        }
        self.scene.start(DEF.SCENES.FinScene, envio);
      }
    });
    
    //Escucho el movimiento del otro jugador y lo dibujo en mi cliente
    this.socket.on('playerMoved', function (playerInfo){
      if(playerInfo.id != self.socket.id){
        if(self.equipo===1){
          self.submarino.imagen.x = playerInfo.x;
          self.submarino.imagen.y = playerInfo.y;
          self.submarino.imagen.rotation = playerInfo.rotation;
        }else{
          self.destructor.imagen.x = playerInfo.x;
          self.destructor.imagen.y = playerInfo.y;
          self.destructor.imagen.rotation = playerInfo.rotation;
        }
      }
    });

    //Escucho el evento de movimiento de los cargueros y lo dibujo en mi cliente dependiendo del carguero que se haya desplazado
    this.socket.on('carguerosMoved', function (playerInfo){
      if(playerInfo.id != self.socket.id){
        if(self.equipo===2){
          if(playerInfo.carguero === 1){
            self.carguero1.imagen.x = playerInfo.x;
            self.carguero1.imagen.y = playerInfo.y;
            self.carguero1.imagen.rotation = playerInfo.rotation;
          }
          if(playerInfo.carguero === 2){
            self.carguero2.imagen.x = playerInfo.x;
            self.carguero2.imagen.y = playerInfo.y;
            self.carguero2.imagen.rotation = playerInfo.rotation;
          }
          if(playerInfo.carguero === 3){
            self.carguero3.imagen.x = playerInfo.x;
            self.carguero3.imagen.y = playerInfo.y;
            self.carguero3.imagen.rotation = playerInfo.rotation;
          }
          if(playerInfo.carguero === 4){
            self.carguero4.imagen.x = playerInfo.x;
            self.carguero4.imagen.y = playerInfo.y;
            self.carguero4.imagen.rotation = playerInfo.rotation;
          }
          if(playerInfo.carguero === 5){
            self.carguero5.imagen.x = playerInfo.x;
            self.carguero5.imagen.y = playerInfo.y;
            self.carguero5.imagen.rotation = playerInfo.rotation;
          }
          if(playerInfo.carguero === 6){
            self.carguero6.imagen.x = playerInfo.x;
            self.carguero6.imagen.y = playerInfo.y;
            self.carguero6.imagen.rotation = playerInfo.rotation;
          }
        }
      }
    });

    //Escucho el tiro que me dieron desde el otro jugador y lo proceso
    this.socket.on('playerHitted', function(playerInfo){      
      let expl=2;  
      if(self.equipo===1){
        expl=0;  
        if (playerInfo.numerocarguero === 0)
        {
          let expl=1;
          recibeHit(self.destructor, playerInfo.damage, false, self.submarino, expl);
          alertaDisparo();
        }
        else if(playerInfo.numerocarguero === 1)
        {
          recibeHit(self.carguero1, playerInfo.damage, true, self.submarino, expl);
        }
        else if(playerInfo.numerocarguero === 2)
        {
          recibeHit(self.carguero2, playerInfo.damage, true, self.submarino, expl);
        }
        else if(playerInfo.numerocarguero === 3)
        {
          recibeHit(self.carguero3, playerInfo.damage, true, self.submarino, expl);
        }
        else if(playerInfo.numerocarguero === 4)
        {
          recibeHit(self.carguero4, playerInfo.damage, true, self.submarino, expl);
        }
        else if(playerInfo.numerocarguero === 5)
        {
          recibeHit(self.carguero5, playerInfo.damage, true, self.submarino, expl);
        }
        else if(playerInfo.numerocarguero === 6)
        {
          recibeHit(self.carguero6, playerInfo.damage, true, self.submarino, expl);
        }
      }else{
        recibeHit(self.submarino, playerInfo.damage, false, self.destructor, expl);
        alertaDisparo();
      }
    }); 

    this.socket.on('playerUnder', function(playerInfo){      
      self.submarino.profundidad = playerInfo.deep;
        if(self.equipo===1){
          if (self.submarino.profundidad === 1 ){
            self.submarino.imagen.setTexture(DEF.IMAGENES.UBOATP2).setVisible(true);
          }else if (self.submarino.profundidad == 2){
            self.submarino.imagen.setVisible(false);
         }else{
            self.submarino.imagen.setTexture(DEF.IMAGENES.UBOATP0).setVisible(true);
         }
        }
      if(self.submarino.profundidad === 0){
        self.colliderSub = self.physics.add.collider(self.submarino.imagen, self.destructor.imagen);
        self.colliderCarg1 = self.physics.add.collider(self.submarino.imagen, self.carguero1.imagen);
        self.colliderCarg2 = self.physics.add.collider(self.submarino.imagen, self.carguero2.imagen);
        self.colliderCarg3 = self.physics.add.collider(self.submarino.imagen, self.carguero3.imagen);
        self.colliderCarg4 = self.physics.add.collider(self.submarino.imagen, self.carguero4.imagen);
        self.colliderCarg5 = self.physics.add.collider(self.submarino.imagen, self.carguero5.imagen);
        self.colliderCarg6 = self.physics.add.collider(self.submarino.imagen, self.carguero6.imagen);
      }
      else{
        self.physics.world.removeCollider(self.colliderSub);
        self.physics.world.removeCollider(self.colliderCarg1);
        self.physics.world.removeCollider(self.colliderCarg2);
        self.physics.world.removeCollider(self.colliderCarg3);
        self.physics.world.removeCollider(self.colliderCarg4);
        self.physics.world.removeCollider(self.colliderCarg5);
        self.physics.world.removeCollider(self.colliderCarg6); 
      }
    }); 

    this.socket.on('FinalizoPartida', function(data){      
      self.soundBackground.stop();
      self.soundAction.stop();
      if(data.resultado === 1){
        var envio2={
          socket: self.socket,
          resultado: 2,
          equipo: self.equipo,
        }
        self.scene.start(DEF.SCENES.FinScene, envio2);
      }else if(data.resultado === 2){
        var envio2={
          socket: self.socket,
          resultado: 1,
          equipo: self.equipo,
        }
        self.scene.start(DEF.SCENES.FinScene, envio2);  
      }    
    }); 

    this.socket.on('recibeSubAmmo', function(data){
      self.submarino.ammoCanion = data[0];
      self.submarino.ammoTorpedos = data[1];
    });

    function iniciarPartida(){
      self.partida.codP = 1;
      self.partida.naves[0].posX = self.carguero1.posX;
      self.partida.naves[0].posY = self.carguero1.posY;
      self.partida.naves[1].posX = self.carguero2.posX;
      self.partida.naves[1].posY = self.carguero2.posY;
      self.partida.naves[2].posX = self.carguero3.posX;
      self.partida.naves[2].posY = self.carguero3.posY;
      self.partida.naves[3].posX = self.carguero4.posX;
      self.partida.naves[3].posY = self.carguero4.posY;
      self.partida.naves[4].posX = self.carguero5.posX;
      self.partida.naves[4].posY = self.carguero5.posY;
      self.partida.naves[5].posX = self.carguero6.posX;
      self.partida.naves[5].posY = self.carguero6.posY;
      self.partida.naves[6].posX = self.destructor.posX;
      self.partida.naves[6].posY = self.destructor.posY;
      self.partida.naves[7].posX = self.submarino.posX;
      self.partida.naves[7].posY = self.submarino.posY;
    }

    function guardarPartida(){
      self.partida.codP = 1;
      self.partida.naves[0].vida = self.carguero1.vida;
      self.partida.naves[0].posX = self.carguero1.imagen.x;
      self.partida.naves[0].posY = self.carguero1.imagen.y;
      self.partida.naves[1].vida = self.carguero2.vida;
      self.partida.naves[1].posX = self.carguero2.imagen.x;
      self.partida.naves[1].posY = self.carguero2.imagen.y;
      self.partida.naves[2].vida = self.carguero3.vida;
      self.partida.naves[2].posX = self.carguero3.imagen.x;
      self.partida.naves[2].posY = self.carguero3.imagen.y;
      self.partida.naves[3].vida = self.carguero4.vida;
      self.partida.naves[3].posX = self.carguero4.imagen.x;
      self.partida.naves[3].posY = self.carguero4.imagen.y;
      self.partida.naves[4].vida = self.carguero5.vida;
      self.partida.naves[4].posX = self.carguero5.imagen.x;
      self.partida.naves[4].posY = self.carguero5.imagen.y;
      self.partida.naves[5].vida = self.carguero6.vida;
      self.partida.naves[5].posX = self.carguero6.imagen.x;
      self.partida.naves[5].posY = self.carguero6.imagen.y;
      self.partida.naves[6].vida = self.destructor.vida;
      self.partida.naves[6].posX = self.destructor.imagen.x;
      self.partida.naves[6].posY = self.destructor.imagen.y;
      self.partida.naves[6].armas[0].municion = self.destructor.ammoCanion;
      self.partida.naves[6].armas[1].municion = self.destructor.ammoCargas;
      self.partida.naves[7].vida = self.submarino.vida;
      self.partida.naves[7].posX = self.submarino.imagen.x;
      self.partida.naves[7].posY = self.submarino.imagen.y;
      self.partida.naves[7].armas[0].municion = self.submarino.ammoCanion;
      self.partida.naves[7].armas[1].municion = self.submarino.ammoTorpedos;
    }
  }

  //Funci??n update, se refresca constantemente para ir dibujando los distintos cambios que sucedan en la escena, aqui se agrega todo lo que se desea que se actualice y refleje gr??ficamente
  update(time, delta) {
    if(this.equipo === 1){
      //Agregamos el movimiento de los barcos con las teclas W-A-S-D y ajustamos la velocidad de rotaci??n de giro del destructor
      if (this.destructor){
        if(this.left.isDown && (this.up.isDown || this.down.isDown) || this.UPDI==1 ){
          this.destructor.imagen.setAngularVelocity(-100)
        }
        else if (this.right.isDown && (this.up.isDown || this.down.isDown)){
          this.destructor.imagen.setAngularVelocity(100)
        }else{
          //Si no se esta apretando la tecla de arriba o abajo la velocidad de rotaci??n y de giro es 0
          this.destructor.imagen.setAngularVelocity(0) 
        }
       
        //Calculo y ajusto la velocidad de los barcos y el angulo de rotaci??n como una constante
        const VELX = Math.cos((this.destructor.imagen.angle - 360) * 0.01745)
        const VELY = Math.sin((this.destructor.imagen.angle - 360) * 0.01745)
        // Seteo la velocidad de movimiento
        if (this.up.isDown  || this.UP===1){
          this.destructor.imagen.setVelocityX(this.destructor.velocidad * VELX)
          this.destructor.imagen.setVelocityY(this.destructor.velocidad  * VELY)
        }
        else if (this.down.isDown){
          this.destructor.imagen.setVelocityX(-(this.destructor.velocidad/2) * VELX)
          this.destructor.imagen.setVelocityY(-(this.destructor.velocidad/2) * VELY)
        }else{
          //Ajusto todo en 0 porque no se esta moviendo
          this.destructor.imagen.setAcceleration(0)
          this.destructor.imagen.setVelocityX(0)
          this.destructor.imagen.setVelocityY(0)
        }
        
        let oldPosition = {}
        //Comparo la posici??n y rotaci??n actual del barco y en caso de que haya cambiado envio el evento "playerMovement" al socket para comunicar a todos los clientes
        var x = this.destructor.imagen.x;
        var y = this.destructor.imagen.y;
        var r = this.destructor.imagen.rotation;

        if (oldPosition && (x !== oldPosition.x || y !== oldPosition.y || r !== oldPosition.rotation)) {
          let data = {
            x: this.destructor.imagen.x,
            y: this.destructor.imagen.y,
            rotation: this.destructor.imagen.rotation
          }
          this.socket.emit('playerMovement', data);
        }
        //Guardo la posici??n actual del destructor para comparar con la nueva y chequear si hubo movimiento
        oldPosition = {
          x: this.destructor.posX,
          y: this.destructor.posX,
          rotation: this.destructor.rotacion
        }
      }

      //Agregamos el movimiento de los cargueros con las teclas direccionales y ajustamos la velocidad de rotaci??n de giro del barco
      if (this.carguero1 || this.carguero2 || this.carguero3 || this.carguero4 || this.carguero5 || this.carguero6 ){
        if (this.cursors.left.isDown && (this.cursors.up.isDown || this.cursors.down.isDown)){
          this.carguero1.imagen.setAngularVelocity(-100)
          this.carguero2.imagen.setAngularVelocity(-100)
          this.carguero3.imagen.setAngularVelocity(-100)
          this.carguero4.imagen.setAngularVelocity(-100)
          this.carguero5.imagen.setAngularVelocity(-100)
          this.carguero6.imagen.setAngularVelocity(-100)
        }
        else if (this.cursors.right.isDown && (this.cursors.up.isDown || this.cursors.down.isDown)){
          this.carguero1.imagen.setAngularVelocity(100)
          this.carguero2.imagen.setAngularVelocity(100)
          this.carguero3.imagen.setAngularVelocity(100)
          this.carguero4.imagen.setAngularVelocity(100)
          this.carguero5.imagen.setAngularVelocity(100)
          this.carguero6.imagen.setAngularVelocity(100)
        }else{
          //Si no se esta apretando la tecla de arriba o abajo la velocidad de rotaci??n y de giro es 0
          this.carguero1.imagen.setAngularVelocity(0) 
          this.carguero2.imagen.setAngularVelocity(0)
          this.carguero3.imagen.setAngularVelocity(0)
          this.carguero4.imagen.setAngularVelocity(0)
          this.carguero5.imagen.setAngularVelocity(0)
          this.carguero6.imagen.setAngularVelocity(0)
        }

        //Calculo y ajusto la velocidad de los barcos y el angulo de rotaci??n como una constante
        const VELCX = Math.cos((this.carguero1.imagen.angle - 360) * 0.01745)
        const VELCY = Math.sin((this.carguero1.imagen.angle - 360) * 0.01745)
        if (this.cursors.up.isDown){
          this.carguero1.imagen.setVelocityX(this.carguero1.velocidad * VELCX)
          this.carguero1.imagen.setVelocityY(this.carguero1.velocidad * VELCY)
          this.carguero2.imagen.setVelocityX(this.carguero2.velocidad * VELCX)
          this.carguero2.imagen.setVelocityY(this.carguero2.velocidad * VELCY)
          this.carguero3.imagen.setVelocityX(this.carguero3.velocidad * VELCX)
          this.carguero3.imagen.setVelocityY(this.carguero3.velocidad * VELCY)
          this.carguero4.imagen.setVelocityX(this.carguero4.velocidad * VELCX)
          this.carguero4.imagen.setVelocityY(this.carguero4.velocidad * VELCY)
          this.carguero5.imagen.setVelocityX(this.carguero5.velocidad * VELCX)
          this.carguero5.imagen.setVelocityY(this.carguero5.velocidad * VELCY)
          this.carguero6.imagen.setVelocityX(this.carguero6.velocidad * VELCX)
          this.carguero6.imagen.setVelocityY(this.carguero6.velocidad * VELCY)
        } 
        else if (this.cursors.down.isDown){
          this.carguero1.imagen.setVelocityX(-(this.carguero1.velocidad/2) * VELCX)
          this.carguero1.imagen.setVelocityY(-(this.carguero1.velocidad/2) * VELCY)
          this.carguero2.imagen.setVelocityX(-(this.carguero2.velocidad/2) * VELCX)
          this.carguero2.imagen.setVelocityY(-(this.carguero2.velocidad/2) * VELCY)
          this.carguero3.imagen.setVelocityX(-(this.carguero3.velocidad/2) * VELCX)
          this.carguero3.imagen.setVelocityY(-(this.carguero3.velocidad/2) * VELCY)
          this.carguero4.imagen.setVelocityX(-(this.carguero4.velocidad/2) * VELCX)
          this.carguero4.imagen.setVelocityY(-(this.carguero4.velocidad/2) * VELCY)
          this.carguero5.imagen.setVelocityX(-(this.carguero5.velocidad/2) * VELCX)
          this.carguero5.imagen.setVelocityY(-(this.carguero5.velocidad/2) * VELCY)
          this.carguero6.imagen.setVelocityX(-(this.carguero6.velocidad/2) * VELCX)
          this.carguero6.imagen.setVelocityY(-(this.carguero6.velocidad/2) * VELCY)
        }else{
          this.carguero1.imagen.setAcceleration(0)
          this.carguero2.imagen.setAcceleration(0)
          this.carguero3.imagen.setAcceleration(0)
          this.carguero4.imagen.setAcceleration(0)
          this.carguero5.imagen.setAcceleration(0)
          this.carguero6.imagen.setAcceleration(0)
        }
  
        //Genero actualizaci??n de movimiento para carguero 1
        let oldPosition1 = {}
        //Comparo la posici??n y rotaci??n actual de los cargueros y en caso de que haya cambiado envio el evento "carguerosMovement" al socket para comunicar a todos los clientes
        var x = this.carguero1.imagen.x;
        var y = this.carguero1.imagen.y;
        var r = this.carguero1.imagen.rotation;
        if (oldPosition1 && (x !== oldPosition1.x || y !== oldPosition1.y || r !== oldPosition1.rotation)) {
          let data = {
            x: this.carguero1.imagen.x,
            y: this.carguero1.imagen.y, 
            rotation: this.carguero1.imagen.rotation, 
            carguero: 1
          }
          this.socket.emit('carguerosMovement', data);
        }
        //Guardo la posici??n actual del barco para comparar con la nueva y chequear si hubo movimiento
        oldPosition1 = {
          x: this.carguero1.imagen.x,
          y: this.carguero1.imagen.y,
          rotation: this.carguero1.imagen.rotation
        }

        //Genero actualizaci??n de movimiento para carguero 2
        let oldPosition2 = {}
        //Comparo la posici??n y rotaci??n actual de los cargueros y en caso de que haya cambiado envio el evento "carguerosMovement" al socket para comunicar a todos los clientes
        var x = this.carguero2.imagen.x;
        var y = this.carguero2.imagen.y;
        var r = this.carguero2.imagen.rotation;
        if (oldPosition2 && (x !== oldPosition2.x || y !== oldPosition2.y || r !== oldPosition2.rotation)) {
          let data = {
            x: this.carguero2.imagen.x,
            y: this.carguero2.imagen.y, 
            rotation: this.carguero2.imagen.rotation,
            carguero: 2
          }
          this.socket.emit('carguerosMovement', data);
        }
        //Guardo la posici??n actual del barco para comparar con la nueva y chequear si hubo movimiento
        oldPosition2 = {
          x: this.carguero2.imagen.x,
          y: this.carguero2.imagen.y,
          rotation: this.carguero2.imagen.rotation
        }

        //Genero actualizaci??n de movimiento para carguero 3
        let oldPosition3 = {}
        //Comparo la posici??n y rotaci??n actual de los cargueros y en caso de que haya cambiado envio el evento "carguerosMovement" al socket para comunicar a todos los clientes
        var x = this.carguero3.imagen.x;
        var y = this.carguero3.imagen.y;
        var r = this.carguero3.imagen.rotation;
        if (oldPosition3 && (x !== oldPosition3.x || y !== oldPosition3.y || r !== oldPosition3.rotation)) {
          let data = {
            x: this.carguero3.imagen.x,
            y: this.carguero3.imagen.y, 
            rotation: this.carguero3.imagen.rotation,
            carguero: 3
          }
          this.socket.emit('carguerosMovement', data);
        }
        //Guardo la posici??n actual del barco para comparar con la nueva y chequear si hubo movimiento
        oldPosition3 = {
          x: this.carguero3.imagen.x,
          y: this.carguero3.imagen.y,
          rotation: this.carguero3.imagen.rotation
        }

        //Genero actualizaci??n de movimiento para carguero 4
        let oldPosition4 = {}
        //Comparo la posici??n y rotaci??n actual de los cargueros y en caso de que haya cambiado envio el evento "carguerosMovement" al socket para comunicar a todos los clientes
        var x = this.carguero4.imagen.x;
        var y = this.carguero4.imagen.y;
        var r = this.carguero4.imagen.rotation;
        if (oldPosition4 && (x !== oldPosition4.x || y !== oldPosition4.y || r !== oldPosition4.rotation)) {
          let data = {
            x: this.carguero4.imagen.x,
            y: this.carguero4.imagen.y, 
            rotation: this.carguero4.imagen.rotation,
            carguero: 4
          }
          this.socket.emit('carguerosMovement', data);
        }
        //Guardo la posici??n actual del barco para comparar con la nueva y chequear si hubo movimiento
        oldPosition4 = {
          x: this.carguero4.imagen.x,
          y: this.carguero4.imagen.y,
          rotation: this.carguero4.imagen.rotation
        }

        //Genero actualizaci??n de movimiento para carguero 5
        let oldPosition5 = {}
        //Comparo la posici??n y rotaci??n actual de los cargueros y en caso de que haya cambiado envio el evento "carguerosMovement" al socket para comunicar a todos los clientes
        var x = this.carguero5.imagen.x;
        var y = this.carguero5.imagen.y;
        var r = this.carguero5.imagen.rotation;
        if (oldPosition5 && (x !== oldPosition5.x || y !== oldPosition5.y || r !== oldPosition5.rotation)) {
          let data = {
            x: this.carguero5.imagen.x,
            y: this.carguero5.imagen.y, 
            rotation: this.carguero5.imagen.rotation,
            carguero: 5
          }
          this.socket.emit('carguerosMovement', data);
        }
        //Guardo la posici??n actual del barco para comparar con la nueva y chequear si hubo movimiento
        oldPosition5 = {
          x: this.carguero5.imagen.x,
          y: this.carguero5.imagen.y,
          rotation: this.carguero5.imagen.rotation
        }

        //Genero actualizaci??n de movimiento para carguero 6
        let oldPosition6 = {}
        //Comparo la posici??n y rotaci??n actual de los cargueros y en caso de que haya cambiado envio el evento "carguerosMovement" al socket para comunicar a todos los clientes
        var x = this.carguero6.imagen.x;
        var y = this.carguero6.imagen.y;
        var r = this.carguero6.imagen.rotation;
        if (oldPosition6 && (x !== oldPosition6.x || y !== oldPosition6.y || r !== oldPosition6.rotation)) {
          let data = {
            x: this.carguero6.imagen.x,
            y: this.carguero6.imagen.y, 
            rotation: this.carguero6.imagen.rotation,
            carguero: 6
          }
          this.socket.emit('carguerosMovement', data);
        }
        //Guardo la posici??n actual del barco para comparar con la nueva y chequear si hubo movimiento
        oldPosition6 = {
          x: this.carguero6.imagen.x,
          y: this.carguero6.imagen.y,
          rotation: this.carguero6.imagen.rotation
        }
      }
    }else{
      if (this.submarino){
        //Si no se esta usando largavista solo puede girar sobre su propio eje del largavista
        if(this.submarino.largavista === true){
          if(this.left.isDown){
            this.submarino.imagen.setAngularVelocity(0);
            this.submarino.imagen.rotation-=0.05;
            this.largaVistas.angle=this.submarino.imagen.angle+270;
          }else if(this.right.isDown){
            this.submarino.imagen.setAngularVelocity(0);
            this.submarino.imagen.rotation+=0.05;
            this.largaVistas.angle=this.submarino.imagen.angle-90;
          }
        }else{
          //Ajusto velocidad de rotaci??n y giro
          if (this.left.isDown && (this.up.isDown || this.down.isDown)) {
            this.submarino.imagen.setAngularVelocity(-100)
          } else if (this.right.isDown && (this.up.isDown || this.down.isDown)) {
            this.submarino.imagen.setAngularVelocity(100)
          } else {
            //Si no se esta apretando la tecla de arriba o abajo la velocidad de rotacion y de giro es 0
            this.submarino.imagen.setAngularVelocity(0) 
          }

          let oldPosition = {}
          //Calculo y ajusto la velocidad de los barcos y el angulo de rotaci??n como una constante
          const VELX = Math.cos((this.submarino.imagen.angle - 360) * 0.01745)
          const VELY = Math.sin((this.submarino.imagen.angle - 360) * 0.01745)
          //Ajusto velocidad de movimiento
          if (this.up.isDown || this.UP===1){
            this.submarino.imagen.setVelocityX(this.submarino.velocidad  * VELX)
            this.submarino.imagen.setVelocityY(this.submarino.velocidad * VELY)
          } 
          else if (this.down.isDown){
            this.submarino.imagen.setVelocityX(-(this.submarino.velocidad/2) * VELX)
            this.submarino.imagen.setVelocityY(-(this.submarino.velocidad/2) * VELY)
          }else{
            this.submarino.imagen.setAcceleration(0)
          }

          //Comparo la posici??n y rotaci??n actual del barco y en caso de que haya cambiado envio el evento "playerMovement" al socket para comunicar a todos los clientes
          var x = this.submarino.imagen.x;
          var y = this.submarino.imagen.y;
          var r = this.submarino.imagen.rotation;
          this.submarino.reticula.x = this.submarino.imagen.x + (Math.cos((this.submarino.imagen.angle - 360) * 0.01745) * this.distMax);
          this.submarino.reticula.y = this.submarino.imagen.y + (Math.sin((this.submarino.imagen.angle - 360) * 0.01745) * this.distMax);
          if (oldPosition && (x !== oldPosition.x || y !== oldPosition.y || r !== oldPosition.rotation)){
            let data = {
              x: this.submarino.imagen.x,
              y: this.submarino.imagen.y,
              rotation: this.submarino.imagen.rotation
            }
            this.socket.emit('playerMovement', data);
          }
          //Guardo la posici??n actual del submarino para comparar con la nueva y chequear si hubo movimiento
          oldPosition = {
            x: this.submarino.imagen.x,
            y: this.submarino.imagen.y,
            rotation: this.submarino.imagen.rotation
          }
        }
      }
    }
  }
}