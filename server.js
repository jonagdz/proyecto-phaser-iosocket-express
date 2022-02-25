// Importamos los modulos que utilizaremos: express, http, path, socket.io y mysql
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const fetch = require('node-fetch');

// Instanciamos el modulo express
const app = express();
var server = http.Server(app);
var io = socketIO(server, {
  pingTimeout: 60000,
});

// Indicamos el puerto en el que estara escuchando el servidor y la ruta estatica al source
app.set('port', 5000);
app.use('/src', express.static(__dirname + '/src'));

// Establecemos las rutas
// Usamos path para con _dirname para que tome automaticamente la carpeta raiz del servidor sin escribir la ruta absoluta 
app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, 'index.html'))
});

app.post('/index.html', function (request, response) {
  response.sendFile(path.join(__dirname, 'index.html'))
});

// Escucho el puerto 5000 con el servidor
server.listen(5000, function () {
  console.log('Servidor iniciado en el puerto 5000')
});

// Variables: {} se declaran como un objeto, [] se declaran como un array.
let players = {};
let limiteConexiones = 2; // Establezco el limite de clientes que pueden conectarse

// Se declara esta variable para que el 2do jugador ingrese directo al juego sin elegir equipo
let primerJugadorConectado = 0; 
let otroEquipo;

io.on('connection', function (socket) {
  //console.log("INICIO NUEVO SOCKET, ya se conecto el primer jugador?: " + primerJugadorConectado + " (0 no, 1 si)")
  console.log("Conexiones actuales:" +io.engine.clientsCount)

  if (io.engine.clientsCount > limiteConexiones){
    socket.emit('errorConexion'); // Se emite al cliente que se alcanzo la cantidad maxima de conexiones
    socket.disconnect();
    console.log('Se deconecto al nuevo cliente debido a que se alcanzo el limite de conexiones activas ('+limiteConexiones+').');
    return
  }else{
    console.log('Jugador [' + socket.id + '] conectado');

    socket.on('JugadorUnoEligeEquipo', function(equipoElegido){
      if (equipoElegido === 1){
        otroEquipo = 2;
      }else{
        otroEquipo = 1;
      }

      // Genero el objeto player para el primer jugador
      players[socket.id] = {
        rotation: 0,
        x: 0,
        y: 0,
        playerId: socket.id,
        damage: 0,
        equipo: 1,
      }
      // Seteo esta variable para saber que el primer jugador ya se conectó
      primerJugadorConectado = 1;
    });

    if (primerJugadorConectado===1){ // Entra a este if solo cuando se conecta el 2do jugador, e informo que ya estan listos ambos jugadores
      // Genero el objeto player para el 2do jugador
      players[socket.id] = {
        rotation: 0,
        x: 0,
        y: 0,
        playerId: socket.id,
        damage: 0,
        equipo: otroEquipo,
      }

      // Notifico al jugador 1 que el jugador ya ingreso, para que vaya al juego, y mando directo al jugador 2 al juego
      socket.broadcast.emit('JugadoresListosPlayer1');
      socket.emit('JugadoresListosPlayer2', otroEquipo);
    }

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
      players[socket.id].damage = data.Dam;
      socket.broadcast.emit('playerHitted', players[socket.id])
    })
    
    // api url
    const api_url = "http://localhost:8080/getPartidas";

    // Defining async function
    async function getapi(url) 
    {
      try 
      {
       const response = await fetch(url)
       const data =  await response.json()
       console.log(data)
     } catch (e) {
      //console.log(e)
       console.log("Error de conexion al BackEnd")
     }
   }

   socket.on('listarPartidas', function (data) {
         getapi(api_url);
   })
  }
}); //EOF