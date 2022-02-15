// Importamos los modulos que utilizaremos: Express, SocketIO, path, etc.
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
// usamos path para con _dirname para que tome automaticamente la carpeta raiz del servidor sin escribir la ruta absoluta 
app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/nuevoJuego.html', function (request, response) {
  response.sendFile(path.join(__dirname, 'nuevoJuego.html'))
})

// Escucho el puerto 5000 con el servidor
server.listen(5000, function () {
  console.log('Servidor iniciado en el puerto 5000')
})

var players = {}

io.on('connection', function (socket) {
  console.log('Jugador [' + socket.id + '] conectado')

  players[socket.id] = {
    rotation: 0,
    x: 30,
    y: 30,
    playerId: socket.id,
    //color: getRandomColor()
  }
  socket.emit('currentPlayers', players) // Mando a todos los jugadores incluyendo el emite el mensaje los jugadores actuales
  socket.broadcast.emit('newPlayer', players[socket.id]) // Mando a todos los jugadores excepto al que emite el mensaje que ingreso un nuevo jugador
 
  // Si el jugador se desconecta logueo en consola y llamo al io.emit para que comunique a todos los clientes
  socket.on('disconnect', function () {
    console.log('Jugador [' + socket.id + '] desconectado')
    delete players[socket.id]
    io.emit('playerDisconnected', socket.id)
  })

  // Estoy escuchando el "evento" playerMovement de los sockets para cuando suceda comunicarselo a todos los demas clientes (broadcast)
  socket.on('playerMovement', function (movementData) {
    players[socket.id].x = movementData.x
    players[socket.id].y = movementData.y
    players[socket.id].rotation = movementData.rotation

    socket.broadcast.emit('playerMoved', players[socket.id])
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

// Funcion para generar un color de manera aleatoria
function getRandomColor() {
  return '0x' + Math.floor(Math.random() * 16777215).toString(16)
}