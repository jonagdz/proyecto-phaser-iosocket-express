// Importamos los modulos que utilizaremos: express, http, path, socket.io y mysql
const express = require('express')
const http = require('http')
const path = require('path')
const socketIO = require('socket.io')
const mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "pruebapartida"
})

// Instanciamos el modulo express
const app = express()
var server = http.Server(app)
var io = socketIO(server, {
  pingTimeout: 60000,
})

// Indicamos el puerto en el que estara escuchando el servidor y la ruta estatica al source
app.set('port', 5000)
app.use('/src', express.static(__dirname + '/src'))

// Establecemos las rutas
// Usamos path para con _dirname para que tome automaticamente la carpeta raiz del servidor sin escribir la ruta absoluta 
app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/index.html', function (request, response) {
  response.sendFile(path.join(__dirname, 'index.html'))
})

// Escucho el puerto 5000 con el servidor
server.listen(5000, function () {
  console.log('Servidor iniciado en el puerto 5000')
})

// Variables: {} se declaran como un objeto, [] se declaran como un array.
var players = {}
var carguero = {}
var carguerosArre = [];
// Se declara esta variable para que solo se genere un unico set de cargueros y controlar la cantidad de jugadores
var unique = 1; 
// Almaceno los socketId de ambos jugadores
var socketIdJugador1; 
var socketIdJugador2;
// Defino los limites de las dimensiones del mapa para el posicionamiento inicial de los barcos
let frameW = 1920;
let frameH = 1080;
let margenCostaX = 60;
let margenCostaY = 200;

io.on('connection', function (socket) {
  console.log('Jugador [' + socket.id + '] conectado')

  if (unique==1){ // La primera vez que se conecte un jugador genero el array con los cargueros y asumo que es el destructor
    // Genero al jugador 1 y su posicion - POR DEFECTO ASUMO ES DESTRUCTOR
    console.log('GENERO POSICION DESTRUCTOR')
    players[socket.id] = {
      rotation: 0,
      x: Math.floor((Math.random()*((frameW*0.2)- margenCostaX))+margenCostaX), // El margen x para generarse los cargueros sera desde la costa (60) hasta el 5% del total del mapa (0.2)
      y: Math.floor((Math.random()*((frameH-200)- margenCostaY))+margenCostaY), // El margen y para generarse los cargueros sera el (total - 200) de la parte de arriba y de abajo del mapa
      playerId: socket.id,
      hit: false,
    }

    // Creo a los cargueros aca para que el destructor pueda ver su posicion real al inicio del juego
    for (i=0; i<6; i++){
      carguero = {
        rotation: 0,
        x: Math.floor((Math.random()*((frameW*0.2)- margenCostaX))+margenCostaX), // El margen x para generarse los cargueros sera desde la costa (60) hasta el 20% del total del mapa (0.2)
        y: Math.floor((Math.random()*((frameH-200)- margenCostaY))+margenCostaY), // El margen y para generarse los cargueros sera el (total - 200) de la parte de arriba y de abajo del mapa
        CargueroId: socket.id+i,
      }
      carguerosArre[i]=carguero;
    }

    socket.emit('generarCarqueros', carguerosArre)
    unique = 0;
    // Me quedo con el socketId del jugador1
    socketIdJugador1 = socket.id;

  }else if(unique==0){ // Si se conecta otro nuevo jugador solo mando el array ya generado
    socket.emit('generarCarqueros', carguerosArre)

    // Me quedo con el socketId del jugador2
    socketIdJugador2 = socket.id;

    console.log('GENERO POSICION SUBMARINO')
    // Genero al jugador 2 y su posicion - POR DEFECTO ASUMO ES SUBMARINO
    players[socket.id] = {
      rotation: 0,
      x: Math.floor((Math.random()*((frameW*0.87)- (frameW*0.63)))+(frameW*0.63)), // El margen x para generarse el submarino sera desde el 63% al 87% del lado derecho del mapa 
      y: Math.floor((Math.random()*((frameH-200)- margenCostaY))+margenCostaY), // El margen y para generarse el submarino es el mismo que los demas barcos (total - 200)
      playerId: socket.id,
      hit: false,
    }
  }else{
    // NO PUEDE ENTRAR OTRO JUGADOR EXTRA, SE ALCANZO EL LIMITE DE JUGADORES
  }

  socket.emit('currentPlayers', players) // Le envío el objeto players al nuevo jugador
  socket.broadcast.emit('newPlayer', players[socket.id]) // Actualizo a todos los jugadores sobre el nuevo jugador que ingresó
 
  // Si el jugador se desconecta logueo en consola y llamo al io.emit para que comunique a todos los clientes
  socket.on('disconnect', function () {
    console.log('Jugador [' + socket.id + '] desconectado')
    delete players[socket.id] // Elimino al jugador de nuestro objeto jugadores (players)
    io.emit('playerDisconnected', socket.id)
  })

  // Estoy escuchando el "evento" playerMovement de los sockets para cuando suceda comunicarselo a todos los demas clientes (broadcast)
  socket.on('playerMovement', function (movementData) {
    players[socket.id].x = movementData.x
    players[socket.id].y = movementData.y
    players[socket.id].rotation = movementData.rotation

    socket.broadcast.emit('playerMoved', players[socket.id])
  })

  socket.on('playerHit', function(data){
    players[socket.id].hit = true
    socket.broadcast.emit('playerHitted', data)
  })

  // Intento usar la libreria de mysql para guardar datos de la partida con los datos basicos de prueba, ya teniendo creada la BD
  socket.on('guardarPartida',function(movementData){
    var MovX = movementData.x
    var MovY = movementData.y
    var rotat = movementData.rotation

    con.connect(function(err) {
      if (err) throw  err;
      console.log("Guardo en la BD");
      var sql = "INSERT INTO partida (IdPlayer, EjeX, EjeY, Rotacion)VALUES('"+players[socket.id]+"','"+MovX+"','"+MovY+"','"+rotat+"')";
      con.query(sql, function(err, result)  {
          if(err) throw err;
          console.log("Insert realizado correctamente.");
      });
    });
  })
})