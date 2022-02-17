import { Bote } from '../logica/bote.js';
import { Bullets } from '../logica/bullet.js';
//import { io } from "/socket.io/socket.io-client";
//var io = require("socket.io")(server);

export class game extends Phaser.Scene{
  constructor(){
      super("game");
      
  }
  
  // Creo todo el contenido del juego del juego en si, imagenes, los cursores, jugadores, barcos, implemento el WebSocket
   create(){
    var self = this
    this.socket = io()
    this.otherPlayers = this.physics.add.group()
    //this.barco = new Bote("Destructor",10,200,0.5,0.5,0); 
    var playerBullets = 0;
    playerBullets = this.physics.add.group({ classType: Bullets, runChildUpdate: true });
    // Pruebo la vision
    //this.barco.Vision;

    this.add.image(400, 300, 'mar').setDepth(-2); // Cargo la imagen de fondo del mapa

    //this.sound.add('Music').play();

    //ESTO GENERA UN EVENTO CUANDO SE HACE CLICK, SE HACE UN REQUEST AL NAVEGADOR PARA QUE LOCKEE EL MOUSE EN LOS LIMITES DEL CANVAS
    

    //AGREGAMOS LA RETICULA EN UNA POSICION INICIAL
  this.reticula = this.physics.add.sprite(400, 400, 'crosshair');
  //CUANDO SE HAGA EL INPUT DE CLICK, ACTIVA LA VISIBILIDAD Y ACTIVIDAD DE LAS BALAS DESDE EL BARCO A LA RETICULA
  this.input.on('pointerdown', function (pointer, time) {
     // SACA UNA BALA DEL GRUPO DE BALAS Y LA HACE VISIBLE Y ACTIVA
     var bullet = playerBullets.get().setActive(true).setVisible(true);
     if (bullet){
         bullet.fire(this.barco, this.reticula); //LLAMA AL METODO DISPARAR DE BULLET
     }
    }, this);
 
   // TOMA EL MOVIMIENTO DEL CURSOR Y LO TRANSFORMA EN UN INPUT PARA MVOER LA RETICULA ACORDE AL PUNTERO
  this.input.on('pointermove', function (pointer) {
       if (this.input.mouse.locked){
           this.reticula.x += pointer.movementX;
           this.reticula.y += pointer.movementY;
       }
   }, this);
 

    // Creo funcion para agregar al jugador, por defecto seteo que inician todos arriba a la izquierda y les asigno la imagen del submarino uboot
    function addPlayer(self, playerInfo) {
      self.barco = self.physics.add.image(playerInfo.x, playerInfo.y, 'uboot')
        .setOrigin(0.5, 0.5) // Seteo posicion de inicio
        .setDisplaySize(50, 50) // Seteo tamaño
        .setDepth(5) // seteo de la posicion (como las capas de photoshop)

      self.barco.setCollideWorldBounds(true) // Seteo colisiones con el fin del mapa
      self.barco.setDrag(1000) // Es la velocidad de desaceleracion con el tiempo cuando se deja de mover un jugador
      //PARTICULAS
      const particles = self.add.particles("Blue").setDepth(-1) //usamos la imagen Blue como particula
      const emitter = particles.createEmitter({ //utilizamos la funcion emitter de phaser para emitir varias particulas
        speed: 10, //velocidad con la que se mueven
        scale: {start: 0.08, end: 0}, //el tamano
        blendMode: "ADD" //el efecto a aplicar
      })
      particles.setPosition(0, -11)
      emitter.startFollow(self.barco) //aqui le indicamos que sigan al objeto barco.
    }
    // Creo la funcion para agregar a otro jugador que no sea el propio y lo agrego a la lista/arreglo de otherPlayers con los mismos valores añadiendo la rotacion
    function addOtherPlayers (self, playerInfo){
      const otherPlayer = self.physics.add.image(playerInfo.x, playerInfo.y, 'uboot')
        .setOrigin(0.5, 0.5)
        .setDisplaySize(50, 50)
        .setRotation(playerInfo.rotation)
        
      otherPlayer.playerId = playerInfo.playerId
      self.otherPlayers.add(otherPlayer)

      //PARTICULAS PARA LOS OTROS JUGADORES
      const particles = self.add.particles("Blue").setDepth(-1) //usamos la imagen Blue como particula
      const emitter = particles.createEmitter({ //utilizamos la funcion emitter de phaser para emitir varias particulas
        speed: 10, //velocidad con la que se mueven
        scale: {start: 0.08, end: 0}, //el tamano
        blendMode: "ADD" //el efecto a aplicar
      })
      particles.setPosition(0, -11)
      emitter.startFollow(otherPlayer) //aqui le indicamos que sigan al objeto barco.
    }

    // Cada vez que se instancie un socket desde un cliente chequea si es él mismo para añadir a ese propio jugador, o si se llama a la funcion para agregar un nuevo jugador
    this.socket.on('currentPlayers', function (players) 
    {
      Object.keys(players).forEach(function (id) {
        if (players[id].playerId === self.socket.id){
          addPlayer(self, players[id]);
        } 
        else{
          addOtherPlayers(self, players[id]);
        }
      });
    });

    //Las funciones de disparo, utilizando la biblioteca de fisicas ARCADE e IMAGE de Phaser

    this.socket.on('newPlayer', function (playerInfo) {
      addOtherPlayers(self, playerInfo)
    });

    this.socket.on('SaveData', function(playerInfo){
      guardarDatos(self, playerInfo);
    });

    // Destruye a un jugador cuando se desconecta del socket
    this.socket.on('playerDisconnected', function (playerId) {
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerId === otherPlayer.playerId) {
          otherPlayer.destroy()
        }
      });
    });

    // Genero el movimiento de los jugadores a través de las flechas direccionales
    this.cursors = this.input.keyboard.createCursorKeys()

    // Creo el evento de movimiento de cada jugador para comunicar a través del Socket
    this.socket.on('playerMoved', function (playerInfo) {
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerInfo.playerId === otherPlayer.playerId) {
          otherPlayer.setRotation(playerInfo.rotation)
          otherPlayer.setPosition(playerInfo.x, playerInfo.y)
        }
      })
    });
    // Disparo en input con pointerdown (que significa activa cuando hace click)
}

  // Funcion update, se refresca constantemente para ir dibujando los distintos cambios que sucedan en la escena, aqui se agrega todo lo que se desea que se actualice y refleje graficamente
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

            // Me guardo la posicion actual del barco para comparar con la nueva y chequear si hubo movimiento
      this.barco.oldPosition = {
        x: this.barco.x,
        y: this.barco.y,
        rotation: this.barco.rotation
      }

      // Pruebo la vision
      //if (this.vision){
      //  this.vision.x = this.barco.x
      //  this.vision.y = this.barco.y
      //}
    }
  //DISPAROOOOO

  /*
    this.input.on('pointermove', function (pointer) {
      angle = Phaser.Math.Angle.BetweenPoints(this.barco, pointer);
      this.barco.rotation = angle;
      Phaser.Geom.Line.SetToAngle(line, cannon.x, cannon.y - 50, angle, 128);
      gfx.clear().strokeLineShape(line);
    }, this);
    */
    
  }

  // Funcion para intentar guardar datos utilizando el boton guardar en nuevoJuego.html, la llamo desde alli y le paso la posicion actual del jugador para guardarla directo en la BD
  guardarDatos(self, playerInfo){
    this.socket.emit('guardarPartida', { x: this.barco.x, y: this.barco.y, rotation: this.barco.rotation })
    alert ("eje x: "+playerInfo.x);
  }
}