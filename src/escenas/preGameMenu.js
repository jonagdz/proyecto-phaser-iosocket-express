import { DEF } from "../def.js";

export class preGameMenu extends Phaser.Scene{
  constructor(){
      super({key:'preGameMenu'});
  }

  // Creo todo el contenido del juego del juego en si, imagenes, los cursores, jugadores, barcos, implemento el WebSocket
  create(){
    const self = this;
    this.socket = io();
    this.otroEquipo = 0;

    console.log("Dentro de preGameMenu.js");

    self.add.image(0, 0, DEF.IMAGENES.FONDO).setOrigin(0).setScrollFactor(1);
    self.add.text(400, 200, "Seleccionar equipo destructor.", {fill: '#000000', fontSize: '40px', fontFamily: 'Arial black',}).setInteractive().on('pointerdown', () => ElegirEquipo(1));
    self.add.text(400, 600, "Seleccionar equipo submarino.", {fill: '#000000', fontSize: '40px', fontFamily: 'Arial black',}).setInteractive().on('pointerdown', () => ElegirEquipo(2));

    // Funcion que envia al servidor la c
    function ElegirEquipo(equipoElegido){
      console.log("Inicio funcion ElegirEquipo");

      // Seteo el otro equipo para poder enviar al jugador 2 directo al game.js con el equipo que no fue elegido
      //if(equipoElegido === 1){
      //  self.otroEquipo = 2;
      //}else{
      //  self.otroEquipo = 1;
      //}

      var data = {
        socket: self.socket,
        opcion: 1, // Debe ser la opcion 1 para que en sala espera aparezca mensaje que espera por otros jugadores
        equipo: equipoElegido
      }

      self.socket.emit('JugadorUnoEligeEquipo', equipoElegido);
      // Mando al jugador 1 a la sala de espera con el equipo que eligio
      self.scene.start(DEF.SCENES.LOBBY, data); 
    }

    self.socket.on('JugadoresListosPlayer2', function(equipoRestante){
      console.log("Saco al jugador 2 de preGameMenu directo hacia el game")
      var data = {
        socket: self.socket,
        equipo: equipoRestante
      }
      
      // Mando al jugador 2 a game.js con el equipo que no se eligio
      self.scene.start(DEF.SCENES.GAME, data);
    })

    // Manejo el error de que se alcanzo el maximo numero de clientes mandandolo a la sala de espera con la opcion 2
    self.socket.on('errorConexion', function(){
      //console.log("Inicio socket.on errorConexion");
      self.scene.start(DEF.SCENES.LOBBY,{ opcion:2 });
    });
  }
}

