// Configuracion de Phaser
var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 1024,
  height: 768,
  backgroundColor: '#ffffff',
  physics: {
    default: 'arcade',
    arcade: {
      debug: true, // En true para ver las hitbox reales de los objetos y el vector a donde apunta la direccion junto con la fuerza (tamaño de la flecha de direccion)
      gravity: { y: 0 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  } // Cargo las 3 funciones principales de las escenas
}

// Defino mis variables
var game = new Phaser.Game(config)
var button;

// Funcion preload: Cargo todos los recursos que utilizare en el juego como imagenes y demas
function preload() {
  this.load.image('Carguero', 'src/assets/Carguero.png');
  this.load.image('Destructor', 'src/assets/Destructor.png');
  this.load.image('Submarino', 'src/assets/submarino.png');
  this.load.image('uboot', 'src/assets/uboot7.png');
  this.load.image('mar', 'src/assets/mar.png');
  this.load.image('Blue', 'src/assets/Blue2.png');

}

// Creo todo el contenido del juego del juego en si, imagenes, los cursores, jugadores, barcos, implemento el WebSocket
function create() {
  var self = this
  this.socket = io()
  this.otherPlayers = this.physics.add.group()

  this.add.image(400, 300, 'mar'); // Cargo la imagen de fondo del mapa

  // Cada vez que se instancie un socket desde un cliente chequea si es él mismo para añadir a ese propio jugador, o si se llama a la funcion para agregar un nuevo jugador
  this.socket.on('currentPlayers', function (players) {
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === self.socket.id) {
        addPlayer(self, players[id])
      } else {
        addOtherPlayers(self, players[id])
      }
    })
  })

  this.socket.on('newPlayer', function (playerInfo) {
    addOtherPlayers(self, playerInfo)
  })

  this.socket.on('SaveData', function(playerInfo){
    guardarDatos(self, playerInfo);
  })

  // Destruye a un jugador cuando se desconecta del socket
  this.socket.on('playerDisconnected', function (playerId) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerId === otherPlayer.playerId) {
        otherPlayer.destroy()
      }
    })
  })

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
  })
}

// Creo funcion para agregar al jugador, por defecto seteo que inician todos arriba a la izquierda y les asigno la imagen del submarino uboot
function addPlayer(self, playerInfo) {
  self.barco = self.physics.add.image(playerInfo.x, playerInfo.y, 'uboot')
    .setOrigin(0.5, 0.5) // Seteo posicion de inicio
    .setDisplaySize(50, 50) // Seteo tamaño
    .setDepth(5) // seteo de la posicion (como las capas de photoshop)

  self.barco.setCollideWorldBounds(true) // Seteo colisiones con el fin del mapa
  self.barco.setDrag(1000) // Es la velocidad de desaceleracion con el tiempo cuando se deja de mover un jugador
  //PARTICULAS
  const particles = self.add.particles("Blue") //usamos la imagen Blue como particula
  const emitter = particles.createEmitter({ //utilizamos la funcion emitter de phaser para emitir varias particulas
    speed: 10, //velocidad con la que se mueven
    scale: {start: 0.08, end: 0}, //el tamano
    blendMode: "ADD" //el efecto a aplicar
  })
  particles.setPosition(0, -11)
  emitter.startFollow(self.barco) //aqui le indicamos que sigan al objeto barco.

}

// Creo la funcion para agregar a otro jugador que no sea el propio y lo agrego a la lista/arreglo de otherPlayers con los mismos valores añadiendo la rotacion
function addOtherPlayers(self, playerInfo) {
  const otherPlayer = self.physics.add.image(playerInfo.x, playerInfo.y, 'uboot')
    .setOrigin(0.5, 0.5)
    .setDisplaySize(50, 50)
    .setRotation(playerInfo.rotation)
    
  otherPlayer.playerId = playerInfo.playerId
  self.otherPlayers.add(otherPlayer)

}

// Funcion update, se refresca constantemente para ir dibujando los distintos cambios que sucedan en la escena, aqui se agrega todo lo que se desea que se actualice y refleje graficamente
function update() {
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
  }
}

// Funcion para intentar guardar datos utilizando el boton guardar en nuevoJuego.html, la llamo desde alli y le paso la posicion actual del jugador para guardarla directo en la BD
function guardarDatos(self, playerInfo){
  this.socket.emit('guardarPartida', { x: this.barco.x, y: this.barco.y, rotation: this.barco.rotation })
  alert ("eje x: "+playerInfo.x);
}