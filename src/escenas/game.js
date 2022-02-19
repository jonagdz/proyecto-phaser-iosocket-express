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
    //this.barco = new Bote("Destructor",10,200,0.5,0.5,0); 
    
    this.playerBullets = this.physics.add.group({ classType: Bullets, runChildUpdate: true });
    this.otherPlayer;


    // Pruebo la vision
    //this.barco.Vision;
    
    this.mar=this.add.image(0, 0, 'mar').setDepth(-2).setDisplaySize(6000,4000);; // Cargo la imagen de fondo del mapa
    this.physics.world.setBounds(0, 0, 3840, 2160);

    this.isla = self.physics.add.image(600,400,'island1').setDepth(5); //Cargo la isla
    this.isla.setImmovable(true);
    this.isla.setDisplaySize(400, 400);

    this.bomb = self.physics.add.image(800,800,'bomba').setDisplaySize(50, 40).setDepth(5);  //cargo la bomba maritima
    this.bomb.setImmovable(true);

    this.explotion2 = this.add.sprite(100,100,'explot').setDisplaySize(100, 100).setDepth(5);  //se crea el sprite de explosiones
    this.anims.create({  // Se crea la animacion para la explosion luego de recibir disparo
      key: 'explot2',
      frames: [
          { key: 'explot',frame:"PngItem_4145768_01_29.gif" },
          { key: 'explot',frame:"PngItem_4145768_01_30.gif" },
          { key: 'explot',frame:"PngItem_4145768_01_31.gif" },
          { key: 'explot',frame:"PngItem_4145768_01_32.gif" },
      ],
      frameRate: 5,
      repeat: -1
      
    });
    this.explotion2.play('explot2');
    this.explotion2.setActive(false);   //ponemos en false la activacion y visibilidad, para luego activarlas cuando suceda
    this.explotion2.setVisible(false);  //el evento destruccion de barco
    //this.sound.add('Music').play();
    
    //AGREGAMOS LA RETICULA EN UNA POSICION INICIAL
    this.reticula = this.physics.add.sprite(400, 400, 'crosshair').setCollideWorldBounds(true);
    //CUANDO SE HAGA EL INPUT DE CLICK, ACTIVA LA VISIBILIDAD Y ACTIVIDAD DE LAS BALAS DESDE EL BARCO A LA RETICULA
    this.input.on('pointerdown', function (pointer, time) {
      // SACA UNA BALA DEL GRUPO DE BALAS Y LA HACE VISIBLE Y ACTIVA
        var bullet = this.playerBullets.get().setActive(true).setVisible(true);
        if (bullet){
            bullet.fire(this.barco, this.reticula); //LLAMA AL METODO DISPARAR DE BULLET
            bullet.setCollideWorldBounds(true);
            bullet.body.onWorldBounds = true;
            bullet.body.world.on('worldbounds', function(body) {
              //COLISION CON LOS BORDES DEL MUNDO
              if (body.gameObject === this ) {
                this.setActive(false);
                this.setVisible(false);
              }
            }, bullet);
            
            //COLISION CON LA ISLA
            this.physics.add.collider(bullet, this.isla, function(bullet){
              bullet.destroy();
            });

            this.physics.add.collider(bullet, this.otherPlayer, function(bullet){
              bullet.destroy();
              handleHit(this.otherPlayer);
            });
        }
        
        
    }, this);
    
    function handleHit(data){
      console.log("impacto");
      self.socket.emit('playerHit', {id: self.otherPlayer.playerId});
    }
    

    // TOMA EL MOVIMIENTO DEL CURSOR Y LO TRANSFORMA EN UN INPUT PARA MVOER LA RETICULA ACORDE AL PUNTERO
    this.input.on('pointermove', function (pointer) {
        if (this.input.mouse.locked){
            this.reticula.x += pointer.movementX;
            this.reticula.y += pointer.movementY;
        }
        var distX = this.reticula.x-this.barco.x; // X distance between player & reticle
        var distY = this.reticula.y-this.barco.y; // Y distance between player & reticle

        // Ensures reticle cannot be moved offscreen (player follow)
        if (distX > 200)
            this.reticula.x = this.barco.x+200;
        else if (distX < -200)
            this.reticula.x = this.barco.x-200;

        if (distY > 200)
            this.reticula.y = this.barco.y+200;
        else if (distY < -200)
            this.reticula.y = this.barco.y-200;
    }, this);
  
    // Creo funcion para agregar al jugador, por defecto seteo que inician todos arriba a la izquierda y les asigno la imagen del submarino uboot
    function addPlayer(self, playerInfo) {
      console.log("Entro a AddPlayer")
      //playerInfo.x = auxiliar.generarEnteroAleatorio(100,500);
      //playerInfo.y = auxiliar.generarEnteroAleatorio(100,500);

      self.barco = self.physics.add.image(playerInfo.x, playerInfo.y, 'destroyer')
        .setOrigin(0.5, 0.5) // Seteo posicion de inicio
        .setDisplaySize(200, 100) // Seteo tamaño
        .setDepth(5) // seteo de la posicion (como las capas de photoshop)

      self.barco.setCollideWorldBounds(true); // Seteo colisiones con el fin del mapa
      self.barco.setDrag(1000); // Es la velocidad de desaceleracion con el tiempo cuando se deja de mover un jugador
      //PARTICULAS
      const particles = self.add.particles("Blue").setDepth(-1) //usamos la imagen Blue como particula
      const emitter = particles.createEmitter({ //utilizamos la funcion emitter de phaser para emitir varias particulas
        speed: 10, //velocidad con la que se mueven
        scale: {start: 0.08, end: 0}, //el tamano
        blendMode: "ADD" //el efecto a aplicar
      })
      particles.setPosition(0, -11)
      emitter.startFollow(self.barco) //aqui le indicamos que sigan al objeto barco.
    
      self.cameras.main.startFollow(self.barco); //se indica que la camara siga al jugador
      self.physics.add.collider(self.barco, self.isla); //se crea una colision del barco con la isla
      self.physics.add.collider(self.barco, self.bomb); //se crea una colision del barco con la isla

    }
    
    // Creo la funcion para agregar a otro jugador que no sea el propio y lo agrego a la lista/arreglo de otherPlayers con los mismos valores añadiendo la rotacion
    function addOtherPlayers (self, playerInfo){
      console.log("Entro a AddOtherPlayers")
      self.otherPlayer = self.physics.add.image(playerInfo.x, playerInfo.y, 'uboot')
        .setOrigin(0.5, 0.5)
        .setDisplaySize(100, 50)
        .setRotation(playerInfo.rotation)
      
      self.otherPlayer.playerId = playerInfo.playerId
      
      
      //self.otherPlayers.add(self.otherPlayer)

      //PARTICULAS PARA LOS OTROS JUGADORES
      const Particles = self.add.particles("Blue").setDepth(-1) //usamos la imagen Blue como particula
      const emitter = Particles.createEmitter({ //utilizamos la funcion emitter de phaser para emitir varias particulas
        speed: 10, //velocidad con la que se mueven
        scale: {start: 0.08, end: 0}, //el tamano
        blendMode: "ADD" //el efecto a aplicar
      })
      Particles.setPosition(0, -11)
      //emitter.startFollow(self.barco) //aqui le indicamos que sigan al objeto barco.

    }

    // GENERAR CARGUEROS
    // Creo funcion para agregar al jugador, por defecto seteo que inician todos arriba a la izquierda y les asigno la imagen del submarino uboot
    function addCargueros(carguerosArre) {
      console.log("Entro a addCargueros")
      carguerosArre.forEach(addCarguerosSub);
    }

    function addCarguerosSub(cargueroItem) {
      console.log("Entro a addCarguerosSub")
      cargueroItem = self.physics.add.image(cargueroItem.x, cargueroItem.y, 'destroyer')
        .setOrigin(0.5, 0.5) // Seteo posicion de inicio
        .setDisplaySize(200, 75) // Seteo tamaño
        .setDepth(5) // seteo de la posicion (como las capas de photoshop)

      //self.barco.setCollideWorldBounds(true); // Seteo colisiones con el fin del mapa
      //self.barco.setDrag(1000); // Es la velocidad de desaceleracion con el tiempo cuando se deja de mover un jugador
    }

    // Cada vez que se instancie un socket desde un cliente chequea si es él mismo para añadir a ese propio jugador, o si se llama a la funcion para agregar un nuevo jugador
    this.socket.on('generarCarqueros', function (players){
      Object.keys(players).forEach(function (id){
        addPlayer(self, players[id]);
      });
      //carguerosArre.forEach(carguero => console.log(carguero));
      //addCargueros(carguerosArre);
      //carguerosArre.forEach(function addCargueros(carguero)){};
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

    //Las funciones de disparo, utilizando la biblioteca de fisicas ARCADE e IMAGE de Phaser
    
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
    

    // Genero el movimiento de los jugadores a través de las flechas direccionales
    this.cursors = this.input.keyboard.createCursorKeys()
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
      }
    });

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
    

  }
}

