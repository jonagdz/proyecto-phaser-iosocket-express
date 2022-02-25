export class salaEspera extends Phaser.Scene{
  constructor(){
    super({key:'salaEspera'});
  }

  init(data){ //opcion
    //console.log("Dentro de INIT salaEspera.js opcion:" +data.opcion)
    //console.log("Dentro de INIT salaEspera.js socketId: " +data.socket.id)
    this.socket = data.socket;
    this.opcion = data.opcion;
    this.equipo = data.equipo;
  }

  // Creo todo el contenido del juego del juego, imagenes, los cursores, jugadores, barcos e implemento el WebSocket
  create(){
    const self = this;

    //this.socket = io()
    console.log("Entré a salaEspera.js con el socket.id: " + this.socket.id + " - equipo: "+this.equipo);
    // Agrego imagen de fondo
    self.add.image(0, 0, 'fondoWaitRoom').setOrigin(0).setScrollFactor(1);

    // Muestro el mensaje dependiendo de con que opcion fue llamada la escena
    if (self.opcion == 1){
      self.add.text(450, 450, "Estás en la sala de espera esperando", {fill: '#000000', fontSize: '40px', fontFamily: 'Arial black',})
      self.add.text(450, 500, "a que se unan los demás jugadores.", {fill: '#000000', fontSize: '40px', fontFamily: 'Arial black',})
    }else{
      self.add.text(450, 450, "Estás en la sala de espera debido a que la", {fill: '#000000', fontSize: '40px', fontFamily: 'Arial black',})
      self.add.text(450, 500, "cantidad de maximos jugadores se alcanzó", {fill: '#000000', fontSize: '40px', fontFamily: 'Arial black',})
      self.add.text(450, 550, "intente nuevamente en unos minutos.", {fill: '#000000', fontSize: '40px', fontFamily: 'Arial black',})
    }

    self.socket.on('JugadoresListosPlayer1', function(){
      var data = {
        socket: self.socket,
        equipo: self.equipo
      }
      self.scene.start("game", data);
    })
  }
}