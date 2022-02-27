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
   //////////////////////////////////////////////////CARGO INTERACCIONES Y SPRITE DE DESTROY/////////////////////////////////////////////////////////////////
   this.destroy = self.add.sprite(790, 300, 'destroyy').setOrigin(0).setScrollFactor(1).setDepth(2).setInteractive().on('pointerdown', () => ElegirEquipo(1));
   this.destroy.setInteractive().on('pointerover', () => ElegirDestroy(1));
   this.destroy.setInteractive().on('pointerout', () => ElegirDestroy(2));

   //////////////////////////////////////////////////CARGO INTERACCIONES Y SPRITE DE U-BOOT/////////////////////////////////////////////////////////////////
   this.uboot= self.add.sprite(790, 700, 'uboots').setOrigin(0).setScrollFactor(1).setDepth(2).setInteractive().on('pointerdown', () => ElegirEquipo(2));
   this.uboot.setInteractive().on('pointerover', () => ElegirUboot(1));
   this.uboot.setInteractive().on('pointerout', () => ElegirUboot(2));
   
   
   //////////////////////////////////////////////////CARGO INTERACCIONES Y SPRITE DE HOME/////////////////////////////////////////////////////////////////
   this.home = self.add.sprite(50, 50, 'homes').setOrigin(0).setScrollFactor(1).setDepth(2).setInteractive().on('pointerdown', () => ClickHome());
   this.home.setDisplaySize(150, 150);
   this.home.setInteractive().on('pointerover', () => ElegirHome(1));
   this.home.setInteractive().on('pointerout', () => ElegirHome(2));
   
 
   //////////////////////////////////////////////////CARGO INTERACCIONES Y SPRITE DE INFORMACION/////////////////////////////////////////////////////////////////
   this.inf = self.add.sprite(1710, 880, 'infos').setOrigin(0).setScrollFactor(1).setDepth(2).setInteractive().on('pointerdown', () => ClickInfo(1));
   this.inf.setDisplaySize(150, 150);
   this.inf.setInteractive().on('pointerover', () => ElegirInfo(1));
   this.inf.setInteractive().on('pointerout', () => ElegirInfo(2));
   
    //////////////////////////////////////////////////CARGO TEXTO DE INFORMACION/////////////////////////////////////////////////////////////////
   this.txt = self.add.image(1200, 400, DEF.IMAGENES.INFOTXT).setOrigin(0).setScrollFactor(1).setDepth(2);
   this.txt.setActive(false).setVisible(false)

    //////////////////////////////////////////////////CARGO BOTON PARA CERRAR TEXTO/////////////////////////////////////////////////////////////////
   this.cls = self.add.image(1700, 580, DEF.IMAGENES.CLOSE).setOrigin(0).setScrollFactor(1).setDepth(2).setInteractive().on('pointerdown', () => ElegirClose(2));
   this.cls.setDisplaySize(30, 30);
   this.cls.setActive(false).setVisible(false)

   //console.log("preGameMenu.js self.socket.Id " +self.socket.id);
   console.log("preGameMenu.js ");

  // self.add.image(0, 0, 'mar').setOrigin(0).setScrollFactor(1);
  // self.add.text(400, 200, "Seleccionar equipo destructor.", {fill: '#000000', fontSize: '40px', fontFamily: 'Arial black',}).setInteractive().on('pointerdown', () => ElegirEquipo(1));
  //self.add.text(400, 600, "Seleccionar equipo submarino.", {fill: '#000000', fontSize: '40px', fontFamily: 'Arial black',}).setInteractive().on('pointerdown', () => ElegirEquipo(2));

  
    // self.add.text(400, 200, "Seleccionar equipo destructor.", {fill: '#000000', fontSize: '40px', fontFamily: 'Arial black',}).setInteractive().on('pointerdown', () => ElegirEquipo(1));
  //  self.add.text(400, 600, "Seleccionar equipo submarino.", {fill: '#000000', fontSize: '40px', fontFamily: 'Arial black',}).setInteractive().on('pointerdown', () => ElegirEquipo(2));

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
    
    ////////////////////////////////////////////////////////////////////////
    function ElegirClose (val) {
      if(val===2){
        self.cls.setActive(false).setVisible(false)
        self.txt.setActive(false).setVisible(false)
      }
     
    }

    ////////////////////////////////////////////////////////////////////////
    function ClickHome () {
      console.log("Vuelve a inicio");
  
    }

    function ElegirHome (valhome) {
      console.log("Selecciona");
      if(valhome===1){
        console.log("entroalif");
        self.anims.create({  
          key: 'animhome',
          frames: [
              { key: 'homes',frame:"home2.png" },

          ],
          frameRate: 5,
          repeat:-1,
          hideOnComplete: true,
          
          });
          self.home.play('animhome');
      }
      else{
        console.log("entroalelse");
        self.anims.create({ 
          key: 'animhome2',
          frames: [
              { key: 'homes',frame:"home.png" },

          ],
          frameRate: 5,
          repeat:-1,
          hideOnComplete: true,
          
          });
          self.home.play('animhome2');
      }
  
    }

    ////////////////////////////////////////////////////////////////////////
    function ElegirInfo (tru) {
      console.log("Selecciona");
      if(tru===1){
        console.log("entroalif");
        self.anims.create({  
          key: 'animinf1',
          frames: [
              { key: 'infos',frame:"information2.png" },

          ],
          frameRate: 5,
          repeat:-1,
          hideOnComplete: true,
          
          });
          self.inf.play('animinf1');
      }
      else{
        console.log("entroalelse");
        self.anims.create({  
          key: 'animinf',
          frames: [
              { key: 'infos',frame:"information.png" },

          ],
          frameRate: 5,
          repeat:-1,
          hideOnComplete: true,
          
          });
          self.inf.play('animinf');
      }
  
    }

    function ClickInfo (val) {
      if(val===1){
        self.txt.setActive(true).setVisible(true)
        self.cls.setActive(true).setVisible(true)
      }
      else{
        self.cls.setActive(false).setVisible(false)
        self.txt.setActive(false).setVisible(false)
      }
  
    }
  
   ///////////////////////////////////////////////////////////////////////////////
   function ElegirDestroy (val) {
    console.log("Selecciona");
    if(val===1){
      console.log("entroalif");
      self.anims.create({  
        key: 'animinDestroy',
        frames: [
            { key: 'destroyy',frame:"botond2.png" },

        ],
        frameRate: 5,
        repeat:-1,
        hideOnComplete: true,
        
        });
        self.destroy.play('animinDestroy');
    }
    else{
      console.log("entroalelse");
      self.anims.create({ 
        key: 'animinDestroy2',
        frames: [
            { key: 'destroyy',frame:"boton.png" },

        ],
        frameRate: 5,
        repeat:-1,
        hideOnComplete: true,
        
        });
        self.destroy.play('animinDestroy2');
    }

  }

  ///////////////////////////////////////////////////////////////////////////////////
  function ElegirUboot (vall) {
    console.log("Selecciona");
    if(vall===1){
      console.log("entroalif");
      self.anims.create({  
        key: 'animinBoot',
        frames: [
            { key: 'uboots',frame:"botonuboot2.png" },

        ],
        frameRate: 5,
        repeat:-1,
        hideOnComplete: true,
        
        });
        self.uboot.play('animinBoot');
    }
    else{
      console.log("entroalelse");
      self.anims.create({ 
        key: 'animinBoot2',
        frames: [
            { key: 'uboots',frame:"botonuboot.png" },

        ],
        frameRate: 5,
        repeat:-1,
        hideOnComplete: true,
        
        });
        self.uboot.play('animinBoot2');
    }

  }


  }
}

