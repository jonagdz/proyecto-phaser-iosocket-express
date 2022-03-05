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
let JugadorUnoEsperando = 0; // Se declara esta variable para que el 2do jugador ingrese directo al juego sin elegir equipo
let otroEquipo;
let jugadoresDesconectados = 0;

io.on('connection', function (socket) {
  //console.log("Conexiones actuales: " +io.engine.clientsCount + " - Jugadores desconectados: "+ jugadoresDesconectados);
  console.log('Jugador [' + socket.id + '] conectado');

  if (io.engine.clientsCount > limiteConexiones){ // Si hay mas de 2 jugadores conectados, a los siguientes los envio a sala de espera
    socket.emit('errorConexion'); // Se emite al cliente que se alcanzo la cantidad maxima de conexiones
    console.log('Se envia al jugador [' + socket.id + '] a sala de espera debido a que se alcanzo el limite de conexiones activas ('+limiteConexiones+').');
    return
  }else if(io.engine.clientsCount == 1){ // Si hay 1 conexion activa, significa que es esta propia y es la primera, asi que se puede unir a la partida y elegir bando
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
        deep: 0,
        carguero: 0,
        numerocarguero: 0
      }
      // Seteo esta variable para saber que el primer jugador ya se conectó
      JugadorUnoEsperando = 1;
      jugadoresDesconectados = 0;
    });

    if (JugadorUnoEsperando === 1){ // Entra a este if solo cuando se conecta el 2do jugador, e informo que ya estan listos ambos jugadores
      // Genero el objeto player para el 2do jugador
      players[socket.id] = {
        rotation: 0,
        x: 0,
        y: 0,
        playerId: socket.id,
        damage: 0,
        equipo: otroEquipo,
        deep: 0,
        carguero: 0,
        numerocarguero: 0
      }

      // Notifico al jugador 1 que el jugador 2 ya ingreso, para que vaya al juego, y mando directo al jugador 2 al juego
      socket.broadcast.emit('JugadoresListosPlayer1');
      socket.emit('JugadoresListosPlayer2', otroEquipo);
      JugadorUnoEsperando = 0;
      jugadoresDesconectados = 0;
    }
  }else if(io.engine.clientsCount == 2){ // Significa que esta es la 2da conexion de un jugador al juego, eso quiere decir que ya hay 1 conectado, esperando a iniciar partida o porque se desconecto el otro jugador
    if(jugadoresDesconectados == 1){ // Si es la opcion de que se desconecto el otro jugador de la partida, debo enviar a esta nueva conexion a sala de espera con mensaje partida en curso
      //socket.broadcast.emit('SalaEsperaPartidaEnCurso', socket);
      socket.emit('SalaEsperaPartidaEnCurso');
      jugadoresDesconectados = 0;
    }else if(jugadoresDesconectados == 0){ // Si es la opcion que esta esperando al 2do jugador lo mando directo al game a ambos
      // Genero el objeto player para el 2do jugador
      players[socket.id] = {
        rotation: 0,
        x: 0,
        y: 0,
        playerId: socket.id,
        damage: 0,
        equipo: otroEquipo,
        deep: 0
      }

      // Notifico al jugador 1 que el jugador 2 ya ingreso, para que vaya al juego, y mando directo al jugador 2 al juego
      socket.broadcast.emit('JugadoresListosPlayer1');
      socket.emit('JugadoresListosPlayer2', otroEquipo);
      JugadorUnoEsperando = 0;
      jugadoresDesconectados = 0;
    }
  }
  // SACO PARA AFUERA DEL IF los eventos que son comunes a todos los jugadores que esten conectados (MOVIMIENTOS, DISPAROS, DESCONEXION, ETC)

  // Si el jugador se desconecta logueo en consola y llamo al io.emit para que comunique a todos los clientes
  socket.on('disconnect', function () {
    console.log('Jugador [' + socket.id + '] desconectado')
    delete players[socket.id] // Elimino al jugador de nuestro objeto jugadores (players)
    io.emit('playerDisconnected', socket.id)
    jugadoresDesconectados++;
  })

  // Estoy escuchando el "evento" playerMovement de los sockets para cuando suceda comunicarselo a todos los demas clientes (broadcast)
  socket.on('playerMovement', function (movementData) {
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    players[socket.id].rotation = movementData.rotation;
    socket.broadcast.emit('playerMoved', players[socket.id])
  })

  // Estoy escuchando el "evento" cargueroMovement de los sockets para cuando suceda comunicarselo al submarino
  socket.on('carguerosMovement', function (movementData) {
    players[socket.id].x = movementData.x;
    players[socket.id].y = movementData.y;
    players[socket.id].rotation = movementData.rotation;
    players[socket.id].carguero = movementData.carguero;
    socket.broadcast.emit('carguerosMoved', players[socket.id])
  })

  socket.on('playerHit', function(data){
    players[socket.id].damage = data.danio;
    players[socket.id].numerocarguero = data.carguero;
    socket.broadcast.emit('playerHitted', players[socket.id])
  })

  socket.on('Finalizo', function(data){
    socket.broadcast.emit('FinalizoPartida', data)
  })

  socket.on('playerProf', function(data){
    players[socket.id].deep = data.Pr;
    socket.broadcast.emit('playerUnder', players[socket.id])
  })

  socket.on('submarinoAmmo', function(data){
    socket.broadcast.emit('recibeSubAmmo', data)
  })

    const api_url = "http://localhost:8080/getPartidas";
    const api_url_iniciarPartida = "http://localhost:8080/iniciarPartida";
    const api_url_guardarPartida = "http://localhost:8080/guardarPartida"; 

    socket.on('listarPartidas', function (data) {
      getapi(api_url);
    })

    socket.on('iniciarPartida', function (data) {
    postApiInitPart(api_url_iniciarPartida, data);
    })

    socket.on('guardarPartida', function (data) {
      postApiGuardarPart(api_url_guardarPartida, data);
    })
      
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


    // Defining async function
  async function postApiInitPart(url, data) 
  {
      try 
      {
        const response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
              'Content-type': 'application/json; charset=UTF-8',
          },
        })
        //const json = await response.json()
      } catch (e) {
        //console.log(e)
        console.log("Se intento guardar la partida iniciada pero tenes problemas con el BacEnd")
      }
   }

   async function postApiGuardarPart(url, data) 
  {
      try 
      {
        //console.log(data)
        const response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
              'Content-type': 'application/json; charset=UTF-8',
          },
        })
        //const json = await response.json()
        console.log("Se guardo la partida con exito")
      } catch (e) {
        //console.log(e)
        console.log("Se intento guardar la partida pero tenes problemas con el BacEnd")
      }
   }
}); //EOF