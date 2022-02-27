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
    this.velocidadMedia = 600; // Para testing puse 600, pero creo que deberia ser 160 la velocidad media para la jugabilidad real
    this.velocidadBaja = 80;
    this.destructor = new Destructor('Destructor',this.velocidadMedia,12,0,0,0,1,0); // Creo el objeto destructor 
    this.submarino = new Submarino('Submarino',this.velocidadMedia,0,14,0,0,0,2); // Creo el objeto submarino 
    this.carguero1 = new Carguero('Carguero1',this.velocidadBaja,8,0,0,0,3); // Creo el objeto carguero1 
    this.carguero2 = new Carguero('Carguero2',this.velocidadBaja,8,0,0,0,4); // Creo el objeto carguero2
    this.carguero3 = new Carguero('Carguero3',this.velocidadBaja,8,0,0,0,5); // Creo el objeto carguero3
    this.carguero4 = new Carguero('Carguero4',this.velocidadBaja,8,0,0,0,6); // Creo el objeto carguero4
    this.carguero5 = new Carguero('Carguero5',this.velocidadBaja,8,0,0,0,7); // Creo el objeto carguero5
    this.carguero6 = new Carguero('Carguero6',this.velocidadBaja,8,0,0,0,8); // Creo el objeto carguero6
  }

  // Creo todo el contenido del juego del juego, imagenes, los cursores, jugadores, barcos e implemento el WebSocket
  create(){
    // DEFINICIÓN DE VARIABLES, CONSTANTES Y OBJETOS VISULES EN EL MAPA A UTILIZAR -----------------------------------------------------------------------------------------------------------------------------------
    var self = this
    let bullet;
    let danio;
    let reticula;
    self.socket.emit('listarPartidas', {id: 2});

    // Grupo para los cargueros y balas
    var arrayCargueros = [];
    this.grupoCargueros = this.physics.add.group({ classType: Carguero, runChildUpdate: true });
    this.playerBullets = this.physics.add.group({ classType: Bullets, runChildUpdate: true });



    // Cargo la imagen de fondo del mapa
    this.mar = this.add.image(0, 0, 'mar').setOrigin(0).setScrollFactor(1).setDepth(0); 
    const backgroundW = this.mar.width;
    const backgroundH = this.mar.height;

    // Defino los limites de las dimensiones del mapa para el posicionamiento inicial de los barcos
    var frameW = 6416;
    var frameH = 2156;
    var margenCostaX = 810;
    var margenCostaY = 300;

    // Defino variables para las posiciones X e Y de los barcos
    var posX;
    var posY;
    let distMax;
    let damAcuD = 0;
    let damAcuS = 0;
    // Obtengo el centro del canvas para la mascara
    const centroW = this.sys.game.config.width / 2;
    const centroH = this.sys.game.config.height / 2;
    // Construyo la máscara de visión
    const maskImage = this.make.image({
      x: centroW,
      y: centroH,
      key: 'mask',
      add: false
    });
    const mask = maskImage.createBitmapMask();

    // Ajusto cámaras
    this.cameras.main.setMask(mask);
    this.physics.world.setBounds(0, 0, backgroundW, backgroundH);
    
    // Islas
    this.isla1 = self.physics.add.image(2100,900,'island1').setDepth(1);
    this.isla1.setImmovable(true);
    this.isla1.setDisplaySize(400, 400);
    this.isla2 = self.physics.add.image(2460,1600,'island1').setDepth(1);
    this.isla2.setImmovable(true);
    this.isla2.setDisplaySize(400, 400);
    this.isla3 = self.physics.add.image(3200,600,'island1').setDepth(1);
    this.isla3.setImmovable(true);
    this.isla3.setDisplaySize(400, 400);
    this.isla4 = self.physics.add.image(3400,1800,'island1').setDepth(1);
    this.isla4.setImmovable(true);
    this.isla4.setDisplaySize(400, 400);

    // Costas
    this.costa1 = self.physics.add.image(345,1078,'costa1').setDepth(1);;
    this.costa1.setImmovable(true);
    this.costa2 = self.physics.add.image(6066,1078,'costa2').setDepth(1);;
    this.costa2.setImmovable(true);

    // Introduzco cursores y teclas utilizables
    this.cursors = this.input.keyboard.createCursorKeys();
    this.KeyCamera = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
    this.KeyMute = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    this.KeyUnmute = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);
    this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.down = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    // INICIO DE LA LÖGICA DEL COMPORTAMIENTO DEL JUEGO -----------------------------------------------------------------------------------------------------------------------------------

    // Segun el equipo del jugador actual, genero todos elementos del equipo correspondiente
    if(self.equipo === 1){ // Genero el equipo 1 que son el destructor y los cargueros, aunque tambien debo generar al submarino (Pero sin su camara ni colisiones) para ir actualizando su posicion en este cliente con el movimiento del otro jugador      
      generarEquipo1();

      // Habilito el boton para cambiar de camara con los cargueros
      const btnCamaraCarguero = this.add.text(600, 600, 'BOTON PARA CAMBIAR DE CAMARA CON LOS CARGUEROS', { fill: '#000000' }).setScrollFactor(0).setInteractive().on('pointerdown', () => cambioCamaraCargueros(1));
      const btnCamaraDestructor = this.add.text(600, 650, 'BOTON PARA CAMBIAR DE CAMARA CON EL DESTRUCTOR', { fill: '#000000' }).setScrollFactor(0).setInteractive().on('pointerdown', () => cambioCamaraCargueros(0));
    }else{ // Genero el equipo 2 que es el submarino, aunque tambien debo generar la imagen del destructor y los cargueros para ir actualizandola con el movimiento del otro jugador      
      generarEquipo2();
    }    

    function generarEquipo1(){     
      // Genero la imagen del destructor, colisiones, particulas, etc
      generarDestructor();

      // Genero los objetos cargueros, con sus imagenes, colisiones, etc
      generarCargueros();

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
      // Genero las posiciones X e Y para el destructor
      posX = Math.floor((Math.random()*((frameW*0.25)- margenCostaX))+margenCostaX), // El margen x para generarse los cargueros sera desde la costa (810) hasta el 25% del total del mapa
      posY = Math.floor((Math.random()*((frameH-400)- margenCostaY))+margenCostaY), // El margen y para generarse los cargueros sera el (total - 400) de la parte de arriba y de abajo del mapa
      
      // Actualizo la posicion del objeto destructor creado previamente
      self.destructor.posX = posX;
      self.destructor.posY = posY;

      // Generamos la imagen del destructor al objeto destructor
      self.destructor.imagen = self.physics.add.image(self.destructor.posX, self.destructor.posY, 'destroyer')
      .setDisplaySize(200, 100)
      .setRotation(0)
      .setDepth(5)
      .setPushable(false);

      self.destructor.imagen.setCollideWorldBounds(true) // Colisiones con el fin del mapa
      self.destructor.imagen.setDrag(1000) // Es la velocidad de desaceleracion con el tiempo cuando se deja de mover un jugador

      //guardo la reticula y el set de balas en variables propias de la clase destructor
      self.destructor.reticula = self.physics.add.sprite(self.destructor.posX, self.destructor.posY, 'crosshair').setCollideWorldBounds(true);;
      self.destructor.bullet = self.playerBullets;
      self.destructor.cargas = 1;
      // Particulas
      const particles = self.add.particles("Blue").setDepth(4) // Imagen Blue como particula
      const emitter = particles.createEmitter({ // Funcion emitter de phaser para emitir varias particulas
        speed: 10, // Velocidad con la que se mueven
        scale: {start: 0.08, end: 0}, // Tamaño
        blendMode: "ADD" // Efecto a aplicar
      })
      particles.setPosition(self.destructor.imagen.x, self.destructor.imagen.y)
      emitter.startFollow(self.destructor.imagen) // Le indicamos que sigan al destructor
      
      // Se indica que la camara siga al destructor
      self.cameras.main.startFollow(self.destructor.imagen,true, 0.09, 0.09); 
      // Zoom de la cámara
      self.cameras.main.setZoom(0.9);
      // Se crea una colision del barco con las islas
      self.physics.add.collider(self.destructor.imagen, self.isla1); 
      self.physics.add.collider(self.destructor.imagen, self.isla2); 
      self.physics.add.collider(self.destructor.imagen, self.isla3); 
      self.physics.add.collider(self.destructor.imagen, self.isla4); 
      // Se crea una colision del barco con la bomba
      self.physics.add.collider(self.destructor.imagen, self.bomb);
      // Se crea una colision del barco con los cargueros
      self.physics.add.collider(self.destructor.imagen, self.grupoCargueros);
      self.physics.add.collider(self.destructor.imagen, self.carguero1.imagen);
      // Se crea una colision del barco con la costa1
      self.physics.add.collider(self.destructor.imagen, self.costa1);
      // Se crea una colision del barco con la costa2
      self.physics.add.collider(self.destructor.imagen, self.costa2);

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
    }

    // Generar destructor
    function generarDestructorEnemigo(){
      // Generamos la imagen del destructor al objeto destructor
      self.destructor.imagen = self.physics.add.image(0,0, 'destroyer')
      .setDisplaySize(200, 100)
      .setRotation(0)
      .setDepth(5)
      .setPushable(false);
    
      // Particulas
      const particles = self.add.particles("Blue").setDepth(2) // Imagen Blue como particula
      const emitter = particles.createEmitter({ // Funcion emitter de phaser para emitir varias particulas
        speed: 10, // Velocidad con la que se mueven
        scale: {start: 0.08, end: 0}, // Tamaño
        blendMode: "ADD" // Efecto a aplicar
      })
      particles.setPosition(0,-1)
      emitter.startFollow(self.destructor.imagen) // Le indicamos que sigan al destructor
      
      self.colliderSub = self.physics.add.collider(self.submarino.imagen, self.destructor.imagen);
    }

    // Genero todo lo relacionado a la imagen del submarino del jugador actual
    function generarSubmarino(){
      // Genero las posiciones X e Y para el submarino
      posX = Math.floor((Math.random()*((frameW-800)-(frameW*0.75)))+(frameW*0.75)), // El margen x para generarse el submarino sera desde el 70% del mapa hasta el final - 800 del lado derecho
      posY = Math.floor((Math.random()*((frameH-300)- margenCostaY))+margenCostaY), // El margen y para generarse el submarino es el mismo que los demas barcos (total - 300)
      
      // Actualizo la posicion del objeto submarino creado previamente
      self.submarino.posX = posX;
      self.submarino.posY = posY;

      self.submarino.imagen = self.physics.add.image(self.submarino.posX, self.submarino.posY, 'uboot')
      .setDisplaySize(100,50)
      .setDepth(5) // Seteo tamaño y profundidad de la imagen
      .setPushable(false);

      self.submarino.imagen.setCollideWorldBounds(true) // Colisiones con el fin del mapa
      self.submarino.imagen.setDrag(1000) // Es la velocidad de desaceleracion con el tiempo cuando se deja de mover un jugador

      //guardo la reticula y el set de balas en variables propias de la clase submarino
      self.submarino.bullet = self.playerBullets;
      self.submarino.reticula = self.physics.add.sprite(self.submarino.posX, self.submarino.posY, 'crosshair').setCollideWorldBounds(true);
      // Particulas
      const particles = self.add.particles("Blue").setDepth(2) // Imagen Blue como particula
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
      self.physics.add.collider(self.submarino.imagen, self.carguero1.imagen);
      // Se crea una colision del barco con la costa1
      self.physics.add.collider(self.submarino.imagen, self.costa1);
      // Se crea una colision del barco con la costa2
      self.physics.add.collider(self.submarino.imagen, self.costa2);
      // Si el submarino se encuentra en la superficie, que colisione con el destructor
      self.colliderSub = self.physics.add.collider(self.submarino.imagen, self.destructor.imagen);

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
        if (self.submarino.armas === 1){
          self.submarino.armas = 1;
          console.log('Solo Torpedos a esta profundidad');
        }else{
          self.submarino.armas = 1;
          console.log('Solo Torpedos a esta profundidad');
        }  
      }else if(self.submarino.profundidad === 2){
        //si esta en profundidad 2 que no pueda disparar
        self.submarino.armas = -1;
      }  
    });
      
    }
    
    // Genero todo lo relacionado a la imagen del submarino del equipo enemigo
    function generarSubmarinoEnemigo(){
      self.submarino.imagen = self.physics.add.image(0,0, 'uboot')
      .setDisplaySize(100,50)
      .setDepth(5) // Seteo tamaño y profundidad de la imagen
      .setPushable(false)
      
      // Particulas
      const particles = self.add.particles("Blue").setDepth(2) // Imagen Blue como particula
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
      posX = Math.floor((Math.random()*((frameW*0.2)- margenCostaX))+margenCostaX); // El margen x para generarse los cargueros sera desde la costa (810) hasta el 20% del total del mapa
      posY = Math.floor((Math.random()*((frameH-400)- margenCostaY))+margenCostaY); // El margen y para generarse los cargueros sera el (total - 400) de la parte de arriba y de abajo del mapa    

      // Actualizo la posicion x e de todos los cargueros en base a la posicion inicial del carguero principal
      self.carguero1.posX = posX;
      self.carguero1.posY = posY;
      self.carguero2.posX = posX+600;
      self.carguero2.posY = posY+240
      self.carguero3.posX = posX+50
      self.carguero3.posY = posY+370;
      self.carguero4.posX = posX-270;
      self.carguero4.posY = posY+150;
      self.carguero5.posX = posX+300;
      self.carguero5.posY = posY-150;
      self.carguero6.posX = posX+180;
      self.carguero6.posY = posY+150;

      // Inserto los objetos cargueros en un array de cargueros para poder crear sus imagenes en un for
      arrayCargueros[0] = self.carguero1;
      arrayCargueros[1] = self.carguero2;
      arrayCargueros[2] = self.carguero3;
      arrayCargueros[3] = self.carguero4;
      arrayCargueros[4] = self.carguero5;
      arrayCargueros[5] = self.carguero6;

      // Genero las imagenes de los cargueros, colisiones, particulas, etc
      arrayCargueros.forEach(function(carguero){
        carguero.imagen = self.physics.add.image(carguero.posX, carguero.posY, 'carguero').setDisplaySize(200, 75).setDepth(5); // Seteo tamaño y profundidad de la imagen

        // Particulas
        const particles = self.add.particles("Blue").setDepth(2) // Imagen Blue como particula
        const emitter = particles.createEmitter({ // Funcion emitter de phaser para emitir varias particulas
          speed: 10, // Velocidad con la que se mueven
          scale: {start: 0.08, end: 0}, // Tamaño
          blendMode: "ADD" // Efecto a aplicar
        })
        particles.setPosition(0, -11)
        emitter.startFollow(carguero.imagen) // Le indicamos que sigan al destructor

        // Lo vuelvo inamovible
        carguero.imagen.setImmovable(true);
        carguero.imagen.setCollideWorldBounds(true); // Colisiones con el fin del mapa
        // Se crea una colision de los cargueros con la lisa isla
        self.physics.add.collider(carguero.imagen, self.isla1); 
        self.physics.add.collider(carguero.imagen, self.isla2); 
        self.physics.add.collider(carguero.imagen, self.isla3); 
        self.physics.add.collider(carguero.imagen, self.isla4); 
        // Se crea una colision del carguero con la bomba
        self.physics.add.collider(carguero.imagen, self.bomb);
        // Se crea una colision del carguero con la costa1
        self.physics.add.collider(self.carguero1.imagen, self.costa1);
        // Se crea una colision del carguero con la costa2
        self.physics.add.collider(carguero.imagen, self.costa2);
        // Se crea la colision con el submarino y el destructor
        self.physics.add.collider(self.carguero1.imagen, self.destructor.imagen);
        self.physics.add.collider(self.carguero1.imagen, self.submarino.imagen);
      })
    };

    // Funcion para generarle las imagenes y las particulas a cada carguero estando en el equipo del submarino
    function generarCarguerosEnemigos(){
      // Particulas
      const particles = self.add.particles("Blue").setDepth(2) // Imagen Blue como particula
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

      self.carguero1.imagen = self.physics.add.image(self.carguero1.posX, self.carguero1.posY, 'carguero').setDisplaySize(200, 75).setDepth(5);
      self.carguero2.imagen = self.physics.add.image(self.carguero2.posX, self.carguero2.posY, 'carguero').setDisplaySize(200, 75).setDepth(5);
      self.carguero3.imagen = self.physics.add.image(self.carguero3.posX, self.carguero3.posY, 'carguero').setDisplaySize(200, 75).setDepth(5);
      self.carguero4.imagen = self.physics.add.image(self.carguero4.posX, self.carguero4.posY, 'carguero').setDisplaySize(200, 75).setDepth(5);
      self.carguero5.imagen = self.physics.add.image(self.carguero5.posX, self.carguero5.posY, 'carguero').setDisplaySize(200, 75).setDepth(5);
      self.carguero6.imagen = self.physics.add.image(self.carguero6.posX, self.carguero6.posY, 'carguero').setDisplaySize(200, 75).setDepth(5);

      self.physics.add.collider(self.submarino.imagen, self.carguero1.imagen);
      self.physics.add.collider(self.destructor.imagen, self.carguero1.imagen);
    };


    // SETEOS DE PROFUNDIDAD:
    // funcion que al presionar la tecla Q, el submarino baja, si bajas a nivel 1 podes disparar solo torpedos, en nivel 2 nada
    self.input.keyboard.on('keydown-' + 'Q', function (event){
      // Pase de nivel 0 a 1, seteo armas en 4 (que es exclusivamente torpedos) y emito al socket para que el otro jugador
      // vea mi cambio de profundidad
      if (self.submarino.profundidad == 0){
        self.submarino.profundidad = 1;
        self.submarino.imagen.setTexture('UbootProfundidad1');
        self.submarino.armas = 4;
        console.log('baje a poca profundidad');
        self.socket.emit('playerProf', {Pr: self.submarino.profundidad});

        // Seteo la velocidad del submarino para que cuando este a baja profundidad se mueva a velocidad media
        self.submarino.velocidad = 160; 
      }else if (self.submarino.profundidad == 1){
        // Pase de nivel 0 a 1, seteo armas en -1 (sin armas) y emito al socket para que el otro jugador
        // vea mi cambio de profundidad
        self.submarino.profundidad = 2;
        self.submarino.armas = -1;
        self.submarino.imagen.setTexture('UbootProfundidad2');
        console.log('baje al mucha profundidad');
        self.socket.emit('playerProf', {Pr: self.submarino.profundidad});
      }       
      self.physics.world.removeCollider(self.colliderSub); 

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

    //funcion que al precionar la tecla E, el submarino sube
    self.input.keyboard.on('keydown-' + 'E', function (event){
      // Idem anteriores pero subiendo de 1 a 0
      if (self.submarino.profundidad == 1){
        self.submarino.profundidad = 0;
        self.submarino.armas = 0;
        console.log('subi a la superficie');
        self.submarino.imagen.setTexture('uboot');
        self.socket.emit('playerProf', {Pr: self.submarino.profundidad});
      } else if (self.submarino.profundidad == 2){
        // Idem anteriores pero subiendo de 0 a 1
        self.submarino.profundidad = 1;
        self.submarino.armas = 4;
        self.submarino.imagen.setTexture('UbootProfundidad1');
        console.log('subi a poca profundidad');
        self.socket.emit('playerProf', {Pr: self.submarino.profundidad});
      }
      if(self.submarino.profundidad === 0){
        self.colliderSub = self.physics.add.collider(self.submarino.imagen, self.destructor.imagen);
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

    //funcion que al precionar la tecla V, cambia la profundidad de las cargas de profundidad del destructor
    self.input.keyboard.on('keydown-' + 'V', function (event){
     if(self.destructor.cargas === 1){
       self.destructor.cargas = 2;
       console.log('detonador para mucha profundidad');
     }else{
       self.destructor.cargas = 1;
       console.log('detonador para poca profundidad');
     }
    });

    //funcion que recibe un click y ejecuta el evento disparo, el cual activa una bala del set de balas de la clase
    this.input.on('pointerdown', function (pointer, time) {
      if(self.equipo === 1){
        //si sos del equipo 1 sos el destructor, entonces genera el bullet desde destructor
        bullet = self.destructor.bullet.get().setActive(true).setVisible(true).setDisplaySize(10,10);
        //llamo al metodo de disparo y le paso las balas, el jugador que hace el disparo, la mira del jugador y el enemigo
        Disparo(self.destructor.imagen, bullet, self.destructor.reticula, self.submarino.imagen);
      }else{
        //si sos del equipo 1 sos el destructor, entonces genera el bullet desde destructor
        bullet = self.submarino.bullet.get().setActive(true).setVisible(true).setDisplaySize(10,10);
        //llamo al metodo de disparo y le paso las balas, el jugador que hace el disparo, la mira del jugador y el enemigo
        Disparo(self.submarino.imagen, bullet, self.submarino.reticula, self.destructor.imagen);
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
      /*if(self.destructor.cargas != self.submarino.profundidad){
        bullet.destroy();
      }*/
    }, this);


    //FUNCION DE DISPARO DEL JUGADOR
    function Disparo(player, bullet, reticula, enemyImag){
      if (bullet){
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
          self.physics.add.collider(bullet, enemyImag, function(bullet){
            bullet.destroy();
            handleHit(enemyImag);
          });
      }
    }
    //funcion que maneja el dano hecho por cada vez que se lanza el evento disparo del click, segun el tipo de arma es el dano hecho
    //el dano luego es enviado por socket al otro jugador. Tambien realiza la gestion de vida del oponente - danio para poder
    //mostrar que estamos haciendole danio al otro jugador y que muere.
    function handleHit(enemy){
         
      if(self.equipo === 1){
          //seteo del arma canion del Destructor
          if(self.destructor.armas === 0 && self.submarino.profundidad === 0){
              hitted(enemy.x, enemy.y); 
              danio = 5;
              damAcuD = damAcuD + danio;              
              self.socket.emit('playerHit', {Dam: danio});
              console.log('danio al enemigo', danio);
              if(damAcuD >= self.submarino.vida){
                destroyed(self.submarino.imagen);
                self.submarino.imagen.setActive(false);
                self.submarino.imagen.setVisible(false);
              }
            //seteo del arma carga de profundidad del Destructor
          }else if (self.destructor.armas === 1){
              if(self.destructor.cargas === self.submarino.profundidad){
                danio = 3;
                console.log('danio al enemigo', danio);
                hitted(enemy.x, enemy.y); 
                self.socket.emit('playerHit', {Dam: danio});
              }else{
                danio = 0;
                console.log('danio al enemigo', danio);
              }  
              damAcuD = damAcuD + danio;              
              if(damAcuD >= self.submarino.vida){
                destroyed(self.submarino.imagen);
                self.submarino.imagen.setActive(false);
                self.submarino.imagen.setVisible(false);
              }
          }
      }else{
        if(self.submarino.armas === 0){
          hitted(enemy.x, enemy.y); 
          danio = 1;
          damAcuS = damAcuS + danio;
          console.log('danio al enemigo', danio);              
          self.socket.emit('playerHit', {Dam: danio});
          if(damAcuS >= self.destructor.vida){
            destroyed(self.destructor.imagen);
            self.destructor.imagen.setActive(false);
            self.destructor.imagen.setVisible(false);
          }
        }else if (self.submarino.armas === 1 || self.submarino.armas === 4){
          hitted(enemy.x, enemy.y); 
          danio = 4;
          damAcuS = damAcuS + danio;
          console.log('danio al enemigo', danio);                            
          self.socket.emit('playerHit', {Dam: danio});
          if(damAcuS >= self.destructor.vida){
            destroyed(self.destructor.imagen);
            self.destructor.imagen.setActive(false);
            self.destructor.imagen.setVisible(false);
          }
        }
        
      }
    }
    //funcion que muestra la explosion en la posicion determinada
    function hitted(x, y){
      self.explotion2 = self.add.sprite(x,y,'explot').setDisplaySize(100, 100).setDepth(5);  //se crea el sprite de explosiones
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
      self.explotion3 = self.add.sprite(playerIMG.x ,playerIMG.y ,'explot').setDisplaySize(100, 100).setDepth(5);  //se crea el sprite de explosiones
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
    function RecibeHit(player, playerIMG, damage){
      hitted(playerIMG.x, playerIMG.y);
      //aca van las funciones de acierto
      if(player.vida > 0){
        console.log('Vida Restante', player.vida);
        player.vida = player.vida - damage;
        
        console.log('Vida Restante', player.vida);
      }
      if(player.vida <= 0){
        console.log('vida menor que 0');
        destroyed(playerIMG);
        playerIMG.setActive(false);
        playerIMG.setVisible(false);
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
          distMax = 250;
          if ((self.destructor.reticula.x - self.destructor.imagen.x) > distMax)
              self.destructor.reticula.x = self.destructor.imagen.x +distMax;
            else if (self.destructor.reticula.x - self.destructor.imagen.x < -distMax)
              self.destructor.reticula.x = self.destructor.imagen.x -distMax;
            if (self.destructor.reticula.y - self.destructor.imagen.y > distMax)
              self.destructor.reticula.y = self.destructor.imagen.y +distMax;
            else if (self.destructor.reticula.y - self.destructor.imagen.y < -distMax)
              self.destructor.reticula.y = self.destructor.imagen.y-distMax;
        }else{
          distMax = 80;
          if ((self.destructor.reticula.x - self.destructor.imagen.x) > distMax)
              self.destructor.reticula.x = self.destructor.imagen.x +distMax;
            else if (self.destructor.reticula.x - self.destructor.imagen.x < -distMax)
              self.destructor.reticula.x = self.destructor.imagen.x -distMax;
            if (self.destructor.reticula.y - self.destructor.imagen.y > distMax)
              self.destructor.reticula.y = self.destructor.imagen.y +distMax;
            else if (self.destructor.reticula.y - self.destructor.imagen.y < -distMax)
              self.destructor.reticula.y = self.destructor.imagen.y-distMax;
        }
      }else{
    //maneja la mira del submarino con el cursor
        if (this.input.mouse.locked){
          self.submarino.reticula.x += pointer.movementX;
          self.submarino.reticula.y += pointer.movementY;
        }
        if(self.submarino.armas === 0){
          distMax = 300;
          if ((self.submarino.reticula.x - self.submarino.imagen.x) > distMax)
              self.submarino.reticula.x = self.submarino.imagen.x +distMax;
            else if (self.submarino.reticula.x - self.submarino.imagen.x < -distMax)
              self.submarino.reticula.x = self.submarino.imagen.x -distMax;
            if (self.submarino.reticula.y - self.submarino.imagen.y > distMax)
              self.submarino.reticula.y = self.submarino.imagen.y +distMax;
            else if (self.submarino.reticula.y - self.submarino.imagen.y < -distMax)
              self.submarino.reticula.y = self.submarino.imagen.y-distMax;
        }else if(self.submarino.armas === 1 || self.submarino.armas === 4){
          distMax = 150;
            if ((self.submarino.reticula.x - self.submarino.imagen.x) > distMax)
                self.submarino.reticula.x = self.submarino.imagen.x +distMax;
              else if (self.submarino.reticula.x - self.submarino.imagen.x < -distMax)
                self.submarino.reticula.x = self.submarino.imagen.x -distMax;
              if (self.submarino.reticula.y - self.submarino.imagen.y > distMax)
                self.submarino.reticula.y = self.submarino.imagen.y +distMax;
              else if (self.submarino.reticula.y - self.submarino.imagen.y < -distMax)
                self.submarino.reticula.y = self.submarino.imagen.y-distMax; 
        } 
      }
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
    this.socket.on('playerHitted', function(playerInfo){      
      //if(self.socket.id === playerInfo.id){
        if(self.equipo===1){
            //hitted(self.destructor.imagen.x, self.destructor.imagen.x);
            RecibeHit(self.destructor, self.destructor.imagen, playerInfo.damage);
        }else{
            //hitted(self.submarino.imagen.x, self.submarino.imagen.y);
            RecibeHit(self.submarino, self.submarino.imagen, playerInfo.damage);
        }
      //}
    }); 

    this.socket.on('playerUnder', function(playerInfo){      
      self.submarino.profundidad = playerInfo.deep;
      //if(self.socket.id == playerInfo.id){
        if(self.equipo===1){
          if (self.submarino.profundidad === 1){
            self.submarino.imagen.setTexture('UbootProfundidad2').setVisible(true);
            console.log('bajo a poca profundidad');
          }else if (self.submarino.profundidad == 2){
            self.submarino.imagen.setVisible(false);
             console.log('bajo a mucha profundidad');
         }else{
            console.log('superficie');
            self.submarino.imagen.setTexture('uboot').setVisible(true);;
         }
        }
      if(self.submarino.profundidad === 0){
        self.colliderSub = self.physics.add.collider(self.submarino.imagen, self.destructor.imagen);
      }
      else{
        self.physics.world.removeCollider(self.colliderSub);
      }
    }); 

    // Metodo que cambia de camara con el carguero central de la formacion
    function cambioCamaraCargueros(camara){
      if(camara==0){
        self.cameras.main.startFollow(self.destructor.imagen,true, 0.09, 0.09); 
        self.cameras.main.setZoom(0.9);
      }else if(camara==1){
        self.cameras.main.startFollow(self.carguero1.imagen,true, 0.09, 0.09); 
        self.cameras.main.setZoom(1.4);
      }
    }
  }

  // Función update, se refresca constantemente para ir dibujando los distintos cambios que sucedan en la escena, aqui se agrega todo lo que se desea que se actualice y refleje graficamente
  update(time, delta) {
    if(this.equipo === 1){
      // Agregamos el movimiento de los barcos con las flechas de direccion y seteamos la velocidad de rotacion de giro del destructor
      if (this.destructor){
        if (this.cursors.left.isDown && (this.cursors.up.isDown || this.cursors.down.isDown)) {
          this.destructor.imagen.setAngularVelocity(-100)
        } else if (this.cursors.right.isDown && (this.cursors.up.isDown || this.cursors.down.isDown)) {
          this.destructor.imagen.setAngularVelocity(100)
        } else {
          this.destructor.imagen.setAngularVelocity(0) // Si no se esta apretando la tecla de arriba o abajo la velocidad de rotacion y de giro es 0
        }
       
        // Calculo y seteo la velocidad de los barcos y el angulo de rotacion como una constante
        const velX = Math.cos((this.destructor.imagen.angle - 360) * 0.01745)
        const velY = Math.sin((this.destructor.imagen.angle - 360) * 0.01745)
        // Seteo la velocidad de movimiento
        if (this.cursors.up.isDown) {
          this.destructor.imagen.setVelocityX(this.destructor.velocidad * velX)
          this.destructor.imagen.setVelocityY(this.destructor.velocidad  * velY)
        } else if (this.cursors.down.isDown) {
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
        if (this.left.isDown && (this.up.isDown || this.down.isDown)) {
          this.carguero1.imagen.setAngularVelocity(-100)
          this.carguero2.imagen.setAngularVelocity(-100)
          this.carguero3.imagen.setAngularVelocity(-100)
          this.carguero4.imagen.setAngularVelocity(-100)
          this.carguero5.imagen.setAngularVelocity(-100)
          this.carguero6.imagen.setAngularVelocity(-100)
        } else if (this.right.isDown && (this.up.isDown || this.down.isDown)) {
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
        if (this.up.isDown) {
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
        } else if (this.down.isDown) {
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

        /*
        let i;
        for(i=1;i<5;i++){
          let oldPosition = {}
          console.log("i: "+i);
          // Comparo la posicion y rotacion actual de los cargueros, y en caso de que haya cambiado envio el evento "carguerosMovement" al socket para comunicar a todos los clientes
          var x = self.arrayCargueros[i].imagen.x;
          var y = self.arrayCargueros[i].imagen.y;
          var r = self.arrayCargueros[i].imagen.rotation;
          if (oldPosition && (x !== oldPosition.x || y !== oldPosition.y || r !== oldPosition.rotation)){
            let data = {
              x: self.arrayCargueros[i].imagen.x,
              y: self.arrayCargueros[i].imagen.y,
              rotation: self.arrayCargueros[i].imagen.rotation, 
              carguero: i
            }
            this.socket.emit('carguerosMovement', data);
          }

          // Guardo la posicion actual del barco para comparar con la nueva y chequear si hubo movimiento
          oldPosition = {
            x: self.arrayCargueros[i].imagen.x,
            y: self.arrayCargueros[i].imagen.y,
            rotation: self.arrayCargueros[i].imagen.rotation
          }
        }        
        */
  
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
        // Seteo velocidad de rotacion y giro
        if (this.cursors.left.isDown && (this.cursors.up.isDown || this.cursors.down.isDown)) {
          this.submarino.imagen.setAngularVelocity(-100)
        } else if (this.cursors.right.isDown && (this.cursors.up.isDown || this.cursors.down.isDown)) {
          this.submarino.imagen.setAngularVelocity(100)
        } else {
          this.submarino.imagen.setAngularVelocity(0) // Si no se esta apretando la tecla de arriba o abajo la velocidad de rotacion y de giro es 0
        }

        let oldPosition = {}
        // Calculo y seteo la velocidad de los barcos y el angulo de rotacion como una constante
        const velX = Math.cos((this.submarino.imagen.angle - 360) * 0.01745)
        const velY = Math.sin((this.submarino.imagen.angle - 360) * 0.01745)
        // Seteo velocidad de movimiento
        if (this.cursors.up.isDown) {
          this.submarino.imagen.setVelocityX(this.submarino.velocidad  * velX)
          this.submarino.imagen.setVelocityY(this.submarino.velocidad * velY)
        } else if (this.cursors.down.isDown) {
          this.submarino.imagen.setVelocityX(-(this.submarino.velocidad/2) * velX)
          this.submarino.imagen.setVelocityY(-(this.submarino.velocidad/2) * velY)
        } else {
          this.submarino.imagen.setAcceleration(0)
        }

        // Comparo la posicion y rotacion actual del barco, y en caso de que haya cambiado envio el evento "playerMovement" al socket para comunicar a todos los clientes
        var x = this.submarino.imagen.x;
        var y = this.submarino.imagen.y;
        var r = this.submarino.imagen.rotation;

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
    
    // Se intentan leer por teclado las letras M y U para mutear y desmutear la musica
    if (this.KeyMute.isDown){
      console.log('Muteo audio')
      //this.sound.stop();
    }
    if (this.KeyUnmute.isDown){
      console.log('Desmuteo audio')
      //this.sound.play();
      //this.sound.add('Music').play();
    }
  }
}