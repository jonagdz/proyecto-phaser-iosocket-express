import { Bote } from '../logica/bote.js';
import { Bullets } from '../logica/bullet.js';
import { Carguero } from '../logica/carguero.js';
//import { io } from "/socket.io/socket.io-client";
//var io = require("socket.io")(server);

export class game extends Phaser.Scene{
  constructor(){
    super("game");
  }

  // Creo todo el contenido del juego del juego, imagenes, los cursores, jugadores, barcos e implemento el WebSocket
  create(){
    var self = this
    // Declaro Socket
    this.socket = io()

    // Jugadores y equipos - DE PRUEBA
    let jugador1Equipo = "EQUIPO_CARGUERO";
    let jugador2Equipo = "EQUIPO_SUBMARINO";

    // Grupo para los cargueros y balas
    const carguerosArre = [];
    this.grupoCargueros = this.physics.add.group({ classType: Carguero, runChildUpdate: true });
    this.playerBullets = this.physics.add.group({ classType: Bullets, runChildUpdate: true });

    // Cargo la imagen de fondo del mapa
    this.mar = this.add.image(0, 0, 'mar').setOrigin(0).setScrollFactor(1); 
    const backgroundW = this.mar.width;
    const backgroundH = this.mar.height;

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
    this.cameras.main.setBounds(0, 0, backgroundW, backgroundH);
    this.physics.world.setBounds(0, 0, backgroundW, backgroundH);

    //this.otherPlayer;
    
    // Islas
    this.isla1 = self.physics.add.image(2100,900,'island1').setDepth(5);
    this.isla1.setImmovable(true);
    this.isla1.setDisplaySize(400, 400);
    this.isla2 = self.physics.add.image(2460,1600,'island1').setDepth(5);
    this.isla2.setImmovable(true);
    this.isla2.setDisplaySize(400, 400);
    this.isla3 = self.physics.add.image(3200,600,'island1').setDepth(5);
    this.isla3.setImmovable(true);
    this.isla3.setDisplaySize(400, 400);
    this.isla4 = self.physics.add.image(3400,1800,'island1').setDepth(5);
    this.isla4.setImmovable(true);
    this.isla4.setDisplaySize(400, 400);

    // Costas
    this.costa1 = self.physics.add.image(345,1082,'costa1').setDepth(5);;
    this.costa1.setImmovable(true);
    this.costa2 = self.physics.add.image(4115,1082,'costa2').setDepth(5);;
    this.costa2.setImmovable(true);

    /*// Bomba marítima
    this.bomb = self.physics.add.image(1430,1200,'bomba').setDisplaySize(50, 40).setDepth(5);  
    this.bomb.setImmovable(true); 
*/
    // Musica
    //var sound = this.sound.add('Music');
    //sound.play();
    //this.sound.pauseOnBlur = false;  // Para que se escuche fuera del navegador

    // Introduzco cursores y teclas utilizables
    this.cursors = this.input.keyboard.createCursorKeys()
    this.KeyCamera  =this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
    this.KeyMute  =this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    this.KeyUnmute  =this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);
    this.up  =this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.left  =this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.down  =this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.right  =this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    //AGREGAMOS LA RETICULA EN UNA POSICION INICIAL
    this.reticula = this.physics.add.sprite(400, 400, 'crosshair').setCollideWorldBounds(true);
    //AQUI CAMBIAMOS LA VARIABLE DE ARMAMENTO
    var Fierro = 0;    
    this.input.keyboard.on('keydown-' + 'Z', function (event){
      if (Fierro === 0){
        Fierro = 1;
      }else{
        Fierro = 0;
      }
    });
    //CUANDO SE HAGA EL INPUT DE CLICK, ACTIVA LA VISIBILIDAD Y ACTIVIDAD DE LAS BALAS DESDE EL BARCO A LA RETICULA
    this.input.on('pointerdown', function (pointer, time) {
      // SACA UNA BALA DEL GRUPO DE BALAS Y LA HACE VISIBLE Y ACTIVA
      var bullet = this.playerBullets.get().setActive(true).setVisible(true);
      corchazo(bullet, Fierro);
    }, this);
    
    
    function corchazo(bullet, Fierro){
      console.log(Fierro);
      if (bullet){
          bullet.fire(self.barco, self.reticula); //LLAMA AL METODO DISPARAR DE BULLET
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
          self.physics.add.collider(bullet, self.reticula, function(bullet){
            bullet.destroy();
          });
          //MANEJO DE COLISION ENTRE LA BALA Y OTROS JUGADORES
          self.physics.add.collider(bullet, self.otherPlayer, function(bullet){
            bullet.destroy();
            var bala = true;
            handleHit(self.otherPlayer, bala);
          });
      }
    }
    var Vida = 8;
    function handleHit(data, balazo){
      if(balazo){
        hitted(self.otherPlayer.x, self.otherPlayer.y);
        EvaluacionDano(Fierro, self.otherPlayer, self.otherPlayer.x, self.otherPlayer.y);
        self.socket.emit('playerHit', {id: self.otherPlayer.playerId});
        //this.cameras.main.shake(500);
      }
    }
    
    //FUNCION QUE EVALUA EL DANO
    function EvaluacionDano(Fierro, player, x, y){
      //Life(self.Vida);
      //SI EL ARMA ES EL CANON
      
      if(Fierro == 0){
        if(Vida > 0){
          Vida = Vida - 1;
          console.log("impacto", Vida);
        }
        if(Vida === 0){
          destroyed(player, x, y);
        }
      }else if (Fierro == 1){
        if(Vida > 0){
          Vida = Vida - 3;
          console.log("impacto", Vida);
        }
        if(Vida <= 0){
          destroyed(player, x, y);
        }
      }
    }
    //EN ESTA FUNCION CARGAMOS LOS PUNTOS DE VIDA PARA EL CARGUERO, SUBMARINO y DESTRUCTOR
    /*function Life(Vida){
      //UNA VEZ DIFERENCIADOS LOS TIPOS DE NAVIOS, PREGUNTAMOS CON UN IF O UN SWITCH, DEPENDIENDO DE QUE SEA, LOS PUNTOS DE VIDA
      //QUE LE CORRESPONDEN, POR AHORA USAREMOS ALGO GENERICO
      Vida = 8;
    }*/
    //FUNCION QUE MUESTRA AL JUGADOR QUE DANO AL OTRO
    function SeeHit(player, x, y){
      hitted(x, y);
      EvaluacionDano(Fierro, player, x, y);
    }
    //FUNCION QUE MUESTRA LA DESTRUCCION DE UN JUGADOR
    function destroyed(player, x, y){
        self.explotion3 = self.add.sprite(x,y,'explot').setDisplaySize(100, 100).setDepth(5);  //se crea el sprite de explosiones
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
        hideOnComplete: true,
        
        });
        self.explotion3.play('explot3');
        player.destroy();
    }

    // TOMA EL MOVIMIENTO DEL CURSOR Y LO TRANSFORMA EN UN INPUT PARA MVOER LA RETICULA ACORDE AL PUNTERO
    this.input.on('pointermove', function (pointer) {
      if (this.input.mouse.locked){
        this.reticula.x += pointer.movementX;
        this.reticula.y += pointer.movementY;
        }
        var distX = this.reticula.x-this.barco.x; // X distance between player & reticle
        var distY = this.reticula.y-this.barco.y; // Y distance between player & reticle

        //AQUI PREGUNTAMOS QUE TIPO DE ARMA ES, 0 es PARA CANON, 1 PARA CARGAS DE PROFUNDIDAD
        //VAMOS A EXTENDER ESTO UNA VEZ TENGAMOS IMPLEMENTADA LA DIFERENCIACION ENTRE NAVIOS, CON LAS ARMAS DEL SUBMARINO
        if(Fierro == 0){
          //Esto asegura los limites de la mira, el entorno de movimiento 
          // La mira cambia de rango si se apreta un boton
          if (distX > 200)
              this.reticula.x = this.barco.x+200;
          else if (distX < -200)
              this.reticula.x = this.barco.x-200;
          if (distY > 200)
              this.reticula.y = this.barco.y+200;
          else if (distY < -200)
              this.reticula.y = this.barco.y-200;
       }else{
          if (distX > 50)
              this.reticula.x = this.barco.x+50;
          else if (distX < -50)
              this.reticula.x = this.barco.x-50;
          if (distY > 50)
              this.reticula.y = this.barco.y+50;
          else if (distY < -50)
              this.reticula.y = this.barco.y-50;
        }
    }, this);
  
    // Creo función para agregar al jugador, por defecto seteo que inician todos arriba a la izquierda y les asigno la imagen del submarino uboot
    function addPlayer(self, playerInfo) {
      console.log("JE1: "+jugador1Equipo);
      console.log('x:'+playerInfo.x +' y:'+ playerInfo.y + ' destructor');

      if(jugador1Equipo === "EQUIPO_CARGUERO"){ 
        self.barco = self.physics.add.image(playerInfo.x, playerInfo.y, 'destroyer')
        .setOrigin(0.5, 0.5) // Posición de inicio
        .setDisplaySize(200, 100) // Tamaño
        .setDepth(5) // Seteo de la posicion (como las capas de photoshop)

        self.barco.setCollideWorldBounds(true) // Colisiones con el fin del mapa
        self.barco.setDrag(1000) // Es la velocidad de desaceleracion con el tiempo cuando se deja de mover un jugador

        // Particulas
        const particles = self.add.particles("Blue").setDepth(-1) // Imagen Blue como particula
        const emitter = particles.createEmitter({ // Funcion emitter de phaser para emitir varias particulas
          speed: 10, // Velocidad con la que se mueven
          scale: {start: 0.08, end: 0}, // Tamaño
          blendMode: "ADD" // Efecto a aplicar
        })
        particles.setPosition(0, -11)
        emitter.startFollow(self.barco) // Le indicamos que sigan al objeto barco.

        // Se indica que la camara siga al componente barco
        self.cameras.main.startFollow(self.barco,true, 0.09, 0.09); 
        // Zoom de la cámara
        self.cameras.main.setZoom(0.9);
        // Se crea una colision del barco con las islas
        self.physics.add.collider(self.barco, self.isla1); 
        self.physics.add.collider(self.barco, self.isla2); 
        self.physics.add.collider(self.barco, self.isla3); 
        self.physics.add.collider(self.barco, self.isla4); 
        // Se crea una colision del barco con la bomba
        self.physics.add.collider(self.barco, self.bomb);
        // Se crea una colision del barco con los cargueros
        self.physics.add.collider(self.barco, self.grupoCargueros);
        self.physics.add.collider(self.barco, self.carguero);
        // Se crea una colision del barco con la costa1
        self.physics.add.collider(self.barco, self.costa1);
        // Se crea una colision del barco con la costa2
        self.physics.add.collider(self.barco, self.costa2);
      }else{
        self.barco = self.physics.add.image(playerInfo.x, playerInfo.y, 'destroyer')
        .setOrigin(0.5, 0.5) // Posición de inicio
        .setDisplaySize(200, 100) // Tamaño
        .setDepth(5) // Seteo de la posicion (como las capas de photoshop)

        self.barco.setCollideWorldBounds(true) // Colisiones con el fin del mapa
        self.barco.setDrag(1000) // Es la velocidad de desaceleracion con el tiempo cuando se deja de mover un jugador
        
        // Particulas
        const particles = self.add.particles("Blue").setDepth(-1) // Imagen Blue como particula
        const emitter = particles.createEmitter({ // Funcion emitter de phaser para emitir varias particulas
          speed: 10, // Velocidad con la que se mueven
          scale: {start: 0.08, end: 0}, // Tamaño
          blendMode: "ADD" // Efecto a aplicar
        })
        particles.setPosition(0, -11)
        emitter.startFollow(self.barco) // Le indicamos que sigan al objeto barco.

        // Se indica que la camara siga al componente barco
        self.cameras.main.startFollow(self.barco,true, 0.09, 0.09); 
        // Zoom de la cámara
        self.cameras.main.setZoom(0.9);
        // Se crea una colision del barco con la isla
        self.physics.add.collider(self.barco, self.isla1); 
        self.physics.add.collider(self.barco, self.isla2); 
        self.physics.add.collider(self.barco, self.isla3); 
        self.physics.add.collider(self.barco, self.isla4); 
        // Se crea una colision del barco con la bomba
        self.physics.add.collider(self.barco, self.bomb);
        // Se crea una colision del barco con los cargueros
        self.physics.add.collider(self.barco, self.grupoCargueros);
        self.physics.add.collider(self.barco, self.carguero);
        // Se crea una colision del barco con la costa1
        self.physics.add.collider(self.barco, self.costa1);
        // Se crea una colision del barco con la costa2
        self.physics.add.collider(self.barco, self.costa2);
      }
    }

    // Creo la funcion para agregar a otro jugador que no sea el propio y lo agrego a la lista/arreglo de otherPlayers con los mismos valores añadiendo la rotación
    function addOtherPlayers (self, playerInfo){
      if(jugador2Equipo === "EQUIPO_CARGUERO"){
        self.otherPlayer = self.physics.add.image(playerInfo.x, playerInfo.y, 'uboot')
          .setOrigin(0.5, 0.5)
          .setDisplaySize(100, 50)
          .setRotation(playerInfo.rotation)
        self.otherPlayer.playerId = playerInfo.playerId
      
        //self.otherPlayers.add(self.otherPlayer)

        // Particulas para los otros jugadores
        const particles = self.add.particles("Blue").setDepth(-1) // Imagen Blue como particula
        const emitter = particles.createEmitter({ // Funcion emitter de phaser para emitir varias particulas
          speed: 10, // Velocidad con la que se mueven
          scale: {start: 0.08, end: 0}, // Tamaño
          blendMode: "ADD" // Efecto a aplicar
        })
        particles.setPosition(0, -11)
        emitter.startFollow(self.barco) // Le indicamos que sigan al objeto barco.
      }else{
        self.otherPlayer = self.physics.add.image(playerInfo.x, playerInfo.y, 'uboot')
          .setOrigin(0.5, 0.5)
          .setDisplaySize(100, 50)
          .setRotation(playerInfo.rotation)
        self.otherPlayer.playerId = playerInfo.playerId

        // Particulas para los otros jugadores
        const particles = self.add.particles("Blue").setDepth(-1) // Imagen Blue como particula
        const emitter = particles.createEmitter({ // Funcion emitter de phaser para emitir varias particulas
          speed: 10, // Velocidad con la que se mueven
          scale: {start: 0.08, end: 0}, // Tamaño
          blendMode: "ADD" // Efecto a aplicar
        })
        particles.setPosition(0, -11)
        emitter.startFollow(self.barco) // Le indicamos que sigan al objeto barco.
      }
    }

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
      self.explotion2.play('explot2')

    }
    // GENERAR CARGUEROS
    this.socket.on('generarCarqueros', function (cargueros){
      cargueros.forEach(carguero => console.log('x:'+carguero.x +' y:'+ carguero.y + ' carguero'));
      cargueros.forEach(function(carguero){
        //var carguero = this.grupoCargueros.get()
        self.carguero = self.physics.add.image(carguero.x, carguero.y, 'carguero')
        .setOrigin(0.5, 0.5) // Seteo posicion de inicio
        .setDisplaySize(200, 75) // Seteo tamaño
        .setDepth(5) // seteo de la posicion (como las capas de photoshop)

        // Lo vuelvo inamovible
        self.carguero.setImmovable(true);
        self.carguero.setCollideWorldBounds(true) // Colisiones con el fin del mapa
        // Se crea una colision de los cargueros con la lisa isla
        self.physics.add.collider(self.carguero, self.isla1); 
        self.physics.add.collider(self.carguero, self.isla2); 
        self.physics.add.collider(self.carguero, self.isla3); 
        self.physics.add.collider(self.carguero, self.isla4); 
        // Se crea una colision del carguero con la bomba
        self.physics.add.collider(self.carguero, self.bomb);
        // Se crea una colision del carguero con los barcos
        self.physics.add.collider(self.carguero, self.barco);
        // Se crea una colision del carguero con la costa1
        self.physics.add.collider(self.carguero, self.costa1);
        // Se crea una colision del carguero con la costa2
        self.physics.add.collider(self.carguero, self.costa2);
        self.physics.add.collider(self.grupoCargueros, self.barco);
      })
    });

    // Cada vez que se instancie un socket desde un cliente chequea si es él mismo para añadir a ese propio jugador, o si se llama a la funcion para agregar un nuevo jugador
    this.socket.on('currentPlayers', function (players){
      Object.keys(players).forEach(function (id){
        if (players[id].playerId === self.socket.id){
          addPlayer(self, players[id]);
        } 
        else{
          addOtherPlayers(self, players[id]);
        }
      });
    });
    
    this.socket.on('newPlayer', function (playerInfo) {
      addOtherPlayers(self, playerInfo)
    });

    // Destruye a un jugador cuando se desconecta del socket
    this.socket.on('playerDisconnected', function (playerId) {
      //self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      console.log(playerId, self.otherPlayer);
      if(self.otherPlayer != undefined){  
      
        if (playerId === self.otherPlayer.playerId) {
          self.otherPlayer.destroy()
        }
      }
    });
    
    // Creo el evento de movimiento de cada jugador para comunicar a través del Socket
    this.socket.on('playerMoved', function (playerInfo) {
      //self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if(self.otherPlayer != undefined){  
          if (playerInfo.playerId === self.otherPlayer.playerId) {
            self.otherPlayer.setRotation(playerInfo.rotation)
            self.otherPlayer.setPosition(playerInfo.x, playerInfo.y)
          }
        }
    });
    
    this.socket.on('playerHitted', function(id){      
      console.log('ingreso a hitted', id, "my ID es:", self.socket.id);
      if(self.socket.id === id.id){
          console.log('Tocado');
          hitted(self.barco.x, self.barco.y);
          SeeHit(self.barco, self.barco.x, self.barco.y);
      }
    }); 
    
    // Metodo que cambia de camara con el carguero central de la formacion
    let camaraValor;
    function clickear(camaraValor){
      if(camaraValor==0){
        self.cameras.main.startFollow(self.barco,true, 0.09, 0.09); 
        self.cameras.main.setZoom(0.9);
      }else if(camaraValor==1){
        self.cameras.main.startFollow(self.carguero,true, 0.09, 0.09); 
        self.cameras.main.setZoom(1.4);
      }
    }
    const btnCamaraCarguero = this.add.text(600, 600, 'BOTON PARA CAMBIAR DE CAMARA CON LOS CARGUEROS', { fill: '#000000' }).setScrollFactor(0).setInteractive().on('pointerdown', () => clickear(1));
    const btnCamaraDestructor = this.add.text(600, 650, 'BOTON PARA CAMBIAR DE CAMARA CON EL DESTRUCTOR', { fill: '#000000' }).setScrollFactor(0).setInteractive().on('pointerdown', () => clickear(0));
}

  // Función update, se refresca constantemente para ir dibujando los distintos cambios que sucedan en la escena, aqui se agrega todo lo que se desea que se actualice y refleje graficamente
  update(time, delta) {
    // Agregamos el movimiento de los barcos con las flechas de direccion y seteamos la velocidad de rotacion de giro del barco
    if (this.barco) {
      if (this.cursors.left.isDown && (this.cursors.up.isDown || this.cursors.down.isDown)) {
        this.barco.setAngularVelocity(-100)
      } else if (this.cursors.right.isDown && (this.cursors.up.isDown || this.cursors.down.isDown)) {
        this.barco.setAngularVelocity(100)
      } else {
        this.barco.setAngularVelocity(0) // Si no se esta apretando la tecla de arriba o abajo la velocidad de rotacion y de giro es 0
      }

      // Calculo y seteo la velocidad de los barcos y el angulo de rotacion como una constante
      const velX = Math.cos((this.barco.angle - 360) * 0.01745)
      const velY = Math.sin((this.barco.angle - 360) * 0.01745)
      if (this.cursors.up.isDown) {
        this.barco.setVelocityX(200 * velX)
        this.barco.setVelocityY(200 * velY)
      } else if (this.cursors.down.isDown) {
        this.barco.setVelocityX(-100 * velX)
        this.barco.setVelocityY(-100 * velY)
      } else {
        this.barco.setAcceleration(0)
      }

      // Comparo la posicion y rotacion actual del barco, y en caso de que haya cambiado envio el evento "playerMovement" al socket para comunicar a todos los clientes
      var x = this.barco.x
      var y = this.barco.y
      var r = this.barco.rotation
      if (this.barco.oldPosition && (x !== this.barco.oldPosition.x || y !== this.barco.oldPosition.y || r !== this.barco.oldPosition.rotation)) {
        this.socket.emit('playerMovement', { x: this.barco.x, y: this.barco.y, rotation: this.barco.rotation })
      }

      // Guardo la posicion actual del barco para comparar con la nueva y chequear si hubo movimiento
      this.barco.oldPosition = {
        x: this.barco.x,
        y: this.barco.y,
        rotation: this.barco.rotation
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