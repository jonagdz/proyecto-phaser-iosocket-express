import { DEF } from "../def.js";
import { Bote } from '../logica/bote.js';
import { Bullets } from '../logica/bullet.js';
import { Carguero } from '../logica/carguero.js';
import { Submarino } from '../logica/submarino.js';
import { Destructor } from '../logica/destructor.js';

export class game extends Phaser.Scene{
  constructor(){
    super("game");
  }

  init(data){
    this.socket = data.socket;
    this.equipo = data.equipo;
    // Seteo las velocidades que se utilizaran en el juego
    this.velocidadMedia = 400; // Para testing puse 600, pero creo que deberia ser 160 la velocidad media para la jugabilidad real
    this.velocidadBaja = 300;
    this.destructor = new Destructor('Destructor',this.velocidadMedia,12,0,0,0,1,0,0,0,0,0,12, 30); // Creo el objeto destructor 
    this.submarino = new Submarino()
    this.submarino = new Submarino('Submarino',this.velocidadBaja,0,14,0,0,180,2,3,0,0,0,0, false, 16, 20); // Creo el objeto submarino 
    this.carguero1 = new Carguero('Carguero1',this.velocidadBaja,8,0,0,0,3); // Creo el objeto carguero1 
    this.carguero2 = new Carguero('Carguero2',this.velocidadBaja,8,0,0,0,4); // Creo el objeto carguero2
    this.carguero3 = new Carguero('Carguero3',this.velocidadBaja,8,0,0,0,5); // Creo el objeto carguero3
    this.carguero4 = new Carguero('Carguero4',this.velocidadBaja,8,0,0,0,6); // Creo el objeto carguero4
    this.carguero5 = new Carguero('Carguero5',this.velocidadBaja,8,0,0,0,7); // Creo el objeto carguero5
    this.carguero6 = new Carguero('Carguero6',this.velocidadBaja,8,0,0,0,8); // Creo el objeto carguero6
    this.largaVistas = {};
    this.mar;
    this.distMax = 300;
    this.statusSonar;
    this.Hit;
    this.Hit2;
    this.status;
    this.statusReset;
    this.statusEnvio;
    this.statusResetEnvio;
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

  // Creo todo el contenido del juego del juego, imagenes, los cursores, jugadores, barcos e implemento el WebSocket
  create(){
    // DEFINICIÓN DE VARIABLES, CONSTANTES Y OBJETOS VISULES EN EL MAPA A UTILIZAR -----------------------------------------------------------------------------------------------------------------------------------
    var self = this
    let bullet;
    let danio;
    let reticula;
    let cuentaSonar;
    let resetSonar;
    let contadorS=0;
    let usoSonar = false;
    let siguiendoDes = true;
    //self.socket.emit('listarPartidas', {id: 2});
    let carguerosMuertos = 0;

    // Grupo para los cargueros y balas
    var arrayCargueros = [];
    //this.grupoCargueros = this.physics.add.group({ classType: Carguero, runChildUpdate: true });
    this.playerBullets = this.physics.add.group({ classType: Bullets, runChildUpdate: true });

    // Cargo la imagen de fondo del mapa
    this.mar = this.add.image(0, 0, DEF.IMAGENES.FONDO).setOrigin(0).setScrollFactor(1).setDepth(0);
    const backgroundW = this.mar.width;
    const backgroundH = this.mar.height;
 
    // Defino los limites de las dimensiones del mapa para el posicionamiento inicial de los barcos
    var frameW = backgroundW;
    var frameH = backgroundH;
    var margenCostaX = 689;
    var margenCostaY = 300;

    // Defino variables para las posiciones X e Y de los barcos
    var posX;
    var posY;
    let distMaxima = 50;
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

    // Obtengo el centro del canvas para la máscara
    const centroW = this.sys.game.config.width / 2;
    const centroH = this.sys.game.config.height / 2;
    
    // Construyo la máscara de visión
    const maskImage = this.make.image({
      x: centroW,
      y: centroH,
      key: DEF.IMAGENES.MASCARA,
      add: false
    });
    const mask = maskImage.createBitmapMask();

    // Construyo el larga vista
    this.largaVistas = self.make.sprite({
      x: centroW,
      y: centroH,
      key: DEF.IMAGENES.LARGAVISTAS,
      add: false
    });
    this.largaVistas.setOrigin(0.5,0);
    this.mar.masklv = new Phaser.Display.Masks.BitmapMask(this, this.largaVistas);

    // Ajusto cámaras
    this.cameras.main.setMask(mask);
    this.physics.world.setBounds(0, 0, backgroundW, backgroundH);
  
    // Ajusto audio
    this.soundSonar = this.sound.add(DEF.AUDIO.SONAR);
    let soundBackground = this.sound.add(DEF.AUDIO.JUEGO,{loop: true});
    let audioActivado = true;
    //soundBackground.play();

    // Islas
    this.isla1 = self.physics.add.image(2100,900,DEF.IMAGENES.ISLA).setDepth(5);
    // this.isla1 = self.physics.add.image(2100,900,'island1').setDepth(1);
    this.isla1.setImmovable(true);
    this.isla1.setDisplaySize(400, 400);
    this.isla2 = self.physics.add.image(2460,1600,DEF.IMAGENES.ISLA).setDepth(5);
    //this.isla2 = self.physics.add.image(2460,1600,'island1').setDepth(1);
    this.isla2.setImmovable(true);
    this.isla2.setDisplaySize(400, 400);
    this.isla3 = self.physics.add.image(3200,600,DEF.IMAGENES.ISLA).setDepth(5);
    //this.isla3 = self.physics.add.image(3200,600,'island1').setDepth(1);
    this.isla3.setImmovable(true);
    this.isla3.setDisplaySize(400, 400);
    this.isla4 = self.physics.add.image(3400,1800,DEF.IMAGENES.ISLA).setDepth(5);
    //this.isla4 = self.physics.add.image(3400,1800,'island1').setDepth(1);
    this.isla4.setImmovable(true);
    this.isla4.setDisplaySize(400, 400);

    // Costas
    this.costa1 = self.physics.add.image(345,1078,DEF.IMAGENES.COSTA1).setDepth(5);
    //this.costa1 = self.physics.add.image(345,1078,'costa1').setDepth(1);;
    this.costa1.setImmovable(true);
    this.costa2 = self.physics.add.image(6066,1078,DEF.IMAGENES.COSTA2).setDepth(5);
    //this.costa2 = self.physics.add.image(6066,1078,'costa2').setDepth(1);;
    this.costa2.setImmovable(true);

    // Introduzco cursores y teclas utilizables
    this.cursors = this.input.keyboard.createCursorKeys();
    this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    // Se crea el evento de cambio de mute de audio
    self.input.keyboard.on('keydown-' + 'M', function (event){
      if(audioActivado === true){
        soundBackground.mute = true;
        audioActivado=false;
      }else{
        soundBackground.mute = false;
        audioActivado=true;
      }
    });

    // Se crea el evento de pausa
    self.input.keyboard.on('keydown-' + 'P', function (event){
      
    });

   // this.destroy.setInteractive().on('pointerover', () => ElegirDestroy(1));
   // this.destroy.setInteractive().on('pointerout', () => ElegirDestroy(2));
    
   //////////////////////////////////////////////////////////////////////
    // INICIO DE LA LÖGICA DEL COMPORTAMIENTO DEL JUEGO -----------------------------------------------------------------------------------------------------------------------------------

    // Segun el equipo del jugador actual, genero todos elementos del equipo correspondiente
    if(self.equipo === 1){ // Genero el equipo 1 que son el destructor y los cargueros, aunque tambien debo generar al submarino (Pero sin su camara ni colisiones) para ir actualizando su posicion en este cliente con el movimiento del otro jugador      
      generarEquipo1();
      this.botonCAMBIARARMA = self.physics.add.image(950, 800, DEF.IMAGENES.BOTONARMA).setOrigin(0).setScrollFactor(0).setDepth(10).setInteractive().on('pointerdown', () => ClickCAMBIARARMADESTRU(1)).setDisplaySize(80,80);

      this.botonCAMARA = self.physics.add.image(1050, 800, DEF.IMAGENES.BOTONLARGAVISTA).setOrigin(0).setScrollFactor(0).setDepth(10).setInteractive().on('pointerdown', () => ClickCamara(1)).setDisplaySize(80,80);
      
      this.botonHOME = self.physics.add.image(950, 50, DEF.IMAGENES.BOTONHOME).setOrigin(0).setScrollFactor(0).setDepth(10).setInteractive().on('pointerdown', () => ClickHOME(1)).setDisplaySize(80,80);
      
      this.botonSAVE = self.physics.add.image(1050, 50, DEF.IMAGENES.BOTONGUARDAR).setOrigin(0).setScrollFactor(0).setDepth(10).setInteractive().on('pointerdown', () => ClickSAVE(1)).setDisplaySize(80,80);

      self.input.on('pointerdown', function (pointer) {
          self.input.mouse.requestPointerLock();
        }, self);

      iniciarPartida();
      self.socket.emit('iniciarPartida', self.partida);
      //this.botonDOWNDI = self.physics.add.image(700, 900, DEF.IMAGENES.BOTONDOWNDI).setOrigin(0).setScrollFactor(0).setDepth(10).setInteractive().on('pointerdown', () => ClickDOWN(1));
      //this.botonDOWNDI.setInteractive().on('pointerout', () => ClickDOWN(2));
    }else{ // Genero el equipo 2 que es el submarino, aunque tambien debo generar la imagen del destructor y los cargueros para ir actualizandola con el movimiento del otro jugador      
      generarEquipo2();
      this.botonDOWNDI = self.physics.add.image(700, 800, DEF.IMAGENES.BOTONDOWNDI).setOrigin(0).setScrollFactor(0).setDepth(10).setInteractive().on('pointerdown', () => ClickDOWN(1)).setDisplaySize(80,80);

      this.botonSUBE = self.physics.add.image(800, 800, DEF.IMAGENES.BOTONSUBIR).setOrigin(0).setScrollFactor(0).setDepth(10).setInteractive().on('pointerdown', () => ClickSUBE(1)).setDisplaySize(80,80);
   

      this.botonSONAR = self.physics.add.image(900, 800, DEF.IMAGENES.BOTONSONAR).setOrigin(0).setScrollFactor(0).setDepth(10).setInteractive().on('pointerdown', () => ClickSONAR(1)).setDisplaySize(80,80);
    

      this.botonCAMBIARARMA = self.physics.add.image(1000, 800, DEF.IMAGENES.BOTONARMA).setOrigin(0).setScrollFactor(0).setDepth(10).setInteractive().on('pointerdown', () => ClickCAMBIARARMA(1)).setDisplaySize(80,80);
     

      this.botonLARGAVISTA = self.physics.add.image(1100, 800, DEF.IMAGENES.BOTONLARGAVISTA).setOrigin(0).setScrollFactor(0).setDepth(10).setInteractive().on('pointerdown', () => ClickLARGAVISTA(1)).setDisplaySize(80,80);
      
      this.botonHOME = self.physics.add.image(880, 200, DEF.IMAGENES.BOTONHOME).setOrigin(0).setScrollFactor(0).setDepth(10).setInteractive().on('pointerdown', () => ClickHOME(1)).setDisplaySize(80,80);
    
      this.botonSAVE = self.physics.add.image(980, 200, DEF.IMAGENES.BOTONGUARDAR).setOrigin(0).setScrollFactor(0).setDepth(10).setInteractive().on('pointerdown', () => ClickSAVE(1)).setDisplaySize(80,80);
    } 
    
    function ClickDOWN(val){
      if(val===1){
        console.log('baja');
        prof(1);
      } 
      else{
        prof(0);
      }
    }
    
    function ClickSUBE(val){
      if(val===1){
        console.log('sube');
        sube(1)
      } 
      else{
        sube(0)
      }
    }
    function ClickSONAR(val){
      if(val===1){
        console.log('sonar');
        sonar(1);
      } 
      else{
        sonar(0);
      }
    }

    function ClickCAMBIARARMA(val){
      if(val===1){
        console.log('armacambio');
        cambiarArma(1);

      } 
      else{
       cambiarArma(0);
      }
    }

    function ClickCAMBIARARMADESTRU(VV){
      if(VV===1){
        console.log('armacambio');
        CAMBIARARMADESTRU(1);

      } 
      else{
       CAMBIARARMADESTRU(0);
      }
    }
    function ClickLARGAVISTA(val){
      if(val===1){
        console.log('larga viista');
        largavista(1);

      } 
      else{
        largavista(0);
      }
    }

    function ClickCamara(valu){
     
      if(valu===1){
        console.log('larga viista');
        CAMARADESTRUCARG(1);

      } 
      else{
        CAMARADESTRUCARG(0);
      }
    }
    
    function ClickHOME (v) {
      if(v===1){
        self.socket.disconnect();
        console.log("Vuelve a inicio");
        self.scene.start(DEF.SCENES.MENUPRINCIPAL);
      }
    }
    
    function ClickSAVE(vv){
      if(vv===1){
        console.log("guardar");
      }
    }
    function generarEquipo1(){     
      // Genero los objetos cargueros, con sus imagenes, colisiones, etc
      generarCargueros();

      // Genero la imagen del destructor, colisiones, particulas, etc
      generarDestructor();

      // Genero la imagen del submarino enemigo
      generarSubmarinoEnemigo();
    }

    function generarEquipo2(){
      // Genero la imagen del submarino, colisiones, particulas, etc
      generarSubmarino();

      // Genero la imagen del destructor enemigo
      generarDestructorEnemigo();

      // Genero las imagenes de los cargueros enemigos
      generarCarguerosEnemigos();
    }

    // Generar destructor
    function generarDestructor(){
      // Genero las posiciones X e Y para el destructor, iniciara el juego aleatoriamente arriba, abajo o adelante del grupo de cargueros.
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

      // Generamos la imagen del destructor al objeto destructor y sus propiedades (Tamaño, rotacion, profundidad y que sea empujable)
      self.destructor.imagen = self.physics.add.image(self.destructor.posX, self.destructor.posY, DEF.IMAGENES.DESTRUCTOR).setDisplaySize(200, 100).setRotation(0).setDepth(5).setPushable(false);
      self.destructor.imagen.setCollideWorldBounds(true) // Colisiones con el fin del mapa
      self.destructor.imagen.setDrag(1000) // Es la velocidad de desaceleracion con el tiempo cuando se deja de mover un jugador

      //guardo la reticula y el set de balas en variables propias de la clase destructor
      self.destructor.reticula = self.physics.add.sprite(self.destructor.posX, self.destructor.posY, DEF.SPRITES.RETICULA).setCollideWorldBounds(true);
      self.destructor.bullet = self.playerBullets;
      self.destructor.cargas = 1;
      // Particulas
      const particles = self.add.particles(DEF.IMAGENES.PARTICULAS).setDepth(2) // Imagen Blue como particula
      const emitter = particles.createEmitter({ // Funcion emitter de phaser para emitir varias particulas
        speed: 10, // Velocidad con la que se mueven
        scale: {start: 0.08, end: 0}, // Tamaño
        blendMode: "ADD" // Efecto a aplicar
      })
      particles.setPosition(self.destructor.imagen.x, self.destructor.imagen.y)
      emitter.startFollow(self.destructor.imagen) // Le indicamos que sigan al destructor
      
      // Se indica que la camara siga al destructor
      self.cameras.main.startFollow(self.destructor.imagen,true, 0.09, 0.09); 
      self.siguiendoDes = true;

      // Zoom de la cámara
      self.cameras.main.setZoom(0.9);
      // Se crea una colision del destructor con las islas
      self.physics.add.collider(self.destructor.imagen, self.isla1); 
      self.physics.add.collider(self.destructor.imagen, self.isla2); 
      self.physics.add.collider(self.destructor.imagen, self.isla3); 
      self.physics.add.collider(self.destructor.imagen, self.isla4); 
      // Se crea una colision del destructor con la bomba
      self.physics.add.collider(self.destructor.imagen, self.bomb);
      // Se crea una colision del destructor con los cargueros
      self.physics.add.collider(self.destructor.imagen, self.carguero1.imagen);
      self.physics.add.collider(self.destructor.imagen, self.carguero2.imagen);
      self.physics.add.collider(self.destructor.imagen, self.carguero3.imagen);
      self.physics.add.collider(self.destructor.imagen, self.carguero4.imagen);
      self.physics.add.collider(self.destructor.imagen, self.carguero5.imagen);
      self.physics.add.collider(self.destructor.imagen, self.carguero6.imagen);
      // Se crea una colision del barco con las costas
      self.physics.add.collider(self.destructor.imagen, self.costa1);
      self.physics.add.collider(self.destructor.imagen, self.costa2);
      // Se crea colision con el submarino
      self.colliderSub = self.physics.add.collider(self.destructor.imagen, self.submarino.imagen);

      // Se crea el evento de cambio de armas para el destructor, 0 es para canion, 1 para cargas de profundidad
      self.input.keyboard.on('keydown-' + 'Z', function (event){
        if (self.destructor.armas == 0){
          self.destructor.armas = 1;
          console.log('Cambio a Cargas de Profundidad');
        }else{
          self.destructor.armas = 0;
          console.log('cambio a canon');
        }
      });
      
      // Se crea el evento de cambio cámaras entre destructor y cargueros
      self.input.keyboard.on('keydown-' + 'C', function (event){
        if(self.siguiendoDes === true){
          self.cameras.main.startFollow(self.carguero1.imagen,true, 0.09, 0.09); 
          self.cameras.main.setZoom(1.4);
          self.siguiendoDes = false;
        }else{
          self.cameras.main.startFollow(self.destructor.imagen,true, 0.09, 0.09); 
          self.cameras.main.setZoom(0.9);
          self.siguiendoDes = true;
        }
      });

      // Funcion que al precionar la tecla V, cambia la profundidad de las cargas de profundidad del destructor
      self.input.keyboard.on('keydown-' + 'V', function (event){
        if(self.destructor.cargas === 1){
          self.destructor.cargas = 2;
          console.log('detonador para mucha profundidad');
        }else{
          self.destructor.cargas = 1;
          console.log('detonador para poca profundidad');
        }
      });
    }

    // Generar destructor
    function generarDestructorEnemigo(){
      // Generamos la imagen del destructor al objeto destructor y sus propiedades (Tamaño, rotacion, profundidad y que sea empujable)
      self.destructor.imagen = self.physics.add.image(0,0, DEF.IMAGENES.DESTRUCTOR).setDisplaySize(200, 100).setRotation(0).setDepth(5).setPushable(false);
    
      // Particulas
      const particles = self.add.particles(DEF.IMAGENES.PARTICULAS).setDepth(2) // Imagen Blue como particula
      const emitter = particles.createEmitter({ // Funcion emitter de phaser para emitir varias particulas
        speed: 10, // Velocidad con la que se mueven
        scale: {start: 0.08, end: 0}, // Tamaño
        blendMode: "ADD" // Efecto a aplicar
      })
      particles.setPosition(0,-1)
      emitter.startFollow(self.destructor.imagen) // Le indicamos que sigan al destructor
      
      self.colliderSub = self.physics.add.collider(self.submarino.imagen, self.destructor.imagen);
      self.colliderCarg1 = self.physics.add.collider(self.submarino.imagen, self.carguero1.imagen);
      self.colliderCarg2 = self.physics.add.collider(self.submarino.imagen, self.carguero2.imagen);
      self.colliderCarg3 = self.physics.add.collider(self.submarino.imagen, self.carguero3.imagen);
      self.colliderCarg4 = self.physics.add.collider(self.submarino.imagen, self.carguero4.imagen);
      self.colliderCarg5 = self.physics.add.collider(self.submarino.imagen, self.carguero5.imagen);
      self.colliderCarg6 = self.physics.add.collider(self.submarino.imagen, self.carguero6.imagen);
    }

    // Genero todo lo relacionado a la imagen del submarino del jugador actual y sus propiedades (Posicion X e Y, tamaño, profundidad y que sea empujable)
    function generarSubmarino(){
      // Genero las posiciones X e Y para el submarino
      posX = Math.floor((Math.random()*((frameW-800)-(frameW*0.75)))+(frameW*0.75)), // El margen x para generarse el submarino sera desde el 70% del mapa hasta el final - 800 del lado derecho
      posY = Math.floor((Math.random()*((frameH-300)- margenCostaY))+margenCostaY), // El margen y para generarse el submarino es el mismo que los demas barcos (total - 300)
      
      // Actualizo la posicion del objeto submarino creado previamente
      self.submarino.posX = posX;
      self.submarino.posY = posY;

      self.submarino.imagen = self.physics.add.image(self.submarino.posX, self.submarino.posY, DEF.IMAGENES.UBOATP0).setDisplaySize(100,50).setDepth(5).setPushable(false);

      self.submarino.imagen.setCollideWorldBounds(true) // Colisiones con el fin del mapa
      self.submarino.imagen.setDrag(1000) // Es la velocidad de desaceleracion con el tiempo cuando se deja de mover un jugador

      //guardo la reticula y el set de balas en variables propias de la clase submarino
      self.submarino.bullet = self.playerBullets;
      //self.submarino.reticula = self.physics.add.sprite(self.submarino.posX, self.submarino.posY, 'crosshair').setCollideWorldBounds(true);
      self.submarino.reticula = self.physics.add.sprite(self.submarino.posX, self.submarino.posY, DEF.SPRITES.RETICULA).setCollideWorldBounds(true);
      self.submarino.reticula.setDrag(1000)
      self.submarino.reticula.x += 300;
      //self.submarino.reticula.y += pointer.movementY;
      // Particulas
     // const particles = self.add.particles("Blue").setDepth(2)
      const particles = self.add.particles(DEF.IMAGENES.PARTICULAS).setDepth(2) // Imagen Blue como particula
      const emitter = particles.createEmitter({ // Funcion emitter de phaser para emitir varias particulas
        speed: 10, // Velocidad con la que se mueven
        scale: {start: 0.08, end: 0}, // Tamaño
        blendMode: "ADD" // Efecto a aplicar
      })
      particles.setPosition(self.submarino.imagen.x, self.submarino.imagen.y)
      emitter.startFollow(self.submarino.imagen) // Le indicamos que sigan al objeto barco.

      // Se indica que la camara siga al componente barco
      self.cameras.main.startFollow(self.submarino.imagen,true, 0.09, 0.09); 
      // Zoom de la cámara
      self.cameras.main.setZoom(1.4);
      
      // Se crea una colision del barco con la isla
      self.physics.add.collider(self.submarino.imagen, self.isla1); 
      self.physics.add.collider(self.submarino.imagen, self.isla2); 
      self.physics.add.collider(self.submarino.imagen, self.isla3); 
      self.physics.add.collider(self.submarino.imagen, self.isla4); 
      // Se crea una colision del barco con la bomba
      self.physics.add.collider(self.submarino.imagen, self.bomb);
      // Se crea una colision del barco con los cargueros
      //self.physics.add.collider(self.submarino.imagen, self.grupoCargueros);
      //self.physics.add.collider(self.submarino.imagen, self.carguero1.imagen);
      // Se crea una colision del barco con la costa1
      self.physics.add.collider(self.submarino.imagen, self.costa1);
      // Se crea una colision del barco con la costa2
      self.physics.add.collider(self.submarino.imagen, self.costa2);
      // Si el submarino se encuentra en la superficie, que colisione con el destructor
      self.colliderSub = self.physics.add.collider(self.submarino.imagen, self.destructor.imagen);
      self.colliderCarg1 = self.physics.add.collider(self.submarino.imagen, self.carguero1.imagen);
      self.colliderCarg2 = self.physics.add.collider(self.submarino.imagen, self.carguero2.imagen);
      self.colliderCarg3 = self.physics.add.collider(self.submarino.imagen, self.carguero3.imagen);
      self.colliderCarg4 = self.physics.add.collider(self.submarino.imagen, self.carguero4.imagen);
      self.colliderCarg5 = self.physics.add.collider(self.submarino.imagen, self.carguero5.imagen);
      self.colliderCarg6 = self.physics.add.collider(self.submarino.imagen, self.carguero6.imagen);
 
      // Se crea el evento de cambio de armas
      self.input.keyboard.on('keydown-' + 'Z', function (event){
        //si esta en superficie, que cambie de armas tranquilamente
        if(self.submarino.profundidad === 0){
          if (self.submarino.armas === 0){
            self.submarino.armas = 1;
            console.log('Cambio a Torpedos');
          }else{
            self.submarino.armas = 0;
            console.log('cambio a canon');
          }
        }else if(self.submarino.profundidad === 1){
          //si esta a profundidad 1 que solo pueda usar el arma 1, torpedos
            self.submarino.armas = 4;
            console.log('Solo Torpedos a esta profundidad');  
        }else if(self.submarino.profundidad === 2){
          //si esta en profundidad 2 que no pueda disparar
          self.submarino.armas = -1;
        }
        if(self.submarino.armas === 0){
          self.distMax = 300;
        }else if(self.submarino.armas === 1 || self.submarino.armas === 4){
          self.distMax = 500;
        }   
        self.submarino.reticula.x = self.submarino.imagen.x + (Math.cos((self.submarino.imagen.angle - 360) * 0.01745) * self.distMax);
        self.submarino.reticula.y = self.submarino.imagen.y + (Math.sin((self.submarino.imagen.angle - 360) * 0.01745) * self.distMax);
      });

      // Se crea el evento de cambio de largavistas
      self.input.keyboard.on('keydown-' + 'L', function (event){
        console.log("entro al larga vista");
        if(self.submarino.largavista === false && (self.submarino.profundidad === 0)){
          self.submarino.largavista = true;
          self.largaVistas.angle=self.submarino.imagen.angle+270;
          self.cameras.main.setMask(self.mar.masklv);
          self.cameras.main.setZoom(0.9);
        }else if(self.submarino.largavista === true && (self.submarino.profundidad === 0)){
          self.submarino.largavista = false;
          self.cameras.main.setMask(self.mask);
          self.cameras.main.setZoom(1.4);
        }
      });
      // Se crea el evento de activar sonar
      self.input.keyboard.on('keydown-' + 'F', function (event){
        // Activo sonar si hay sonares disponibles
        if(self.submarino.sonar>0){
          if (self.usoSonar !== true){
            // Texto de aviso
            self.statusSonar = self.add.text(350, 270, '', { font: '50px Courier', fill: '#000000' }).setScrollFactor(0);
            
            self.usoSonar = true;

            // Activo sonido de sonar
            self.soundSonar.play();

            // Cambio de cámaras
            self.cameras.main.setMask(self.mask);
            self.cameras.main.setZoom(0.9);
            
            // Activo cuenta regresiva
            self.cuentaSonar = self.time.addEvent({ delay: 1000, callback: actualizarContSonar, callbackScope: self, loop: true});
            
            // Vuelvo a vista normal y elimino aviso
            self.resetSonar = self.time.addEvent({ delay: 10000, callback: camaraSonar, callbackScope: self, repeat: 0 });
            
            function camaraSonar(){
              // Restablezco las cámaras
              self.cameras.main.setMask(self.mask);
              self.cameras.main.setZoom(1.4);
              self.usoSonar = false;
              console.log("USO SONAR:"+self.usoSonar);
              // Elimino texto de tiempo restante
              removeText();
              self.soundSonar.stop();
              contadorS=0;
            }
            function actualizarContSonar(){
              contadorS++;
              self.statusSonar.setText('SONAR ACTIVADO - TIEMPO RESTANTE:'+(10-contadorS) + '\nSONARES RESTANTES: '+(self.submarino.sonar));
              if (contadorS === 10){
                self.cuentaSonar.remove(true);
              }
            }
            function removeText() {
              self.statusSonar.destroy();
            }
            self.submarino.sonar--;
          }
        }else{
          if (self.usoSonar !== true){
            // Texto de aviso
            self.statusSonar = self.add.text(350, 270, '', { font: '50px Courier', fill: '#000000' }).setScrollFactor(0);

            self.cuentaSonar = self.time.addEvent({ delay: 1000, callback: avisoNoHaySonar, callbackScope: self, loop: true});
            self.resetSonar = self.time.addEvent({ delay: 5000, callback: eliminoAvisoNHS, callbackScope: self, repeat: 0 });
            
            function eliminoAvisoNHS(){
              // Elimino texto de aviso no hay sonar
              removeText();
              contadorS=0;
            }
            function avisoNoHaySonar(){
              contadorS++;
              self.statusSonar.setText('¡SONAR AGOTADO!');
              if (contadorS === 5){
                self.cuentaSonar.remove(true);
              }
            }
            function removeText() {
              self.statusSonar.destroy();
            }
          }
        }
      });
      // funcion que al presionar la tecla Q, el submarino baja, si bajas a nivel 1 podes disparar solo torpedos, en nivel 2 nada
      self.input.keyboard.on('keydown-' + 'Q', function (event){
          // Pase de nivel 0 a 1, seteo armas en 4 (que es exclusivamente torpedos) y emito al socket para que el otro jugador
          // vea mi cambio de profundidad
          if (self.submarino.profundidad === 0 ){
            // VERVER - Setear velocidad del submarino cuando se sumerge y emerge
            self.submarino.profundidad = 1;
            //self.submarino.imagen.setTexture('UbootProfundidad1');
            self.submarino.imagen.setTexture(DEF.IMAGENES.UBOATP1);
            self.submarino.armas = 4;
            console.log('baje a poca profundidad');
            self.socket.emit('playerProf', {Pr: self.submarino.profundidad});
            // Cambio de cámara
            if (self.lvactivado === true){
              self.cameras.main.setMask(self.mask);
              self.cameras.main.setZoom(1.4);
            }
          }else if (self.submarino.profundidad === 1){
            // Pase de nivel 0 a 1, seteo armas en -1 (sin armas) y emito al socket para que el otro jugador
            // vea mi cambio de profundidad
            self.submarino.profundidad = 2;
            self.submarino.armas = -1;
            //self.submarino.imagen.setTexture('UbootProfundidad2');
            self.submarino.imagen.setTexture(DEF.IMAGENES.UBOATP2);
            console.log('baje al mucha profundidad');
            self.socket.emit('playerProf', {Pr: self.submarino.profundidad});
          }
          self.physics.world.removeCollider(self.colliderSub); 
          self.physics.world.removeCollider(self.colliderCarg1);
          self.physics.world.removeCollider(self.colliderCarg2);
          self.physics.world.removeCollider(self.colliderCarg3);
          self.physics.world.removeCollider(self.colliderCarg4);
          self.physics.world.removeCollider(self.colliderCarg5);
          self.physics.world.removeCollider(self.colliderCarg6); 
        
          // Seteo la velocidad del submarino dependiendo a la profundidad en que se encuentre
          if (self.submarino.profundidad === 0){
            // Si me encuentro en la superficie la velocidad va a ser lenta
            self.submarino.velocidad = self.velocidadMedia; 
          }else if(self.submarino.profundidad === 1){
            // Si me encuentro a baja profundidad la velocidad va a ser media
            self.submarino.velocidad = self.velocidadMedia; 
          }else if(self.submarino.profundidad === 2){
            // Si me encuentro a mucha profundidad la velocidad va a ser lenta
            self.submarino.velocidad = self.velocidadBaja; 
          }
      });

      //funcion que al precionar la tecla E, el submarino sube
      self.input.keyboard.on('keydown-' + 'E', function (event){
        // Idem anteriores pero subiendo de 1 a 0
        if (self.submarino.profundidad == 1){
          self.submarino.profundidad = 0;
          self.submarino.armas = 0;
          console.log('subi a la superficie');
          //self.submarino.imagen.setTexture('uboot');
          self.submarino.imagen.setTexture(DEF.IMAGENES.UBOATP0);
          self.socket.emit('playerProf', {Pr: self.submarino.profundidad});
        } else if (self.submarino.profundidad == 2){
          // Idem anteriores pero subiendo de 0 a 1
          self.submarino.profundidad = 1;
          self.submarino.armas = 4;
          //self.submarino.imagen.setTexture('UbootProfundidad1');
          self.submarino.imagen.setTexture(DEF.IMAGENES.UBOATP1);
          console.log('subi a poca profundidad');
          self.socket.emit('playerProf', {Pr: self.submarino.profundidad});
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

        // Seteo la velocidad del submarino dependiendo a la profundidad en que se encuentre
        if (self.submarino.profundidad == 0){
          // Si me encuentro en la superficie la velocidad va a ser lenta
          self.submarino.velocidad = self.velocidadBaja; 
        }else if(self.submarino.profundidad == 1){
          // Si me encuentro a baja profundidad la velocidad va a ser media
          self.submarino.velocidad = self.velocidadMedia; 
        }else if(self.submarino.profundidad == 2){
        // Si me encuentro a mucha profundidad la velocidad va a ser lenta
          self.submarino.velocidad = self.velocidadBaja; 
        }
      });
    }
    
    // Genero todo lo relacionado a la imagen del submarino del equipo enemigo y sus propiedades (Tamaño, profundidad y que sea empujable)
    function generarSubmarinoEnemigo(){
      //self.submarino.imagen = self.physics.add.image(0,0, 'uboot')
      self.submarino.imagen = self.physics.add.image(0,0, DEF.IMAGENES.UBOATP0).setDisplaySize(100,50).setDepth(5).setPushable(false)
      posX = Math.floor((Math.random()*((frameW-800)-(frameW*0.75)))+(frameW*0.75)), // El margen x para generarse el submarino sera desde el 70% del mapa hasta el final - 800 del lado derecho
      posY = Math.floor((Math.random()*((frameH-300)- margenCostaY))+margenCostaY), // El margen y para generarse el submarino es el mismo que los demas barcos (total - 300)
      self.submarino.posX = posX;
      self.submarino.posY = posY;
      // Particulas
      //const particles = self.add.particles("Blue").setDepth(2)
      const particles = self.add.particles(DEF.IMAGENES.PARTICULAS).setDepth(2) // Imagen Blue como particula
      const emitter = particles.createEmitter({ // Funcion emitter de phaser para emitir varias particulas
        speed: 10, // Velocidad con la que se mueven
        scale: {start: 0.08, end: 0}, // Tamaño
        blendMode: "ADD" // Efecto a aplicar
      })
      particles.setPosition(0, -11);

      self.colliderSub = self.physics.add.collider(self.destructor.imagen, self.submarino.imagen);
    }

    // Funcion para generarle las imagenes y las particulas a cada barco
    function generarCargueros(){
      // Genero las posiciones X e Y para el primer carguero principal
      posX = Math.floor((Math.random()*((frameW*0.2)- margenCostaX))+margenCostaX); // El margen x para generarse los cargueros sera desde la costa (689) hasta el 20% del total del mapa
      posY = Math.floor((Math.random()*((frameH-400)- margenCostaY))+margenCostaY); // El margen y para generarse los cargueros sera el (total - 400) de la parte de arriba y de abajo del mapa    

      // Actualizo la posicion x e de todos los cargueros en base a la posicion inicial del carguero principal
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

      // Inserto los objetos cargueros en un array de cargueros para poder crear sus imagenes en un for
      arrayCargueros[0] = self.carguero1;
      arrayCargueros[1] = self.carguero2;
      arrayCargueros[2] = self.carguero3;
      arrayCargueros[3] = self.carguero4;
      arrayCargueros[4] = self.carguero5;
      arrayCargueros[5] = self.carguero6;

      // Genero las imagenes de los cargueros, colisiones, particulas, etc
      arrayCargueros.forEach(function(carguero){
        //carguero.imagen = self.physics.add.image(carguero.posX, carguero.posY, 'carguero').setDisplaySize(200, 75).setDepth(5) // Seteo tamaño y profundidad de la imagen
        carguero.imagen = self.physics.add.image(carguero.posX, carguero.posY, DEF.IMAGENES.CARGUERO).setDisplaySize(200, 75).setDepth(5).setPushable(false);
        // Particulas
        //const particles = self.add.particles("Blue").setDepth(2)
        const particles = self.add.particles(DEF.IMAGENES.PARTICULAS).setDepth(1) // Imagen Blue como particula
        const emitter = particles.createEmitter({ // Funcion emitter de phaser para emitir varias particulas
          speed: 10, // Velocidad con la que se mueven
          scale: {start: 0.08, end: 0}, // Tamaño
          blendMode: "ADD" // Efecto a aplicar
        })
        particles.setPosition(0, -11)
        emitter.startFollow(carguero.imagen) // Le indicamos que sigan al destructor

        // Lo vuelvo inamovible
        //carguero.imagen.setImmovable(true);
        carguero.imagen.setCollideWorldBounds(true); // Colisiones con el fin del mapa
        // Se crea una colision de los cargueros con la lisa isla
        self.physics.add.collider(carguero.imagen, self.isla1, handleCollisionCargo, collisionCargoIsland, self); 
        self.physics.add.collider(carguero.imagen, self.isla2, handleCollisionCargo, collisionCargoIsland, self); 
        self.physics.add.collider(carguero.imagen, self.isla3, handleCollisionCargo, collisionCargoIsland, self); 
        self.physics.add.collider(carguero.imagen, self.isla4, handleCollisionCargo, collisionCargoIsland, self); 
        // Se crea una colision del carguero con la bomba
        self.physics.add.collider(carguero.imagen, self.bomb);
        // Se crea una colision del carguero con la costa1
        self.physics.add.collider(self.carguero1.imagen, self.costa1);
        // Se crea una colision del carguero con la costa2
        
        self.physics.add.collider(carguero.imagen, self.costa2, handleCollisionCosta, colisionCargoCosta2, self);
        
        // Se crea la colision con el submarino y el destructor
        self.physics.add.collider(self.carguero1.imagen, self.destructor.imagen);
        self.physics.add.collider(self.carguero1.imagen, self.submarino.imagen);
      })
    };

    // Funcion para generarle las imagenes y las particulas a cada carguero estando en el equipo del submarino
    function generarCarguerosEnemigos(){
      // Particulas
      const particles = self.add.particles(DEF.IMAGENES.PARTICULAS).setDepth(5) // Imagen Blue como particula
      const emitter = particles.createEmitter({ // Funcion emitter de phaser para emitir varias particulas
        speed: 10, // Velocidad con la que se mueven
        scale: {start: 0.08, end: 0}, // Tamaño
        blendMode: "ADD" // Efecto a aplicar
      })
      particles.setPosition(0, -11)
      emitter.startFollow( self.carguero1.imagen);
      emitter.startFollow( self.carguero2.imagen);
      emitter.startFollow( self.carguero3.imagen);
      emitter.startFollow( self.carguero4.imagen);
      emitter.startFollow( self.carguero5.imagen);
      emitter.startFollow( self.carguero6.imagen);

      self.carguero1.imagen = self.physics.add.image(self.carguero1.posX, self.carguero1.posY, DEF.IMAGENES.CARGUERO).setDisplaySize(200, 75).setDepth(5).setPushable(false);
      self.carguero2.imagen = self.physics.add.image(self.carguero2.posX, self.carguero2.posY, DEF.IMAGENES.CARGUERO).setDisplaySize(200, 75).setDepth(5).setPushable(false);
      self.carguero3.imagen = self.physics.add.image(self.carguero3.posX, self.carguero3.posY, DEF.IMAGENES.CARGUERO).setDisplaySize(200, 75).setDepth(5).setPushable(false);
      self.carguero4.imagen = self.physics.add.image(self.carguero4.posX, self.carguero4.posY, DEF.IMAGENES.CARGUERO).setDisplaySize(200, 75).setDepth(5).setPushable(false);
      self.carguero5.imagen = self.physics.add.image(self.carguero5.posX, self.carguero5.posY, DEF.IMAGENES.CARGUERO).setDisplaySize(200, 75).setDepth(5).setPushable(false);
      self.carguero6.imagen = self.physics.add.image(self.carguero6.posX, self.carguero6.posY, DEF.IMAGENES.CARGUERO).setDisplaySize(200, 75).setDepth(5).setPushable(false);
      
      // Colisiones cargueros con el submarino
      self.colliderCarg1 = self.physics.add.collider(self.submarino.imagen, self.carguero1.imagen);
      self.colliderCarg2 = self.physics.add.collider(self.submarino.imagen, self.carguero2.imagen);
      self.colliderCarg3 = self.physics.add.collider(self.submarino.imagen, self.carguero3.imagen);
      self.colliderCarg4 = self.physics.add.collider(self.submarino.imagen, self.carguero4.imagen);
      self.colliderCarg5 = self.physics.add.collider(self.submarino.imagen, self.carguero5.imagen);
      self.colliderCarg6 = self.physics.add.collider(self.submarino.imagen, self.carguero6.imagen);
    };

    function collisionCargoIsland(carguero, isla)
    {
      return true;
    }

    //Funcion que maneja la colision entre el carguero y la isla
    function handleCollisionCargo(carguero, isla)
    {
      if (carguero.body.touching.right) //Cuando la el carguero colisiona de "frente" gira 90 grados hacia abajo, espera 2 segundos y continua con su marcha.
      {
        carguero.angle = carguero.angle + 90;
        const velCY = Math.sin((carguero.angle - 360) * 0.01745)
        carguero.setVelocityY(self.velocidadBaja * velCY)
        setTimeout(() => {
          carguero.angle = carguero.angle - 90;
          contMarcha(carguero);
        }, 2000)
      }
      
    }
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
      console.log("cargueros A SALVO", carguerosAsalvo);
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
        self.socket.emit('Finalizo', envioSocket);
        self.scene.start(DEF.SCENES.FinScene, envio);
      }
    }
    function cargueroSalvado(carguero){
      if (carguero.vida > 0)
        carguerosAsalvo++;
        carguero.vida = 0;
    }
    
    function colisionCargoCosta2(carguero, costa2)
    {
      return true;
    }

    function contMarcha(carguero)
    {
      const velCX = Math.cos((carguero.angle - 360) * 0.01745)
      const velCY = Math.sin((carguero.angle - 360) * 0.01745)
      carguero.setVelocityX(self.velocidadBaja * velCX)
      carguero.setVelocityY(self.velocidadBaja * velCY)
    } 
   
    // SETEOS DE PROFUNDIDAD: 
    function prof(v){
        if(v===1){
          if(self.equipo === 2){
            // Pase de nivel 0 a 1, seteo armas en 4 (que es exclusivamente torpedos) y emito al socket para que el otro jugador
            // vea mi cambio de profundidad
            if (self.submarino.profundidad === 0 ){
              // VERVER - Setear velocidad del submarino cuando se sumerge y emerge
              self.submarino.profundidad = 1;
              //self.submarino.imagen.setTexture('UbootProfundidad1');
              self.submarino.imagen.setTexture(DEF.IMAGENES.UBOATP1);
              self.submarino.armas = 4;
              console.log('baje a poca profundidad');
              self.socket.emit('playerProf', {Pr: self.submarino.profundidad});
              // Cambio de cámara
              if (self.lvactivado === true){
                self.cameras.main.setMask(self.mask);
                self.cameras.main.setZoom(1.4);
              }
            }else if (self.submarino.profundidad === 1){
              // Pase de nivel 0 a 1, seteo armas en -1 (sin armas) y emito al socket para que el otro jugador
              // vea mi cambio de profundidad
              self.submarino.profundidad = 2;
              self.submarino.armas = -1;
              //self.submarino.imagen.setTexture('UbootProfundidad2');
              self.submarino.imagen.setTexture(DEF.IMAGENES.UBOATP2);
              console.log('baje al mucha profundidad');
              self.socket.emit('playerProf', {Pr: self.submarino.profundidad});
            }
            self.physics.world.removeCollider(self.colliderSub);
            self.physics.world.removeCollider(self.colliderCarg1);
            self.physics.world.removeCollider(self.colliderCarg2);
            self.physics.world.removeCollider(self.colliderCarg3);
            self.physics.world.removeCollider(self.colliderCarg4);
            self.physics.world.removeCollider(self.colliderCarg5);
            self.physics.world.removeCollider(self.colliderCarg6); 
          }

          // Seteo la velocidad del submarino dependiendo a la profundidad en que se encuentre
          if (self.submarino.profundidad === 0){
            // Si me encuentro en la superficie la velocidad va a ser lenta
            self.submarino.velocidad = self.velocidadMedia; 
          }else if(self.submarino.profundidad === 1){
            // Si me encuentro a baja profundidad la velocidad va a ser media
            self.submarino.velocidad = self.velocidadMedia; 
          }else if(self.submarino.profundidad === 2){
            // Si me encuentro a mucha profundidad la velocidad va a ser lenta
            self.submarino.velocidad = self.velocidadBaja; 
          }
      }
    }

    function sube(val){
      if(val==1){
         // Idem anteriores pero subiendo de 1 a 0
         if (self.submarino.profundidad == 1){
          self.submarino.profundidad = 0;
          self.submarino.armas = 0;
          console.log('subi a la superficie');
          //self.submarino.imagen.setTexture('uboot');
          self.submarino.imagen.setTexture(DEF.IMAGENES.UBOATP0);
          self.socket.emit('playerProf', {Pr: self.submarino.profundidad});
        } else if (self.submarino.profundidad == 2){
          // Idem anteriores pero subiendo de 0 a 1
          self.submarino.profundidad = 1;
          self.submarino.armas = 4;
          //self.submarino.imagen.setTexture('UbootProfundidad1');
          self.submarino.imagen.setTexture(DEF.IMAGENES.UBOATP1);
          console.log('subi a poca profundidad');
          self.socket.emit('playerProf', {Pr: self.submarino.profundidad});
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

        // Seteo la velocidad del submarino dependiendo a la profundidad en que se encuentre
        if (self.submarino.profundidad == 0){
          // Si me encuentro en la superficie la velocidad va a ser lenta
          self.submarino.velocidad = self.velocidadBaja; 
        }else if(self.submarino.profundidad == 1){
          // Si me encuentro a baja profundidad la velocidad va a ser media
          self.submarino.velocidad = self.velocidadMedia; 
        }else if(self.submarino.profundidad == 2){
        // Si me encuentro a mucha profundidad la velocidad va a ser lenta
          self.submarino.velocidad = self.velocidadBaja; 
        }
      }
    }

    function sonar(val){
      if(val==1){
      // Activo sonar si hay sonares disponibles
      if(self.submarino.sonar>0){
        if (self.usoSonar !== true){
          // Texto de aviso
          self.statusSonar = self.add.text(350, 270, '', { font: '50px Courier', fill: '#000000' }).setScrollFactor(0);
          
          self.usoSonar = true;

          // Activo sonido de sonar
          self.soundSonar.play();

          // Cambio de cámaras
          self.cameras.main.setMask(self.mask);
          self.cameras.main.setZoom(0.9);
          
          // Activo cuenta regresiva
          self.cuentaSonar = self.time.addEvent({ delay: 1000, callback: actualizarContSonar, callbackScope: self, loop: true});
          
          // Vuelvo a vista normal y elimino aviso
          self.resetSonar = self.time.addEvent({ delay: 10000, callback: camaraSonar, callbackScope: self, repeat: 0 });
          
          function camaraSonar(){
            // Restablezco las cámaras
            self.cameras.main.setMask(self.mask);
            self.cameras.main.setZoom(1.4);
            self.usoSonar = false;
            console.log("USO SONAR:"+self.usoSonar);
            // Elimino texto de tiempo restante
            removeText();
            self.soundSonar.stop();
            contadorS=0;
          }
          function actualizarContSonar(){
            contadorS++;
            self.statusSonar.setText('SONAR ACTIVADO - TIEMPO RESTANTE:'+(10-contadorS) + '\nSONARES RESTANTES: '+(self.submarino.sonar));
            if (contadorS === 10){
              self.cuentaSonar.remove(true);
            }
          }
          function removeText() {
            self.statusSonar.destroy();
          }
          self.submarino.sonar--;
        }
      }else{
        if (self.usoSonar !== true){
            // Texto de aviso
            self.statusSonar = self.add.text(350, 270, '', { font: '50px Courier', fill: '#000000' }).setScrollFactor(0);

            self.cuentaSonar = self.time.addEvent({ delay: 1000, callback: avisoNoHaySonar, callbackScope: self, loop: true});
            self.resetSonar = self.time.addEvent({ delay: 5000, callback: eliminoAvisoNHS, callbackScope: self, repeat: 0 });
            
            function eliminoAvisoNHS(){
              // Elimino texto de aviso no hay sonar
              removeText();
              contadorS=0;
            }
            function avisoNoHaySonar(){
              contadorS++;
              self.statusSonar.setText('¡SONAR AGOTADO!');
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

    function cambiarArma(valor){
      if(valor===1){
          //si esta en superficie, que cambie de armas tranquilamente
          if(self.submarino.profundidad === 0){
            if (self.submarino.armas === 0){
              self.submarino.armas = 1;
              console.log('Cambio a Torpedos');
            }else{
              self.submarino.armas = 0;
              console.log('cambio a canon');
            }
          }else if(self.submarino.profundidad === 1){
            //si esta a profundidad 1 que solo pueda usar el arma 1, torpedos
              self.submarino.armas = 4;
              console.log('Solo Torpedos a esta profundidad');  
          }else if(self.submarino.profundidad === 2){
            //si esta en profundidad 2 que no pueda disparar
            self.submarino.armas = -1;
          }
          if(self.submarino.armas === 0){
            self.distMax = 300;
          }else if(self.submarino.armas === 1 || self.submarino.armas === 4){
            self.distMax = 500;
          }   
          self.submarino.reticula.x = self.submarino.imagen.x + (Math.cos((self.submarino.imagen.angle - 360) * 0.01745) * self.distMax);
          self.submarino.reticula.y = self.submarino.imagen.y + (Math.sin((self.submarino.imagen.angle - 360) * 0.01745) * self.distMax);
      }    
    }

    function largavista(v){
      if(v===1){
        console.log("entro al larga vista");
        if(self.submarino.largavista === false && (self.submarino.profundidad === 0)){
          self.submarino.largavista = true;
          self.largaVistas.angle=self.submarino.imagen.angle+270;
          self.cameras.main.setMask(self.mar.masklv);
          self.cameras.main.setZoom(0.9);
        }else if(self.submarino.largavista === true && (self.submarino.profundidad === 0)){
          self.submarino.largavista = false;
          self.cameras.main.setMask(self.mask);
          self.cameras.main.setZoom(1.4);
        }
      }
    }

    function CAMBIARARMADESTRU(V){
      if(V===1){
        if (self.destructor.armas == 0){
          self.destructor.armas = 1;
          console.log('Cambio a Cargas de Profundidad');
        }else{
          self.destructor.armas = 0;
          console.log('cambio a canon');
        }
      }
    }

    function CAMARADESTRUCARG(VVV){
      if(VVV===1){
        if(self.siguiendoDes === true){
          self.cameras.main.startFollow(self.carguero1.imagen,true, 0.09, 0.09); 
          self.cameras.main.setZoom(1.4);
          self.siguiendoDes = false;
        }else{
          self.cameras.main.startFollow(self.destructor.imagen,true, 0.09, 0.09); 
          self.cameras.main.setZoom(0.9);
          self.siguiendoDes = true;
        }
      }
    }

    //funcion que recibe un click y ejecuta el evento disparo, el cual activa una bala del set de balas de la clase
    this.input.on('pointerdown', function (pointer, time) {
      if(self.equipo === 1){
        //si sos del equipo 1 sos el destructor, entonces genera el bullet desde destructor
        bullet = self.destructor.bullet.get().setActive(true).setVisible(true).setDisplaySize(10,10);
        
        //manejo de la municion del destructor
        if(self.destructor.armas === 0 && self.destructor.vida > 0 && self.destructor.ammoCanion > 0)
        {
          self.destructor.ammoCanion--;
          console.log("Municion restante Canon", self.destructor.ammoCanion);
 
          //llamo al metodo de disparo y le paso las balas, el jugador que hace el disparo, la mira del jugador y el enemig
          Disparo(self.destructor, bullet, self.submarino);

        }
        if (self.destructor.armas === 1 && self.destructor.vida > 0 && self.destructor.ammoCargas > 0)
        {
          self.destructor.ammoCargas--;
          console.log("Cargas de profundidad restantes", self.destructor.ammoCargas);
      
          //llamo al metodo de disparo y le paso las balas, el jugador que hace el disparo, la mira del jugador y el enemig
          Disparo(self.destructor, bullet, self.submarino);
        }
      }
      else
      {

        //si sos del equipo 1 sos el destructor, entonces genera el bullet desde destructor
        bullet = self.submarino.bullet.get().setActive(true).setVisible(true).setDisplaySize(10,10);
        
        //manejo de municion del submarino
        if(self.submarino.armas === 0 && self.submarino.vida > 0 && self.submarino.ammoCanion > 0)
        {
          self.submarino.ammoCanion--;
          console.log("Municion restante Canon", self.submarino.ammoCanion);

          //llamo al metodo de disparo y le paso las balas, el jugador que hace el disparo, la mira del jugador y el enemigo
          Disparo(self.submarino, bullet, self.destructor);
          Disparo(self.submarino, bullet, self.carguero1);
          Disparo(self.submarino, bullet, self.carguero2);
          Disparo(self.submarino, bullet, self.carguero3);
          Disparo(self.submarino, bullet, self.carguero4);
          Disparo(self.submarino, bullet, self.carguero5);
          Disparo(self.submarino, bullet, self.carguero6);    
        }
        if ((self.submarino.armas === 1 || self.submarino.armas === 4) && self.submarino.vida > 0 && self.submarino.ammoTorpedos > 0)
        {
          self.submarino.ammoTorpedos--;
          console.log("Torpedos restantes", self.submarino.ammoTorpedos);
          
          //llamo al metodo de disparo y le paso las balas, el jugador que hace el disparo, la mira del jugador y el enemigo
          Disparo(self.submarino, bullet, self.destructor);
          Disparo(self.submarino, bullet, self.carguero1);
          Disparo(self.submarino, bullet, self.carguero2);
          Disparo(self.submarino, bullet, self.carguero3);
          Disparo(self.submarino, bullet, self.carguero4);
          Disparo(self.submarino, bullet, self.carguero5);
          Disparo(self.submarino, bullet, self.carguero6);    
        }
      }
      //esto se hace para el caso en que se destruya el jugador pero siga tirando balas, borra las balas y no le deja hacer
      //dano al enemigo si el ya te gano
      if(self.destructor.vida <= 0){
        bullet.destroy();
      }
      //idem anterior
      if(self.submarino.vida <= 0){
        bullet.destroy();
      }
      //si el submarino no tiene armas porque esta sumergido
      if(self.submarino.armas === -1){
        bullet.destroy();
      }
    }, this);

    // FUNCION DE DISPARO DEL JUGADOR
    function Disparo(nave, bullet, enemy)
    {
      let player = nave.imagen;
      let reticula = nave.reticula;
      let enemyImag = enemy.imagen;

      if (bullet){ //Eeta funcion maneja la colsion de la bala con los bordes del mundo
          bullet.fire(player, reticula); //LLAMA AL METODO DISPARAR DE BULLET
          bullet.setCollideWorldBounds(true);
          bullet.body.onWorldBounds = true;
          bullet.body.world.on('worldbounds', function(body) {
            //COLISION CON LOS BORDES DEL MUNDO
            if (body.gameObject === this ) {
              this.setActive(false);
              this.setVisible(false);
            }
          }, bullet);
          
          //Colision con las islas
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
          //Colision con la mira
          self.physics.add.collider(bullet, reticula, function(bullet){
            bullet.destroy();
          });
          //MANEJO DE COLISION ENTRE LA BALA Y OTROS JUGADORES
          if(enemy.vida>0){
            self.physics.add.collider(bullet, enemyImag, function(bullet){
              distCorta = 75;
              distMedia = 200;

              corta = false;
              media = false;
              larga = false;  
              let distancia = Math.sqrt((bullet.x - player.x)**2 + (bullet.y - player.y)**2);
              //console.log((bullet.x - player.x)**2);
              let dist;
              if(distancia <= distCorta)
              {
                dist = "corta";
                /*corta = true;
                media = false;
                larga = false;*/
              }
              else if(distancia > distCorta && distancia<= distMedia)
              {
                dist = "media";
                /*corta = false;
                media = true;
                larga = false;*/
              }
              else if(distancia > distMedia)
              {
                dist = "larga";
                /*corta = false;
                media = false;
                larga = true; */ 
              }
            /*console.log("distancia corta", corta);
              console.log("distancia media", media);
              console.log("distiancia larga", larga);*/
              
              bullet.destroy();
              handleHit(nave, dist, enemy);
            });
          }  
      }
    }
    //funcion que maneja el dano hecho por cada vez que se lanza el evento disparo del click, segun el tipo de arma es el dano hecho
    //el dano luego es enviado por socket al otro jugador. Tambien realiza la gestion de vida del oponente - danio para poder
    //mostrar que estamos haciendole danio al otro jugador y que muere.
    function handleHit(nave, dist, enemy)
    {
      probabilidad = Math.floor(Math.random() * (11)); //Probabilidad Base
      let Escarguero;
      if(self.equipo === 1){
//--------------------------------------------------------------------------------------------------------------------------------
//                                                  CANON DEL DESTRUCTOR
//--------------------------------------------------------------------------------------------------------------------------------
          if(nave.armas === 0 && enemy.profundidad === 0)
          {
            if(dist === "corta")
            {
              probExtra = Math.floor(Math.random() * (2)); // Bonificacion de probabilidad

              //console.log('la probabilidad extra del canion es %', probExtra, '0');
              console.log('la probabilidad base es de  %', probabilidad + '0', '+ Extra %', probExtra + '0');
              //si la probabilidad de acierto es mayor que el 40%, entonces acierto
              if((probabilidad + probExtra) > 4)
              {
                hitted(enemy.imagen.x, enemy.imagen.y); 
                danio = 5;             
                //-----------------------TEXTO QUE MUESTRA EL DANO HECHO EN EL JUEGO----------------------------
                let contadorAviso = 0;
                self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                  '', {font: '20px monospace', fill: '#024A86', align: 'center'});

                function aviso(){
                  self.Hit2.setText('Danio: ' + danio);
                  contadorAviso++;
                  if (contadorAviso==3){
                    self.statusEnvio.remove(true);
                  }
                }
                
                function prueba(){
                  self.Hit2.destroy();
                }
                
                self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
          
                self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: prueba, callbackScope: self});
                //-----------------------ENVIO EL DANIO Y EL CARGUERO DANIADO AL SOCKET----------------------------

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

                  self.socket.emit('Finalizo', envioSocket);
                  self.scene.start(DEF.SCENES.FinScene, envio);
                }
                else
                {
                  enemy.vida = enemy.vida - danio;  
                }
              }else{
                //-----------------------TEXTO QUE MUESTRA EL DANO HECHO EN EL JUEGO----------------------------
                let contadorAviso = 0;
                self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                  '', {font: '20px monospace', fill: '#fff', align: 'center'});

                function aviso(){
                  self.Hit2.setText('Miss');
                  contadorAviso++;
                  if (contadorAviso==3){
                    self.statusEnvio.remove(true);
                  }
                }
                
                function prueba(){
                  self.Hit2.destroy();
                }
                
                self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
          
                self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: prueba, callbackScope: self});
                //-----------------------ENVIO EL DANIO Y EL CARGUERO DANIADO AL SOCKET----------------------------
              }  
            
            }
            else if(dist === "media")
            {
              probExtra = Math.floor(Math.random() * (3));
              //console.log('la probabilidad extra del canion es %', probExtra, '0');
              console.log('la probabilidad base es de  %', probabilidad + '0', '+ Extra %', probExtra+'0');
              //si la probabilidad de errar es mayor que el 40%, entonces fallo
              if((probabilidad + probExtra) > 3){
                hitted(enemy.imagen.x, enemy.imagen.y); 
                danio = 5;
                
                //-----------------------TEXTO QUE MUESTRA EL DANO HECHO EN EL JUEGO----------------------------
                let contadorAviso = 0;
                self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                  '', {font: '20px monospace', fill: '#024A86', align: 'center'});

                function aviso(){
                  self.Hit2.setText('Danio: ' + danio);
                  contadorAviso++;
                  if (contadorAviso==3){
                    self.statusEnvio.remove(true);
                  }
                }
                
                function prueba(){
                  self.Hit2.destroy();
                }
                
                self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
          
                self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: prueba, callbackScope: self});
                //-----------------------ENVIO EL DANIO Y EL CARGUERO DANIADO AL SOCKET----------------------------

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

                  self.socket.emit('Finalizo', envioSocket);
                  self.scene.start(DEF.SCENES.FinScene, envio);
                }
                else
                {
                  enemy.vida = enemy.vida - danio;  
                }
              }else{
                //-----------------------TEXTO QUE MUESTRA EL DANO HECHO EN EL JUEGO----------------------------
                let contadorAviso = 0;
                self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                  '', {font: '20px monospace', fill: '#fff', align: 'center'});

                function aviso(){
                  self.Hit2.setText('Miss');
                  contadorAviso++;
                  if (contadorAviso==3){
                    self.statusEnvio.remove(true);
                  }
                }
                
                function prueba(){
                  self.Hit2.destroy();
                }
                
                self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
          
                self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: prueba, callbackScope: self});
                //-----------------------ENVIO EL DANIO Y EL CARGUERO DANIADO AL SOCKET----------------------------
              }  
            }
            else if(dist === "larga")
            {
              probExtra = Math.floor(Math.random() * (3));
              //console.log('la probabilidad extra del canion es %', probExtra, '0');
              console.log('la probabilidad base es de  %', probabilidad + '0', '+ Extra %', probExtra +'0');
              //si la probabilidad de errar es mayor que el 60%, entonces fallo
              if((probabilidad + probExtra) > 6){
                hitted(enemy.imagen.x, enemy.imagen.y); 
                danio = 5;
                
                //-----------------------TEXTO QUE MUESTRA EL DANO HECHO EN EL JUEGO----------------------------
                let contadorAviso = 0;
                self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                  '', {font: '20px monospace', fill: '#024A86', align: 'center'});

                function aviso(){
                  self.Hit2.setText('Danio: ' + danio);
                  contadorAviso++;
                  if (contadorAviso==3){
                    self.statusEnvio.remove(true);
                  }
                }
                
                function prueba(){
                  self.Hit2.destroy();
                }
                
                self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
          
                self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: prueba, callbackScope: self});
                //-----------------------ENVIO EL DANIO Y EL CARGUERO DANIADO AL SOCKET----------------------------

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

                  self.socket.emit('Finalizo', envioSocket);
                  self.scene.start(DEF.SCENES.FinScene, envio);
                }
                else
                {
                  enemy.vida = enemy.vida - danio;  
                }
              }else{
                //-----------------------TEXTO QUE MUESTRA EL DANO HECHO EN EL JUEGO----------------------------
                let contadorAviso = 0;
                self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                  '', {font: '20px monospace', fill: '#fff', align: 'center'});

                function aviso(){
                  self.Hit2.setText('Miss');
                  contadorAviso++;
                  if (contadorAviso==3){
                    self.statusEnvio.remove(true);
                  }
                }
                
                function prueba(){
                  self.Hit2.destroy();
                }
                
                self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
          
                self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: prueba, callbackScope: self});
                //-----------------------ENVIO EL DANIO Y EL CARGUERO DANIADO AL SOCKET----------------------------
              } 
            }   
//--------------------------------------------------------------------------------------------------------------------------------
//                                                  CARGAS DE PROFUNDIDAD DEL DESTRUCTOR
//--------------------------------------------------------------------------------------------------------------------------------
          }else if (nave.armas === 1){
            if(dist === "corta")
            {
              probExtra = Math.floor(Math.random() * (2));
              //console.log('la probabilidad extra de la carga es %', probExtra, '0');
              console.log('la probabilidad base es de  %', probabilidad + '0', '+ Extra %', probExtra+ '0');
              //si la probabilidad de errar es mayor que el 10%, entonces fallo
              if((probabilidad + probExtra) > 1)
              {
                if(nave.cargas === enemy.profundidad)
                {
                  danio = 3;
                  hitted(enemy.imagen.x, enemy.imagen.y); 
                  
                  //-----------------------TEXTO QUE MUESTRA EL DANO HECHO EN EL JUEGO----------------------------
                  let contadorAviso = 0;
                  self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                    '', {font: '20px monospace', fill: '#024A86', align: 'center'});

                  function aviso(){
                    self.Hit2.setText('Danio: ' + danio);
                    contadorAviso++;
                    if (contadorAviso==3){
                      self.statusEnvio.remove(true);
                    }
                  }
                  
                  function prueba(){
                    self.Hit2.destroy();
                  }
                  
                  self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
            
                  self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: prueba, callbackScope: self});
                  //-----------------------ENVIO EL DANIO Y EL CARGUERO DANIADO AL SOCKET----------------------------

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
  
                    self.socket.emit('Finalizo', envioSocket);
                    self.scene.start(DEF.SCENES.FinScene, envio);
                  }
                  else
                  {
                    enemy.vida = enemy.vida - danio;  
                  }
                }
              }else{
                //-----------------------TEXTO QUE MUESTRA EL DANO HECHO EN EL JUEGO----------------------------
                let contadorAviso = 0;
                self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                  '', {font: '20px monospace', fill: '#fff', align: 'center'});

                function aviso(){
                  self.Hit2.setText('Miss');
                  contadorAviso++;
                  if (contadorAviso==3){
                    self.statusEnvio.remove(true);
                  }
                }
                
                function prueba(){
                  self.Hit2.destroy();
                }
                
                self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
          
                self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: prueba, callbackScope: self});
                //-----------------------ENVIO EL DANIO Y EL CARGUERO DANIADO AL SOCKET----------------------------
              }  
            }
            else if(dist === "media")
            {
              probExtra = Math.floor(Math.random() * (3));
              //console.log('la probabilidad extra de la carga es %', probExtra, '0');
              console.log('la probabilidad base es de  %', probabilidad + '0', '+ Extra %', probExtra+ '0');
              //si la probabilidad de errar es mayor que el 70%, entonces fallo
              if((probabilidad + probExtra) > 7)
              {
                if(nave.cargas === enemy.profundidad)
                {
                  danio = 3;
                  hitted(enemy.imagen.x, enemy.imagen.y); 
                  
                  //-----------------------TEXTO QUE MUESTRA EL DANO HECHO EN EL JUEGO----------------------------
                  let contadorAviso = 0;
                  self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                    '', {font: '20px monospace', fill: '#024A86', align: 'center'});

                  function aviso(){
                    self.Hit2.setText('Danio: ' + danio);
                    contadorAviso++;
                    if (contadorAviso==3){
                      self.statusEnvio.remove(true);
                    }
                  }
                  
                  function prueba(){
                    self.Hit2.destroy();
                  }
                  
                  self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
            
                  self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: prueba, callbackScope: self});
                  //-----------------------ENVIO EL DANIO Y EL CARGUERO DANIADO AL SOCKET----------------------------

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
  
                    self.socket.emit('Finalizo', envioSocket);
                    self.scene.start(DEF.SCENES.FinScene, envio);
                  }
                  else
                  {
                    enemy.vida = enemy.vida - danio;  
                  }
                }
              }else{
                //-----------------------TEXTO QUE MUESTRA EL DANO HECHO EN EL JUEGO----------------------------
                let contadorAviso = 0;
                self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                  '', {font: '20px monospace', fill: '#fff', align: 'center'});

                function aviso(){
                  self.Hit2.setText('Miss');
                  contadorAviso++;
                  if (contadorAviso==3){
                    self.statusEnvio.remove(true);
                  }
                }
                
                function prueba(){
                  self.Hit2.destroy();
                }
                
                self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
          
                self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: prueba, callbackScope: self});
                //-----------------------ENVIO EL DANIO Y EL CARGUERO DANIADO AL SOCKET----------------------------
              }  
            }
          }   
//--------------------------------------------------------------------------------------------------------------------------------
//                                                  CANON DEL SUBMARINO
//--------------------------------------------------------------------------------------------------------------------------------            
      }
      else if (self.equipo === 2)
      {      
            if(nave.armas === 0)
            {
              if(dist === "corta")
              {
                probExtra = Math.floor(Math.random() * (2));
                //console.log('la probabilidad extra del canion es %', probExtra, '0');
                console.log('la probabilidad base es de  %', probabilidad + '0', '+ Extra %', probExtra+ '0');
                //si la probabilidad de errar es mayor que el 10%, entonces fallo
                if((probabilidad + probExtra) > 3)
                {
                  //console.log("entro al if del danio sub corto");
                  hitted(enemy.imagen.x, enemy.imagen.y); 
                  
                  danio = 2;
                  
                  //-----------------------TEXTO QUE MUESTRA EL DANO HECHO EN EL JUEGO----------------------------
                  let contadorAviso = 0;
                  self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                    '', {font: '20px monospace', fill: '#024A86', align: 'center'});

                  function aviso(){
                    self.Hit2.setText('Danio: ' + danio);
                    contadorAviso++;
                    if (contadorAviso==3){
                      self.statusEnvio.remove(true);
                    }
                  }
                  
                  function prueba(){
                    self.Hit2.destroy();
                  }
                  
                  self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
            
                  self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: prueba, callbackScope: self});
                //-----------------------ENVIO EL DANIO Y EL CARGUERO DANIADO AL SOCKET----------------------------

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
                  }
                  else
                  {
                    enemy.vida = enemy.vida - danio;
                  }
                }else{
                  //-----------------------TEXTO QUE MUESTRA EL DANO HECHO EN EL JUEGO----------------------------
                  let contadorAviso = 0;
                  self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                    '', {font: '20px monospace', fill: '#fff', align: 'center'});

                  function aviso(){
                    self.Hit2.setText('Miss');
                    contadorAviso++;
                    if (contadorAviso==3){
                      self.statusEnvio.remove(true);
                    }
                  }
                  
                  function prueba(){
                    self.Hit2.destroy();
                  }
                  
                  self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
            
                  self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: prueba, callbackScope: self});
                  //-----------------------ENVIO EL DANIO Y EL CARGUERO DANIADO AL SOCKET----------------------------
                } 
              }
              else if(dist === "media")
              {
                  probExtra = Math.floor(Math.random() * (3));
                  //console.log('la probabilidad extra del canion es %', probExtra, '0');
                  console.log('la probabilidad base es de  %', probabilidad + '0', '+ Extra %', probExtra+ '0');
                  //si la probabilidad de errar es mayor que el 10%, entonces fallo
                  if((probabilidad + probExtra) > 6){
                    //console.log("entro al if del danio sub medio");
                    hitted(enemy.imagen.x, enemy.imagen.y); 
                  
                    danio = 2;
                  
                    //-----------------------TEXTO QUE MUESTRA EL DANO HECHO EN EL JUEGO----------------------------
                    let contadorAviso = 0;
                    self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                      '', {font: '20px monospace', fill: '#024A86', align: 'center'});

                    function aviso(){
                      self.Hit2.setText('Danio: ' + danio);
                      contadorAviso++;
                      if (contadorAviso==3){
                        self.statusEnvio.remove(true);
                      }
                    }
                    
                    function prueba(){
                      self.Hit2.destroy();
                    }
                    
                    self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
              
                    self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: prueba, callbackScope: self});
                    //-----------------------ENVIO EL DANIO Y EL CARGUERO DANIADO AL SOCKET----------------------------

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
                    }
                    else
                      enemy.vida = enemy.vida - danio;
                }else{
                  //-----------------------TEXTO QUE MUESTRA EL DANO HECHO EN EL JUEGO----------------------------
                  let contadorAviso = 0;
                  self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                    '', {font: '20px monospace', fill: '#fff', align: 'center'});

                  function aviso(){
                    self.Hit2.setText('Miss');
                    contadorAviso++;
                    if (contadorAviso==3){
                      self.statusEnvio.remove(true);
                    }
                  }
                  
                  function prueba(){
                    self.Hit2.destroy();
                  }
                  
                  self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
            
                  self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: prueba, callbackScope: self});
                  //-----------------------ENVIO EL DANIO Y EL CARGUERO DANIADO AL SOCKET----------------------------
                }  
              }
              else if(dist === "larga")
              {
                    probExtra = Math.floor(Math.random() * (3));
                    //console.log('la probabilidad extra del canion es %', probExtra, '0');
                    console.log('la probabilidad base es de  %', probabilidad + '0', '+ Extra %', probExtra+ '0');
                    //si la probabilidad de errar es mayor que el 10%, entonces fallo
                    if((probabilidad + probExtra) > 8)
                    {
                      //console.log("entro al if del danio sub largo");
                      hitted(enemy.imagen.x, enemy.imagen.y); 
                  
                      danio = 2;
                      
                      //-----------------------TEXTO QUE MUESTRA EL DANO HECHO EN EL JUEGO----------------------------
                      let contadorAviso = 0;
                      self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                        '', {font: '20px monospace', fill: '#024A86', align: 'center'});

                      function aviso(){
                        self.Hit2.setText('Danio: ' + danio);
                        contadorAviso++;
                        if (contadorAviso==3){
                          self.statusEnvio.remove(true);
                        }
                      }
                      
                      function prueba(){
                        self.Hit2.destroy();
                      }
                      
                      self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
                
                      self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: prueba, callbackScope: self});
                      //-----------------------ENVIO EL DANIO Y EL CARGUERO DANIADO AL SOCKET----------------------------

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
                      }
                      else
                        enemy.vida = enemy.vida - danio;
                    }else{
                      //-----------------------TEXTO QUE MUESTRA EL DANO HECHO EN EL JUEGO----------------------------
                      let contadorAviso = 0;
                      self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                        '', {font: '20px monospace', fill: '#fff', align: 'center'});

                      function aviso(){
                        self.Hit2.setText('Miss');
                        contadorAviso++;
                        if (contadorAviso==3){
                          self.statusEnvio.remove(true);
                        }
                      }
                      
                      function prueba(){
                        self.Hit2.destroy();
                      }
                      
                      self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
                
                      self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: prueba, callbackScope: self});
                      //-----------------------ENVIO EL DANIO Y EL CARGUERO DANIADO AL SOCKET----------------------------
                    }
              }
//--------------------------------------------------------------------------------------------------------------------------------
//                                                  TORPEDOS DEL SUBMARINO
//--------------------------------------------------------------------------------------------------------------------------------
            }
            else if (nave.armas === 1 || nave.armas === 4)
            {
              if(dist === "corta")
              {
                probExtra = Math.floor(Math.random() * (2));
                //console.log('la probabilidad extra del canion es %', probExtra + '0');
                console.log('la probabilidad base es de  %', probabilidad + '0', '+ Extra %', probExtra+ '0');
                //si la probabilidad de errar es mayor que el 10%, entonces fallo
                if((probabilidad + probExtra) > 2)
                {
                  //console.log("entro al if del danio sub corto torpedo");
                  danio = 4;

                  hitted(enemy.imagen.x, enemy.imagen.y); 
                  
                  //-----------------------TEXTO QUE MUESTRA EL DANO HECHO EN EL JUEGO----------------------------
                  let contadorAviso = 0;
                  self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                    '', {font: '20px monospace', fill: '#024A86', align: 'center'});

                  function aviso(){
                    self.Hit2.setText('Danio: ' + danio);
                    contadorAviso++;
                    if (contadorAviso==3){
                      self.statusEnvio.remove(true);
                    }
                  }
                  
                  function prueba(){
                    self.Hit2.destroy();
                  }
                  
                  self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
            
                  self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: prueba, callbackScope: self});
                  //-----------------------ENVIO EL DANIO Y EL CARGUERO DANIADO AL SOCKET----------------------------

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
                  }
                  else
                    enemy.vida = enemy.vida - danio;
                }else{
                  //-----------------------TEXTO QUE MUESTRA EL DANO HECHO EN EL JUEGO----------------------------
                  let contadorAviso = 0;
                  self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                    '', {font: '20px monospace', fill: '#fff', align: 'center'});

                  function aviso(){
                    self.Hit2.setText('Miss');
                    contadorAviso++;
                    if (contadorAviso==3){
                      self.statusEnvio.remove(true);
                    }
                  }
                  
                  function prueba(){
                    self.Hit2.destroy();
                  }
                  
                  self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
            
                  self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: prueba, callbackScope: self});
                  //-----------------------ENVIO EL DANIO Y EL CARGUERO DANIADO AL SOCKET----------------------------
                }
              }
              else if(dist === "media")
              {
                probExtra = Math.floor(Math.random() * (3));
                //console.log('la probabilidad extra del canion es %', probExtra, '0');
                console.log('la probabilidad base es de  %', probabilidad + '0', '+ Extra %', probExtra+ '0');
                //si la probabilidad de errar es mayor que el 10%, entonces fallo
                if((probabilidad + probExtra) > 3)
                {
                  
                  danio = 4;
                  hitted(enemy.imagen.x, enemy.imagen.y); 
                  
                  //-----------------------TEXTO QUE MUESTRA EL DANO HECHO EN EL JUEGO----------------------------
                  let contadorAviso = 0;
                  self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                    '', {font: '20px monospace', fill: '#024A86', align: 'center'});

                  function aviso(){
                    self.Hit2.setText('Danio: ' + danio);
                    contadorAviso++;
                    if (contadorAviso==3){
                      self.statusEnvio.remove(true);
                    }
                  }
                  
                  function prueba(){
                    self.Hit2.destroy();
                  }
                  
                  self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
            
                  self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: prueba, callbackScope: self});


                  //console.log('danio al enemigo', danio);
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
                  }
                  else
                    enemy.vida = enemy.vida - danio;
                } else {
                  //-----------------------TEXTO QUE MUESTRA EL DANO HECHO EN EL JUEGO----------------------------
                  let contadorAviso = 0;
                  self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                    '', {font: '20px monospace', fill: '#fff', align: 'center'});

                  function aviso(){
                    self.Hit2.setText('Miss');
                    contadorAviso++;
                    if (contadorAviso==3){
                      self.statusEnvio.remove(true);
                    }
                  }
                  
                  function prueba(){
                    self.Hit2.destroy();
                  }
                  
                  self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
            
                  self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: prueba, callbackScope: self});
                  //-----------------------ENVIO EL DANIO Y EL CARGUERO DANIADO AL SOCKET----------------------------
                } 
              }
              else if(dist === "larga")
              {
                probExtra = Math.floor(Math.random() * (3));
                //console.log('la probabilidad extra del canion es %', probExtra, '0');
                console.log('la probabilidad base es de  %', probabilidad + '0', '+ Extra %', probExtra+ '0');
                //si la probabilidad de errar es mayor que el 10%, entonces fallo
                if((probabilidad + probExtra) > 5)
                {
                  danio = 4;
                  hitted(enemy.imagen.x, enemy.imagen.y); 
                  
                  //-----------------------TEXTO QUE MUESTRA EL DANO HECHO EN EL JUEGO----------------------------
                  let contadorAviso = 0;
                  self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                    '', {font: '20px monospace', fill: '#024A86', align: 'center'});
                  function aviso(){
                    self.Hit2.setText('Danio: ' + danio);
                    contadorAviso++;
                    if (contadorAviso==3){
                      self.statusEnvio.remove(true);
                    }
                  }
                  
                  function prueba(){
                    self.Hit2.destroy();
                  }
                  
                  self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
            
                  self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: prueba, callbackScope: self});
                  //-----------------------ENVIO EL DANIO Y EL CARGUERO DANIADO AL SOCKET----------------------------

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
                  }
                  else
                    enemy.vida = enemy.vida - danio;
                }else{
                  //-----------------------TEXTO QUE MUESTRA EL DANO HECHO EN EL JUEGO----------------------------
                  let contadorAviso = 0;
                  self.Hit2 = self.add.text( enemy.imagen.x + 25, enemy.imagen.y + 25, 
                    '', {font: '20px monospace', fill: '#fff', align: 'center'});

                  function aviso(){
                    self.Hit2.setText('Miss');
                    contadorAviso++;
                    if (contadorAviso==3){
                      self.statusEnvio.remove(true);
                    }
                  }
                  
                  function prueba(){
                    self.Hit2.destroy();
                  }
                  
                  self.statusEnvio = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});
            
                  self.statusResetEnvio = self.time.addEvent({ delay: 700, callback: prueba, callbackScope: self});
                  //-----------------------ENVIO EL DANIO Y EL CARGUERO DANIADO AL SOCKET----------------------------
                }
              }     
            }
            
          } 
    }
   
    
    //funcion que muestra la explosion en la posicion determinada
    function hitted(x, y){
      //self.explotion2 = self.add.sprite(x,y,'explot').setDisplaySize(100, 100).setDepth(5);
      self.explotion2 = self.add.sprite(x,y,'explot').setDisplaySize(120, 120).setDepth(5);  //se crea el sprite de explosiones
      self.anims.create({  // Se crea la animacion para la explosion luego de recibir disparo
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
    //funcion que muestra y destruye un jugador
    function destroyed(playerIMG){
      //self.explotion3 = self.add.sprite(playerIMG.x ,playerIMG.y ,'explot').setDisplaySize(100, 100).setDepth(5);
      self.explotion3 = self.add.sprite(playerIMG.x ,playerIMG.y, 'explot').setDisplaySize(200, 200).setDepth(5);  //se crea el sprite de explosiones
      self.anims.create({  // Se crea la animacion para la explosion luego de recibir disparo
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

    //funcion que procesa el dano y el porcentaje de acierto
    function RecibeHit(player, damage, escar)
    {
      let contadorAviso = 0;
      playerIMG = player.imagen;
      hitted(playerIMG.x, playerIMG.y);
      self.Hit = self.add.text( playerIMG.x + 25, playerIMG.y + 25, 
        '', 
        {font: '20px monospace', fill: '#FF0000', align: 'center'}
      );
      function aviso(){
        self.Hit.setText('Impacto Recibido! Danio: ' + damage);
        contadorAviso++;
        if (contadorAviso==3){
          self.status.remove(true);
        }
      }
      
      function prueba(){
        self.Hit.destroy();
      }
      
      self.status = self.time.addEvent({ delay: 10, callback: aviso, callbackScope: self, loop: true});

      self.statusReset = self.time.addEvent({ delay: 700, callback: prueba, callbackScope: self});

      if(player.vida > 0)
      {
        player.vida = player.vida - damage; 
        console.log('Vida Restante', player.vida);
      }
      if(player.vida <= 0)
      {
        console.log('vida menor que 0');
        destroyed(playerIMG);
        playerIMG.removeInteractive();
        playerIMG.setActive(false);
        playerIMG.setVisible(false);
        self.textures.remove(playerIMG);
        if(escar)
        {
          carguerosMuertos++;
        }
      }
      if(carguerosMuertos > 3)
      {
        let envio={
          socket: self.socket,
          resultado: 1,
          equipo: 2
        }
        let envioSocket= {
          resultado: 2,
          equipo: 1
        }
        self.socket.emit('Finalizo', envioSocket);
        self.scene.start(DEF.SCENES.FinScene, envio);
      }
    }
    //funcion que convierte el cursor en una mira
    this.input.on('pointermove', function (pointer) {
    //maneja la mira del destructor con el cursor  
      if(self.equipo === 1){
        if (this.input.mouse.locked){
          self.destructor.reticula.x += pointer.movementX;
          self.destructor.reticula.y += pointer.movementY;
        }
        if(self.destructor.armas == 0){
          distMaxima = 300;
          if ((self.destructor.reticula.x - self.destructor.imagen.x) > distMaxima)
              self.destructor.reticula.x = self.destructor.imagen.x +distMaxima;
            else if (self.destructor.reticula.x - self.destructor.imagen.x < -distMaxima)
              self.destructor.reticula.x = self.destructor.imagen.x -distMaxima;
            if (self.destructor.reticula.y - self.destructor.imagen.y > distMaxima)
              self.destructor.reticula.y = self.destructor.imagen.y +distMaxima;
            else if (self.destructor.reticula.y - self.destructor.imagen.y < -distMaxima)
              self.destructor.reticula.y = self.destructor.imagen.y-distMaxima;
        }else if (self.destructor.armas == 1){
          distMaxima = 200;
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
    //maneja la mira del submarino con el cursor 
    }, this);

    // Destruye a un jugador cuando se desconecta del socket
    this.socket.on('playerDisconnected', function (playerId){
      if (playerId != self.socket.id){
        if(self.equipo===1){
          self.submarino.imagen.destroy();
        }else{
          self.destructor.imagen.destroy();
          // VERVER - Destruir cargueros con un foreach desde el arreglo de cargueros
          self.carguero1.imagen.destroy();
          self.carguero2.imagen.destroy();
          self.carguero3.imagen.destroy();
          self.carguero4.imagen.destroy();
          self.carguero5.imagen.destroy();
          self.carguero6.imagen.destroy();
        }
      }
    });
    
    // Escucho el movimiento del otro jugador y lo dibujo en mi cliente
    this.socket.on('playerMoved', function (playerInfo) {
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

    // Escucho el evento de movimiento de los cargueros y lo dibujo en mi cliente dependiendo del carguero que se haya desplazado
    this.socket.on('carguerosMoved', function (playerInfo) {
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

    //escucho el tiro que me dieron desde el otro jugador y lo proceso
    this.socket.on('playerHitted', function(playerInfo)
    {       
        if(self.equipo===1)
        {
          if (playerInfo.numerocarguero === 0)
          {
            RecibeHit(self.destructor, playerInfo.damage, false);
          }
          else if(playerInfo.numerocarguero === 1)
          {
            RecibeHit(self.carguero1, playerInfo.damage, true);
          }
          else if(playerInfo.numerocarguero === 2)
          {
            RecibeHit(self.carguero2, playerInfo.damage, true);
          }
          else if(playerInfo.numerocarguero === 3)
          {
            RecibeHit(self.carguero3, playerInfo.damage, true);
          }
          else if(playerInfo.numerocarguero === 4)
          {
            RecibeHit(self.carguero4, playerInfo.damage, true);
          }
          else if(playerInfo.numerocarguero === 5)
          {
            RecibeHit(self.carguero5, playerInfo.damage, true);
          }
          else if(playerInfo.numerocarguero === 6)
          {
            RecibeHit(self.carguero6, playerInfo.damage, true);
          }
        }
        else
        {
            RecibeHit(self.submarino, playerInfo.damage, false);
        }
    }); 

    this.socket.on('playerUnder', function(playerInfo){      
      self.submarino.profundidad = playerInfo.deep;
      //if(self.socket.id == playerInfo.id){
        if(self.equipo===1){
          if (self.submarino.profundidad === 1 ){
            //self.submarino.imagen.setTexture('UbootProfundidad2').setVisible(true);
            self.submarino.imagen.setTexture(DEF.IMAGENES.UBOATP2).setVisible(true);
            console.log('bajo a poca profundidad');
          }else if (self.submarino.profundidad == 2){
            self.submarino.imagen.setVisible(false);
             console.log('bajo a mucha profundidad');
         }else{
            console.log('superficie');
            //self.submarino.imagen.setTexture('uboot').setVisible(true);
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

    function iniciarPartida()
    {
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
  }

  // Función update, se refresca constantemente para ir dibujando los distintos cambios que sucedan en la escena, aqui se agrega todo lo que se desea que se actualice y refleje graficamente
  update(time, delta) {
    if(this.equipo === 1){
      // Agregamos el movimiento de los barcos con las flechas de direccion y seteamos la velocidad de rotacion de giro del destructor
      if (this.destructor){
        if (this.left.isDown && (this.up.isDown || this.down.isDown) || this.UPDI==1 ) {
          this.destructor.imagen.setAngularVelocity(-100)
        } else if (this.right.isDown && (this.up.isDown || this.down.isDown)) {
          this.destructor.imagen.setAngularVelocity(100)
        } else {
          this.destructor.imagen.setAngularVelocity(0) // Si no se esta apretando la tecla de arriba o abajo la velocidad de rotacion y de giro es 0
        }
       
        // Calculo y seteo la velocidad de los barcos y el angulo de rotacion como una constante
        const velX = Math.cos((this.destructor.imagen.angle - 360) * 0.01745)
        const velY = Math.sin((this.destructor.imagen.angle - 360) * 0.01745)
        // Seteo la velocidad de movimiento
        if (this.up.isDown  || this.UP===1) {
          this.destructor.imagen.setVelocityX(this.destructor.velocidad * velX)
          this.destructor.imagen.setVelocityY(this.destructor.velocidad  * velY)
        } else if (this.down.isDown) {
          this.destructor.imagen.setVelocityX(-(this.destructor.velocidad/2) * velX)
          this.destructor.imagen.setVelocityY(-(this.destructor.velocidad/2) * velY)
        } else {
          // Seteo todo en 0 porque no se esta moviendo
          this.destructor.imagen.setAcceleration(0)
          this.destructor.imagen.setVelocityX(0)
          this.destructor.imagen.setVelocityY(0)
        }
        
        let oldPosition = {}
        // Comparo la posicion y rotacion actual del barco, y en caso de que haya cambiado envio el evento "playerMovement" al socket para comunicar a todos los clientes
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
        
        // Guardo la posicion actual del destructor para comparar con la nueva y chequear si hubo movimiento
        oldPosition = {
          x: this.destructor.posX,
          y: this.destructor.posX,
          rotation: this.destructor.rotacion
        }
      }

      // Agregamos el movimiento de los cargueros con las teclas WASD y seteamos la velocidad de rotacion de giro del barco
      if (this.carguero1 || this.carguero2 || this.carguero3 || this.carguero4 || this.carguero5 || this.carguero6 ){
        if (this.cursors.left.isDown && (this.cursors.up.isDown || this.cursors.down.isDown)) {
          this.carguero1.imagen.setAngularVelocity(-100)
          this.carguero2.imagen.setAngularVelocity(-100)
          this.carguero3.imagen.setAngularVelocity(-100)
          this.carguero4.imagen.setAngularVelocity(-100)
          this.carguero5.imagen.setAngularVelocity(-100)
          this.carguero6.imagen.setAngularVelocity(-100)
        } else if (this.cursors.right.isDown && (this.cursors.up.isDown || this.cursors.down.isDown)) {
          this.carguero1.imagen.setAngularVelocity(100)
          this.carguero2.imagen.setAngularVelocity(100)
          this.carguero3.imagen.setAngularVelocity(100)
          this.carguero4.imagen.setAngularVelocity(100)
          this.carguero5.imagen.setAngularVelocity(100)
          this.carguero6.imagen.setAngularVelocity(100)
        } else {
          this.carguero1.imagen.setAngularVelocity(0) // Si no se esta apretando la tecla de arriba o abajo la velocidad de rotacion y de giro es 0
          this.carguero2.imagen.setAngularVelocity(0)
          this.carguero3.imagen.setAngularVelocity(0)
          this.carguero4.imagen.setAngularVelocity(0)
          this.carguero5.imagen.setAngularVelocity(0)
          this.carguero6.imagen.setAngularVelocity(0)
        }

        // Calculo y seteo la velocidad de los barcos y el angulo de rotacion como una constante
        const velCX = Math.cos((this.carguero1.imagen.angle - 360) * 0.01745)
        const velCY = Math.sin((this.carguero1.imagen.angle - 360) * 0.01745)
        if (this.cursors.up.isDown) {
          this.carguero1.imagen.setVelocityX(this.carguero1.velocidad * velCX)
          this.carguero1.imagen.setVelocityY(this.carguero1.velocidad * velCY)
          this.carguero2.imagen.setVelocityX(this.carguero2.velocidad * velCX)
          this.carguero2.imagen.setVelocityY(this.carguero2.velocidad * velCY)
          this.carguero3.imagen.setVelocityX(this.carguero3.velocidad * velCX)
          this.carguero3.imagen.setVelocityY(this.carguero3.velocidad * velCY)
          this.carguero4.imagen.setVelocityX(this.carguero4.velocidad * velCX)
          this.carguero4.imagen.setVelocityY(this.carguero4.velocidad * velCY)
          this.carguero5.imagen.setVelocityX(this.carguero5.velocidad * velCX)
          this.carguero5.imagen.setVelocityY(this.carguero5.velocidad * velCY)
          this.carguero6.imagen.setVelocityX(this.carguero6.velocidad * velCX)
          this.carguero6.imagen.setVelocityY(this.carguero6.velocidad * velCY)
        } else if (this.cursors.down.isDown) {
          this.carguero1.imagen.setVelocityX(-(this.carguero1.velocidad/2) * velCX)
          this.carguero1.imagen.setVelocityY(-(this.carguero1.velocidad/2) * velCY)
          this.carguero2.imagen.setVelocityX(-(this.carguero2.velocidad/2) * velCX)
          this.carguero2.imagen.setVelocityY(-(this.carguero2.velocidad/2) * velCY)
          this.carguero3.imagen.setVelocityX(-(this.carguero3.velocidad/2) * velCX)
          this.carguero3.imagen.setVelocityY(-(this.carguero3.velocidad/2) * velCY)
          this.carguero4.imagen.setVelocityX(-(this.carguero4.velocidad/2) * velCX)
          this.carguero4.imagen.setVelocityY(-(this.carguero4.velocidad/2) * velCY)
          this.carguero5.imagen.setVelocityX(-(this.carguero5.velocidad/2) * velCX)
          this.carguero5.imagen.setVelocityY(-(this.carguero5.velocidad/2) * velCY)
          this.carguero6.imagen.setVelocityX(-(this.carguero6.velocidad/2) * velCX)
          this.carguero6.imagen.setVelocityY(-(this.carguero6.velocidad/2) * velCY)
        } else {
          this.carguero1.imagen.setAcceleration(0)
          this.carguero2.imagen.setAcceleration(0)
          this.carguero3.imagen.setAcceleration(0)
          this.carguero4.imagen.setAcceleration(0)
          this.carguero5.imagen.setAcceleration(0)
          this.carguero6.imagen.setAcceleration(0)
        }
  
        // GENERO ACTUALIZACION DE MOVIMIENTO PARA EL CARGUERO 1
        let oldPosition1 = {}
        // Comparo la posicion y rotacion actual de los cargueros, y en caso de que haya cambiado envio el evento "carguerosMovement" al socket para comunicar a todos los clientes
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
        // Guardo la posicion actual del barco para comparar con la nueva y chequear si hubo movimiento
        oldPosition1 = {
          x: this.carguero1.imagen.x,
          y: this.carguero1.imagen.y,
          rotation: this.carguero1.imagen.rotation
        }

        // GENERO ACTUALIZACION DE MOVIMIENTO PARA EL CARGUERO 2
        let oldPosition2 = {}
        // Comparo la posicion y rotacion actual de los cargueros, y en caso de que haya cambiado envio el evento "carguerosMovement" al socket para comunicar a todos los clientes
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
        // Guardo la posicion actual del barco para comparar con la nueva y chequear si hubo movimiento
        oldPosition2 = {
          x: this.carguero2.imagen.x,
          y: this.carguero2.imagen.y,
          rotation: this.carguero2.imagen.rotation
        }

        // GENERO ACTUALIZACION DE MOVIMIENTO PARA EL CARGUERO 3
        let oldPosition3 = {}
        // Comparo la posicion y rotacion actual de los cargueros, y en caso de que haya cambiado envio el evento "carguerosMovement" al socket para comunicar a todos los clientes
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
        // Guardo la posicion actual del barco para comparar con la nueva y chequear si hubo movimiento
        oldPosition3 = {
          x: this.carguero3.imagen.x,
          y: this.carguero3.imagen.y,
          rotation: this.carguero3.imagen.rotation
        }

        // GENERO ACTUALIZACION DE MOVIMIENTO PARA EL CARGUERO 4
        let oldPosition4 = {}
        // Comparo la posicion y rotacion actual de los cargueros, y en caso de que haya cambiado envio el evento "carguerosMovement" al socket para comunicar a todos los clientes
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
        // Guardo la posicion actual del barco para comparar con la nueva y chequear si hubo movimiento
        oldPosition4 = {
          x: this.carguero4.imagen.x,
          y: this.carguero4.imagen.y,
          rotation: this.carguero4.imagen.rotation
        }

        // GENERO ACTUALIZACION DE MOVIMIENTO PARA EL CARGUERO 5
        let oldPosition5 = {}
        // Comparo la posicion y rotacion actual de los cargueros, y en caso de que haya cambiado envio el evento "carguerosMovement" al socket para comunicar a todos los clientes
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
        // Guardo la posicion actual del barco para comparar con la nueva y chequear si hubo movimiento
        oldPosition5 = {
          x: this.carguero5.imagen.x,
          y: this.carguero5.imagen.y,
          rotation: this.carguero5.imagen.rotation
        }

        // GENERO ACTUALIZACION DE MOVIMIENTO PARA EL CARGUERO 6
        let oldPosition6 = {}
        // Comparo la posicion y rotacion actual de los cargueros, y en caso de que haya cambiado envio el evento "carguerosMovement" al socket para comunicar a todos los clientes
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
        // Guardo la posicion actual del barco para comparar con la nueva y chequear si hubo movimiento
        oldPosition6 = {
          x: this.carguero6.imagen.x,
          y: this.carguero6.imagen.y,
          rotation: this.carguero6.imagen.rotation
        }
      }
      
    }else{
      if (this.submarino){
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
          // Seteo velocidad de rotacion y giro
          if (this.left.isDown && (this.up.isDown || this.down.isDown)) {
            this.submarino.imagen.setAngularVelocity(-100)
          } else if (this.right.isDown && (this.up.isDown || this.down.isDown)) {
            this.submarino.imagen.setAngularVelocity(100)
          } else {
            this.submarino.imagen.setAngularVelocity(0) // Si no se esta apretando la tecla de arriba o abajo la velocidad de rotacion y de giro es 0
            //this.submarino.reticula.setAngularVelocity(0)
          }

          let oldPosition = {}
          // Calculo y seteo la velocidad de los barcos y el angulo de rotacion como una constante
          const velX = Math.cos((this.submarino.imagen.angle - 360) * 0.01745)
          const velY = Math.sin((this.submarino.imagen.angle - 360) * 0.01745)
          // Seteo velocidad de movimiento
          if (this.up.isDown || this.UP===1) {
            this.submarino.imagen.setVelocityX(this.submarino.velocidad  * velX)
            //this.submarino.reticula.setVelocityX(this.submarino.velocidad * (velX))
            this.submarino.imagen.setVelocityY(this.submarino.velocidad * velY)
            //this.submarino.reticula.setVelocityY(this.submarino.velocidad * (velY))
          } else if (this.down.isDown) {
            this.submarino.imagen.setVelocityX(-(this.submarino.velocidad/2) * velX)
            //this.submarino.reticula.setVelocityX(-(this.submarino.velocidad/2) * (velX))
            this.submarino.imagen.setVelocityY(-(this.submarino.velocidad/2) * velY)
            //this.submarino.reticula.setVelocityY(-(this.submarino.velocidad/2) * (velY + 0.2))
          } else {
            this.submarino.imagen.setAcceleration(0)
            //this.submarino.reticula.setAcceleration(0)
          }

          // Comparo la posicion y rotacion actual del barco, y en caso de que haya cambiado envio el evento "playerMovement" al socket para comunicar a todos los clientes
          var x = this.submarino.imagen.x;
          var y = this.submarino.imagen.y;
          var r = this.submarino.imagen.rotation;
          this.submarino.reticula.x = this.submarino.imagen.x + (Math.cos((this.submarino.imagen.angle - 360) * 0.01745) * this.distMax);
          this.submarino.reticula.y = this.submarino.imagen.y + (Math.sin((this.submarino.imagen.angle - 360) * 0.01745) * this.distMax);
          //this.submarino.reticula.angle = this.submarino.imagen.angle;
          //this.submarino.reticula.rotacion = this.submarino.imagen.rotation;
          if (oldPosition && (x !== oldPosition.x || y !== oldPosition.y || r !== oldPosition.rotation)) {
            let data = {
              x: this.submarino.imagen.x,
              y: this.submarino.imagen.y,
              rotation: this.submarino.imagen.rotation
            }
            this.socket.emit('playerMovement', data);
          }
          
          // Guardo la posicion actual del submarino para comparar con la nueva y chequear si hubo movimiento
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