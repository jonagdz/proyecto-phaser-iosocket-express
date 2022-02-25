import { Bote } from '../logica/bote.js';
import { Bullets } from '../logica/bullet.js';
import { Carguero } from '../logica/carguero.js';
import { Submarino } from '../logica/submarino.js';
import { Destructor } from '../logica/destructor.js';

export class game extends Phaser.Scene{
  constructor(){
    super("game");
  }

  init(data){
    this.socket = data.socket;
    this.equipo = data.equipo;
    this.destructor = new Destructor('Destructor',200,8,0,0,0,1,0,0,0,0); // Creo el objeto destructor 
    this.submarino = new Submarino('Submarino',100,0,8,0,0,0,7,0,0,0,0); // Creo el objeto submarino 
  }

  // Creo todo el contenido del juego del juego, imagenes, los cursores, jugadores, barcos e implemento el WebSocket
  create(){
    // DEFINICIÓN DE VARIABLES Y CONSTANTES A UTILIZAR -----------------------------------------------------------------------------------------------------------------------------------
    var self = this
    let bullet;
    let danio;
    let reticula;
    self.socket.emit('listarPartidas', {id: 2});

    // Grupo para los cargueros y balas
    var arrayCargueros = [];
    this.grupoCargueros = this.physics.add.group({ classType: Carguero, runChildUpdate: true });
    this.playerBullets = this.physics.add.group({ classType: Bullets, runChildUpdate: true });



    // Cargo la imagen de fondo del mapa
    this.mar = this.add.image(0, 0, 'mar').setOrigin(0).setScrollFactor(1).setDepth(0); 
    const backgroundW = this.mar.width;
    const backgroundH = this.mar.height;

    // Defino los limites de las dimensiones del mapa para el posicionamiento inicial de los barcos
    var frameW = 4576;
    var frameH = 2156;
    var margenCostaX = 810;
    var margenCostaY = 400;

    // Defino variables para las posiciones X e Y de los barcos
    var posX;
    var posY;
    let distMax;
    let damAcuD = 0;
    let damAcuS = 0;
    // Obtengo el centro del canvas para la mascara
    const centroW = this.sys.game.config.width / 2;
    const centroH = this.sys.game.config.height / 2;
    // Construyo la máscara de visión
    const maskImage = this.make.image({
      x: centroW,
      y: centroH,
      key: 'mask',
      add: false
    });
    const mask = maskImage.createBitmapMask();

    // Ajusto cámaras
    this.cameras.main.setMask(mask);
    //this.cameras.main.setBounds(0, 0, backgroundW, backgroundH);
    this.physics.world.setBounds(0, 0, backgroundW, backgroundH);
    
    // Islas
    this.isla1 = self.physics.add.image(2100,900,'island1').setDepth(5);
    this.isla1.setImmovable(true);
    this.isla1.setDisplaySize(400, 400);
    this.isla2 = self.physics.add.image(2460,1600,'island1').setDepth(5);
    this.isla2.setImmovable(true);
    this.isla2.setDisplaySize(400, 400);
    this.isla3 = self.physics.add.image(3200,600,'island1').setDepth(5);
    this.isla3.setImmovable(true);
    this.isla3.setDisplaySize(400, 400);
    this.isla4 = self.physics.add.image(3400,1800,'island1').setDepth(5);
    this.isla4.setImmovable(true);
    this.isla4.setDisplaySize(400, 400);

    // Costas
    this.costa1 = self.physics.add.image(345,1078,'costa1').setDepth(5);;
    this.costa1.setImmovable(true);
    this.costa2 = self.physics.add.image(6066,1078,'costa2').setDepth(5);;
    this.costa2.setImmovable(true);

    // Introduzco cursores y teclas utilizables
    this.cursors = this.input.keyboard.createCursorKeys();
    this.KeyCamera  =this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
    this.KeyMute  =this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    this.KeyUnmute  =this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);
    this.up  =this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.left  =this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.down  =this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.right  =this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    // INICIO DE LA LÖGICA DEL COMPORTAMIENTO DEL JUEGO -----------------------------------------------------------------------------------------------------------------------------------

    // Segun el equipo del jugador actual, genero todos elementos del equipo correspondiente
    if(self.equipo === 1){ // Genero el equipo 1 que son el destructor y los cargueros, aunque tambien debo generar al submarino (Pero sin su camara ni colisiones) para ir actualizando su posicion en este cliente con el movimiento del otro jugador      
      generarEquipo1();
    }else{ // Genero el equipo 2 que es el submarino, aunque tambien debo generar la imagen del destructor y los cargueros para ir actualizandola con el movimiento del otro jugador      
      generarEquipo2();
    }    

    function generarEquipo1(){
      // Genero las posiciones X e Y para el destructor
      posX = Math.floor((Math.random()*((frameW*0.25)- margenCostaX))+margenCostaX), // El margen x para generarse los cargueros sera desde la costa (810) hasta el 35% del total del mapa (0.35)
      posY = Math.floor((Math.random()*((frameH-400)- margenCostaY))+margenCostaY), // El margen y para generarse los cargueros sera el (total - 400) de la parte de arriba y de abajo del mapa
      
      // Actualizo la posicion del objeto destructor creado previamente
      self.destructor.posX = posX;
      self.destructor.posY = posY;
      
      // Genero la imagen del destructor, colisiones, particulas, etc
      generarDestructor();

      // Genero los objetos cargueros, con sus imagenes, colisiones, etc
      generarCargueros();

      // Genero la imagen del submarino enemigo
      generarSubmarinoEnemigo();
    }

    function generarEquipo2(){
      // Genero las posiciones X e Y para el submarino
      posX = Math.floor((Math.random()*((frameW*0.87)- (frameW*0.63)))+(frameW*0.63)), // El margen x para generarse el submarino sera desde el 63% al 87% del lado derecho del mapa 
      posY = Math.floor((Math.random()*((frameH-200)- margenCostaY))+margenCostaY), // El margen y para generarse el submarino es el mismo que los demas barcos (total - 200)
      
      // Actualizo la posicion del objeto submarino creado previamente
      self.submarino.posX = posX;
      self.submarino.posY = posY;

      // Genero la imagen del submarino, colisiones, particulas, etc
      generarSubmarino();

      // Genero la imagen del destructor enemigo
      generarDestructorEnemigo();
    }

    // Generar destructor
    function generarDestructor(){
      // Generamos la imagen del destructor al objeto destructor
      self.destructor.imagen = self.physics.add.image(self.destructor.posX, self.destructor.posY, 'destroyer')
      .setDisplaySize(200, 100)
      .setRotation(0)
      self.destructor.reticula = self.physics.add.sprite(self.destructor.posX, self.destructor.posY, 'crosshair').setCollideWorldBounds(true);;
      self.destructor.bullet = self.playerBullets;
      //self.destructor.vida = 8;
      // Particulas
      const particles = self.add.particles("Blue").setDepth(-1) // Imagen Blue como particula
      const emitter = particles.createEmitter({ // Funcion emitter de phaser para emitir varias particulas
        speed: 10, // Velocidad con la que se mueven
        scale: {start: 0.08, end: 0}, // Tamaño
        blendMode: "ADD" // Efecto a aplicar
      })
      particles.setPosition(0, -11)
      emitter.startFollow(self.destructor.imagen) // Le indicamos que sigan al destructor
      
      // Se indica que la camara siga al destructor
      self.cameras.main.startFollow(self.destructor.imagen,true, 0.09, 0.09); 
      // Zoom de la cámara
      self.cameras.main.setZoom(0.9);
      // Se crea una colision del barco con las islas
      self.physics.add.collider(self.destructor.imagen, self.isla1); 
      self.physics.add.collider(self.destructor.imagen, self.isla2); 
      self.physics.add.collider(self.destructor.imagen, self.isla3); 
      self.physics.add.collider(self.destructor.imagen, self.isla4); 
      // Se crea una colision del barco con la bomba
      self.physics.add.collider(self.destructor.imagen, self.bomb);
      // Se crea una colision del barco con los cargueros
      self.physics.add.collider(self.destructor.imagen, self.grupoCargueros);
      self.physics.add.collider(self.destructor.imagen, self.carguero);
      // Se crea una colision del barco con la costa1
      self.physics.add.collider(self.destructor.imagen, self.costa1);
      // Se crea una colision del barco con la costa2
      self.physics.add.collider(self.destructor.imagen, self.costa2);
      // Se crea el evento de cambio de armas para el destructor
      self.input.keyboard.on('keydown-' + 'Z', function (event){
        if (self.destructor.armas == 0){
          self.destructor.armas = 1;
          console.log('Cambio a Cargas de Profundidad');
        }else{
          self.destructor.armas = 0;
          console.log('cambio a canon');
        }
      });
    }

    // Generar destructor
    function generarDestructorEnemigo(){
      // Generamos la imagen del destructor al objeto destructor
      self.destructor.imagen = self.physics.add.image(0,0, 'destroyer').setDisplaySize(200, 100).setRotation(0) 
    
      // Particulas
      const particles = self.add.particles("Blue").setDepth(-1) // Imagen Blue como particula
      const emitter = particles.createEmitter({ // Funcion emitter de phaser para emitir varias particulas
        speed: 10, // Velocidad con la que se mueven
        scale: {start: 0.08, end: 0}, // Tamaño
        blendMode: "ADD" // Efecto a aplicar
      })
      particles.setPosition(0,-1)
      emitter.startFollow(self.destructor.imagen) // Le indicamos que sigan al destructor
    }

    // Genero todo lo relacionado a la imagen del submarino del jugador actual
    function generarSubmarino(){
      self.submarino.imagen = self.physics.add.image(self.submarino.posX, self.submarino.posY, 'uboot').setDisplaySize(100,50).setDepth(0) // Seteo tamaño y profundidad de la imagen
      self.submarino.imagen.setCollideWorldBounds(true) // Colisiones con el fin del mapa
      self.submarino.imagen.setDrag(1000) // Es la velocidad de desaceleracion con el tiempo cuando se deja de mover un jugador
      self.submarino.bullet = self.playerBullets;
      self.submarino.reticula = self.physics.add.sprite(self.submarino.posX, self.submarino.posY, 'crosshair').setCollideWorldBounds(true);
      //self.submarino.vida = 7;
      // Particulas
      const particles = self.add.particles("Blue").setDepth(-1) // Imagen Blue como particula
      const emitter = particles.createEmitter({ // Funcion emitter de phaser para emitir varias particulas
        speed: 10, // Velocidad con la que se mueven
        scale: {start: 0.08, end: 0}, // Tamaño
        blendMode: "ADD" // Efecto a aplicar
      })
      particles.setPosition(0, -11)
      emitter.startFollow(self.submarino.imagen) // Le indicamos que sigan al objeto barco.

      // Se indica que la camara siga al componente barco
      self.cameras.main.startFollow(self.submarino.imagen,true, 0.09, 0.09); 
      // Zoom de la cámara
      self.cameras.main.setZoom(1.4);
      // Se crea una colision del barco con la isla
      self.physics.add.collider(self.submarino.imagen, self.isla1); 
      self.physics.add.collider(self.submarino.imagen, self.isla2); 
      self.physics.add.collider(self.submarino.imagen, self.isla3); 
      self.physics.add.collider(self.submarino.imagen, self.isla4); 
      // Se crea una colision del barco con la bomba
      self.physics.add.collider(self.submarino.imagen, self.bomb);
      // Se crea una colision del barco con los cargueros
      self.physics.add.collider(self.submarino.imagen, self.grupoCargueros);
      self.physics.add.collider(self.submarino.imagen, self.carguero);
      // Se crea una colision del barco con la costa1
      self.physics.add.collider(self.submarino.imagen, self.costa1);
      // Se crea una colision del barco con la costa2
      self.physics.add.collider(self.submarino.imagen, self.costa2);

      // PARTE PROFUNDIDAD SUBMARINO JUAN PABLO
      /*
      self.input.keyboard.on('keydown-' + 'Q', function (event){
        if (self.submarino.profundo == 0){
          self.submarino.profundo = 1;
          self.submarino.setTexture('UbootProfundidad1');
          console.log('baje a poca profundidad');
        }else if (self.submarino.profundo == 1){
          self.submarino.profundo = 2;
          console.log('baje a mucha profundidad');
          self.submarino.setTexture('UbootProfundidad2');
        } 
      });
      self.input.keyboard.on('keydown-' + 'E', function (event){
        if (self.submarino.profundo == 1){
          self.submarino.profundo = 0;
          console.log('subi a la superficie');
          self.submarino.setTexture('uboot');
        }else if (self.submarino.profundo == 2){
          self.submarino.profundo = 1;
          self.submarino.setTexture('UbootProfundidad1');
          console.log('subi a poca profundidad');
        } 
      });*/
      // Se crea el evento de cambio de armas para el destructor
      self.input.keyboard.on('keydown-' + 'Z', function (event){
        if (self.submarino.armas === 0){
          self.submarino.armas = 1;
          console.log('Cambio a Torpedos');
        }else{
          self.submarino.armas = 0;
          console.log('cambio a canon');
        }
      });
    }
    
    // Genero todo lo relacionado a la imagen del submarino del equipo enemigo
    function generarSubmarinoEnemigo(){
      self.submarino.imagen = self.physics.add.image(1050,550, 'uboot').setDisplaySize(100,50).setDepth(0) // Seteo tamaño y profundidad de la imagen
        
      // Particulas
      const particles = self.add.particles("Blue").setDepth(-1) // Imagen Blue como particula
      const emitter = particles.createEmitter({ // Funcion emitter de phaser para emitir varias particulas
        speed: 10, // Velocidad con la que se mueven
        scale: {start: 0.08, end: 0}, // Tamaño
        blendMode: "ADD" // Efecto a aplicar
      })
      particles.setPosition(0, -11)
    }

    // Funcion para generarle las imagenes y las particulas a cada barco
    function generarCargueros(){
      // Genero las posiciones X e Y para el primer carguero principal
      posX = Math.floor((Math.random()*((frameW*0.25)- margenCostaX))+margenCostaX);
      posY = Math.floor((Math.random()*((frameH-400)- margenCostaY))+margenCostaY)

      // CREO LOS OBJETOS CARGUEROS
      self.carguero1 = new Carguero('Carguero1',100,8,posX,posY,0,2);
      self.carguero2 = new Carguero('Carguero2',100,8,posX+600,posY+240,0,3);
      self.carguero3 = new Carguero('Carguero3',100,8,posX+50, posY+370,0,4);
      self.carguero4 = new Carguero('Carguero4',100,8,posX-270,posY+150,0,5);
      self.carguero5 = new Carguero('Carguero5',100,8,posX+300,posY-150,0,6);
      self.carguero6 = new Carguero('Carguero6',100,8,posX+180,posY+150,0,7);

      // Los inserto en un array de carrgueros para poder crear sus imagenes
      arrayCargueros[0] = self.carguero1;
      arrayCargueros[1] = self.carguero2;
      arrayCargueros[2] = self.carguero3;
      arrayCargueros[3] = self.carguero4;
      arrayCargueros[4] = self.carguero5;
      arrayCargueros[5] = self.carguero6;

      // Genero las imagenes de los cargueros, colisiones, particulas, etc
      arrayCargueros.forEach(carguero => console.log('x:'+carguero.posX +' y:'+ carguero.posY));
      arrayCargueros.forEach(function(carguero){
        carguero = self.physics.add.image(carguero.posX, carguero.posY, 'carguero').setDisplaySize(200, 75).setDepth(5) // Seteo tamaño y profundidad de la imagen

        // Lo vuelvo inamovible
        carguero.setImmovable(true);
        carguero.setCollideWorldBounds(true) // Colisiones con el fin del mapa
        // Se crea una colision de los cargueros con la lisa isla
        self.physics.add.collider(carguero, self.isla1); 
        self.physics.add.collider(carguero, self.isla2); 
        self.physics.add.collider(carguero, self.isla3); 
        self.physics.add.collider(carguero, self.isla4); 
        // Se crea una colision del carguero con la bomba
        self.physics.add.collider(carguero, self.bomb);
        // Se crea una colision del carguero con los barcos
        //self.physics.add.collider(carguero, self.barco);
        // Se crea una colision del carguero con la costa1
        self.physics.add.collider(carguero, self.costa1);
        // Se crea una colision del carguero con la costa2
        self.physics.add.collider(carguero, self.costa2);
        //self.physics.add.collider(self.grupoCargueros, self.barco);
      })
    };


    //CUANDO SE HAGA EL INPUT DE CLICK, ACTIVA LA VISIBILIDAD Y ACTIVIDAD DE LAS BALAS DESDE EL BARCO A LA RETICULA
    this.input.on('pointerdown', function (pointer, time) {
      if(self.equipo === 1){
        bullet = self.destructor.bullet.get().setActive(true).setVisible(true).setDisplaySize(10,10);
        corchazo(self.destructor.imagen, bullet, self.destructor.reticula, self.submarino.imagen);
      }else{
        bullet = self.submarino.bullet.get().setActive(true).setVisible(true).setDisplaySize(10,10);
        corchazo(self.submarino.imagen, bullet, self.submarino.reticula, self.destructor.imagen);
      }
    }, this);

    //FUNCION DE DISPARO DEL JUGADOR
    function corchazo(player, bullet, reticula, enemyImag, enemyPure){
      console.log("dentro del balazo");
      if (bullet){
        console.log("en la bala");
          bullet.fire(player, reticula); //LLAMA AL METODO DISPARAR DE BULLET
          bullet.setCollideWorldBounds(true);
          bullet.body.onWorldBounds = true;
          bullet.body.world.on('worldbounds', function(body) {
            //COLISION CON LOS BORDES DEL MUNDO
            if (body.gameObject === this ) {
              this.setActive(false);
              this.setVisible(false);
            }
          }, bullet);
          
          //Colision con las islas
          self.physics.add.collider(bullet, self.isla1, function(bullet){
            bullet.destroy();
          });
          self.physics.add.collider(bullet, self.isla2, function(bullet){
            bullet.destroy();
          });
          self.physics.add.collider(bullet, self.isla3, function(bullet){
            bullet.destroy();
          });
          self.physics.add.collider(bullet, self.isla4, function(bullet){
            bullet.destroy();
          });
          //Colision con la mira
          self.physics.add.collider(bullet, reticula, function(bullet){
            bullet.destroy();
          });
          //MANEJO DE COLISION ENTRE LA BALA Y OTROS JUGADORES
          self.physics.add.collider(bullet, enemyImag, function(bullet){
            bullet.destroy();
            handleHit(enemyImag);
          });
      }
    }
    function handleHit(enemy){
      console.log('DENTRO DEL MANEJO DE DISPARO DEL QUE DISPARA');
      hitted(enemy.x, enemy.y);    
      if(self.equipo === 1){
          if(self.destructor.armas === 0){
              danio = 1;
              damAcuD = damAcuD + danio;              
              self.socket.emit('playerHit', {Dam: danio});
              if(damAcuD >= self.submarino.vida){
                destroyed(self.submarino.imagen);
                self.submarino.imagen.setActive(false);
                self.submarino.imagen.setVisible(false);
              }
          }else if (self.destructor.armas === 1){
              danio = 3;
              damAcuD = damAcuD + danio;              
              self.socket.emit('playerHit', {Dam: danio});
              if(damAcuD >= self.submarino.vida){
                destroyed(self.submarino.imagen);
                self.submarino.imagen.setActive(false);
                self.submarino.imagen.setVisible(false);
              }
          }
      }else{
        if(self.submarino.armas === 0){
          danio = 1;
          damAcuS = damAcuS + danio;              
          self.socket.emit('playerHit', {Dam: danio});
          if(damAcuS >= self.destructor.vida){
            destroyed(self.destructor.imagen);
            self.destructor.imagen.setActive(false);
            self.destructor.imagen.setVisible(false);
          }
        }else if (self.submarino.armas === 1){
          danio = 4;
          damAcuS = damAcuS + danio;                            
          self.socket.emit('playerHit', {Dam: danio});
          if(damAcuS >= self.destructor.vida){
            destroyed(self.destructor.imagen);
            self.destructor.imagen.setActive(false);
            self.destructor.imagen.setVisible(false);
          }
        }
        
      }
    }
    //funcion que muestra la explosion en la posicion determinada
    function hitted(x, y){
      self.explotion2 = self.add.sprite(x,y,'explot').setDisplaySize(100, 100).setDepth(5);  //se crea el sprite de explosiones
      self.anims.create({  // Se crea la animacion para la explosion luego de recibir disparo
      key: 'explot2',
      frames: [
          { key: 'explot',frame:"PngItem_4145768_01_29.gif" },
          { key: 'explot',frame:"PngItem_4145768_01_30.gif" },
          { key: 'explot',frame:"PngItem_4145768_01_31.gif" },
          { key: 'explot',frame:"PngItem_4145768_01_32.gif" },
      ],
      hideOnComplete: true,
      });
      self.explotion2.play('explot2');
    }
    //funcion que muestra y destruye un jugador
    function destroyed(playerIMG){
      console.log('Entro a destroyed');
      self.explotion3 = self.add.sprite(playerIMG.x ,playerIMG.y ,'explot').setDisplaySize(100, 100).setDepth(5);  //se crea el sprite de explosiones
      self.anims.create({  // Se crea la animacion para la explosion luego de recibir disparo
      key: 'explot3',
      frames: [
          { key: 'explot',frame:"PngItem_4145768_01_29.gif" },
          { key: 'explot',frame:"PngItem_4145768_01_30.gif" },
          { key: 'explot',frame:"PngItem_4145768_01_31.gif" },
          { key: 'explot',frame:"PngItem_4145768_01_32.gif" },
      ],
      frameRate: 5,
      repeat:-1,
      hideOnComplete: false,
      
      });
      console.log('entro a la animacion destruccion');
      self.explotion3.play('explot3');
    }
    //funcion que procesa el dano y el porcentaje de acierto
    function RecibeHit(player, playerIMG, damage){
      console.log('dentro de RecibeHit');
      hitted(player.x, player.y);
      //aca van las funciones de acierto
      if(player.vida > 0){
        console.log('la vida es mayor que 0', player.vida);
        player.vida = player.vida - damage;
        
        console.log('la vida luego del danio', player.vida);
      }
      if(player.vida <= 0){
        console.log('vida menor que 0');
        destroyed(playerIMG);
        playerIMG.setActive(false);
        playerIMG.setVisible(false);
      }
    }
    //funcion que convierte el cursor en una mira
    this.input.on('pointermove', function (pointer) {
    //maneja la mira del destructor con el cursor  
      if(self.equipo === 1){
        if (this.input.mouse.locked){
          self.destructor.reticula.x += pointer.movementX;
          self.destructor.reticula.y += pointer.movementY;
        }
        if(self.destructor.armas == 0){
          distMax = 250;
          if ((self.destructor.reticula.x - self.destructor.imagen.x) > distMax)
              self.destructor.reticula.x = self.destructor.imagen.x +distMax;
            else if (self.destructor.reticula.x - self.destructor.imagen.x < -distMax)
              self.destructor.reticula.x = self.destructor.imagen.x -distMax;
            if (self.destructor.reticula.y - self.destructor.imagen.y > distMax)
              self.destructor.reticula.y = self.destructor.imagen.y +distMax;
            else if (self.destructor.reticula.y - self.destructor.imagen.y < -distMax)
              self.destructor.reticula.y = self.destructor.imagen.y-distMax;
          //self.destructor.manejoMira(self.destructor.imagen.x, self.destructor.imagen.y, self.destructor.reticula.x, self.destructor.reticula.y);
        }else{
          distMax = 80;
          if ((self.destructor.reticula.x - self.destructor.imagen.x) > distMax)
              self.destructor.reticula.x = self.destructor.imagen.x +distMax;
            else if (self.destructor.reticula.x - self.destructor.imagen.x < -distMax)
              self.destructor.reticula.x = self.destructor.imagen.x -distMax;
            if (self.destructor.reticula.y - self.destructor.imagen.y > distMax)
              self.destructor.reticula.y = self.destructor.imagen.y +distMax;
            else if (self.destructor.reticula.y - self.destructor.imagen.y < -distMax)
              self.destructor.reticula.y = self.destructor.imagen.y-distMax;
        }
      }else{
    //maneja la mira del submarino con el cursor
        if (this.input.mouse.locked){
          self.submarino.reticula.x += pointer.movementX;
          self.submarino.reticula.y += pointer.movementY;
        }
        if(self.submarino.armas == 0){
          distMax = 300;
          if ((self.submarino.reticula.x - self.submarino.imagen.x) > distMax)
              self.submarino.reticula.x = self.submarino.imagen.x +distMax;
            else if (self.submarino.reticula.x - self.submarino.imagen.x < -distMax)
              self.submarino.reticula.x = self.submarino.imagen.x -distMax;
            if (self.submarino.reticula.y - self.submarino.imagen.y > distMax)
              self.submarino.reticula.y = self.submarino.imagen.y +distMax;
            else if (self.submarino.reticula.y - self.submarino.imagen.y < -distMax)
              self.submarino.reticula.y = self.submarino.imagen.y-distMax;
        }else{
          distMax = 150;
            if ((self.submarino.reticula.x - self.submarino.imagen.x) > distMax)
                self.submarino.reticula.x = self.submarino.imagen.x +distMax;
              else if (self.submarino.reticula.x - self.submarino.imagen.x < -distMax)
                self.submarino.reticula.x = self.submarino.imagen.x -distMax;
              if (self.submarino.reticula.y - self.submarino.imagen.y > distMax)
                self.submarino.reticula.y = self.submarino.imagen.y +distMax;
              else if (self.submarino.reticula.y - self.submarino.imagen.y < -distMax)
                self.submarino.reticula.y = self.submarino.imagen.y-distMax; 
        } 
      }
    }, this);

    // Destruye a un jugador cuando se desconecta del socket
    this.socket.on('playerDisconnected', function (playerId){
      if (playerId != self.socket.id){
        if(self.equipo===1){
          console.log("Se desconecto el submarino")
          //self.submarino.destroy();
        }else{
          console.log("Se desconectaron el destructor y los cargueros")
          //self.destructor.destroy();
          // Destruir cargueros tambien
        }
      }
    });
    
    // Creo el evento de movimiento de cada jugador para comunicar a través del Socket
    this.socket.on('playerMoved', function (playerInfo) {
      if(playerInfo.id != self.socket.id){
        if(self.equipo===1){
          self.submarino.imagen.x = playerInfo.x;
          self.submarino.imagen.y = playerInfo.y;
          self.submarino.imagen.rotation = playerInfo.rotation;
        }else{
          self.destructor.imagen.x = playerInfo.x;
          self.destructor.imagen.y = playerInfo.y;
          self.destructor.imagen.rotation = playerInfo.rotation;
        }
      }
    });
    //escucho el tiro que me dieron desde el otro jugADOR y lo proceso
    this.socket.on('playerHitted', function(playerInfo){      
      console.log('SOY EL QUE RECIBE! OUCH!');
      //if(self.socket.id === playerInfo.id){
        if(self.equipo===1){
          console.log('entre al recibidor de hitt de destructor');
            hitted(self.destructor.imagen.x, self.destructor.imagen.x);
            RecibeHit(self.destructor, self.destructor.imagen, playerInfo.damage);
        }else{
          console.log('entre al recibidor de hitt de submarino');
            hitted(self.submarino.imagen.x, self.submarino.imagen.y);
            RecibeHit(self.submarino, self.submarino.imagen, playerInfo.damage);
        }
      //}
    }); 

    // Si es el equipo 1, muestro el boton para cambiar de camara con los cargueros
    if (this.equipo === 1){
      const btnCamaraCarguero = this.add.text(600, 600, 'BOTON PARA CAMBIAR DE CAMARA CON LOS CARGUEROS', { fill: '#000000' }).setScrollFactor(0).setInteractive().on('pointerdown', () => cambioCamaraCargueros(1));
      const btnCamaraDestructor = this.add.text(600, 650, 'BOTON PARA CAMBIAR DE CAMARA CON EL DESTRUCTOR', { fill: '#000000' }).setScrollFactor(0).setInteractive().on('pointerdown', () => cambioCamaraCargueros(0));
    }
    // Metodo que cambia de camara con el carguero central de la formacion
    function cambioCamaraCargueros(camara){
      if(camara==0){
        self.cameras.main.startFollow(self.destructor.imagen,true, 0.09, 0.09); 
        self.cameras.main.setZoom(0.9);
      }else if(camara==1){
        self.cameras.main.startFollow(self.carguero,true, 0.09, 0.09); 
        self.cameras.main.setZoom(1.4);
      }
    }
  }

  // Función update, se refresca constantemente para ir dibujando los distintos cambios que sucedan en la escena, aqui se agrega todo lo que se desea que se actualice y refleje graficamente
  update(time, delta) {
    if(this.equipo === 1){
      // Agregamos el movimiento de los barcos con las flechas de direccion y seteamos la velocidad de rotacion de giro del barco
      if (this.destructor){
        if (this.cursors.left.isDown && (this.cursors.up.isDown || this.cursors.down.isDown)) {
          this.destructor.imagen.setAngularVelocity(-100)
        } else if (this.cursors.right.isDown && (this.cursors.up.isDown || this.cursors.down.isDown)) {
          this.destructor.imagen.setAngularVelocity(100)
        } else {
          this.destructor.imagen.setAngularVelocity(0) // Si no se esta apretando la tecla de arriba o abajo la velocidad de rotacion y de giro es 0
        }
       
        // Calculo y seteo la velocidad de los barcos y el angulo de rotacion como una constante
        const velX = Math.cos((this.destructor.imagen.angle - 360) * 0.01745)
        const velY = Math.sin((this.destructor.imagen.angle - 360) * 0.01745)
        if (this.cursors.up.isDown) {
          this.destructor.imagen.setVelocityX(200 * velX)
          this.destructor.imagen.setVelocityY(200 * velY)
        } else if (this.cursors.down.isDown) {
          this.destructor.imagen.setVelocityX(-100 * velX)
          this.destructor.imagen.setVelocityY(-100 * velY)
        } else {
          // Seteo todo en 0 porque no se esta moviendo
          this.destructor.imagen.setAcceleration(0)
          this.destructor.imagen.setVelocityX(0)
          this.destructor.imagen.setVelocityY(0)
        }
        
        let oldPosition = {}
        // Comparo la posicion y rotacion actual del barco, y en caso de que haya cambiado envio el evento "playerMovement" al socket para comunicar a todos los clientes
        var x = this.destructor.imagen.x;
        var y = this.destructor.imagen.y;
        var r = this.destructor.imagen.rotation;

        if (oldPosition && (x !== oldPosition.x || y !== oldPosition.y || r !== oldPosition.rotation)) {
          let data = {
            x: this.destructor.imagen.x,
            y: this.destructor.imagen.y,
            rotation: this.destructor.imagen.rotation
          }
          this.socket.emit('playerMovement', data)
        }
        
        // Guardo la posicion actual del destructor para comparar con la nueva y chequear si hubo movimiento
        oldPosition = {
          x: this.destructor.posX,
          y: this.destructor.posX,
          rotation: this.destructor.rotacion
        }
      }
      
      // Agregamos el movimiento de los cargueros con las teclas WASD y seteamos la velocidad de rotacion de giro del barco
      if (this.carguero){
        if (this.left.isDown && (this.up.isDown || this.down.isDown)) {
          this.carguero.setAngularVelocity(-100)
        } else if (this.right.isDown && (this.up.isDown || this.down.isDown)) {
          this.carguero.setAngularVelocity(100)
        } else {
          this.carguero.setAngularVelocity(0) // Si no se esta apretando la tecla de arriba o abajo la velocidad de rotacion y de giro es 0
        }

        // Calculo y seteo la velocidad de los barcos y el angulo de rotacion como una constante
        const velCX = Math.cos((this.carguero.angle - 360) * 0.01745)
        const velCY = Math.sin((this.carguero.angle - 360) * 0.01745)
        if (this.up.isDown) {
          this.carguero.setVelocityX(200 * velCX)
          this.carguero.setVelocityY(200 * velCY)
        } else if (this.down.isDown) {
          this.carguero.setVelocityX(-100 * velCX)
          this.carguero.setVelocityY(-100 * velCY)
        } else {
          this.carguero.setAcceleration(0)
        }

        // Comparo la posicion y rotacion actual del barco, y en caso de que haya cambiado envio el evento "playerMovement" al socket para comunicar a todos los clientes
        var x = this.carguero.posX;
        var y = this.carguero.posY;
        var r = this.carguero.rotacion;
        if (this.carguero.oldPosition && (x !== this.carguero.oldPosition.x || y !== this.carguero.oldPosition.y || r !== this.carguero.oldPosition.rotation)) {
          this.socket.emit('playerMovement', { x: this.carguero.posX, y: this.carguero.posY, rotation: this.carguero.rotacion })
        }

        // Guardo la posicion actual del barco para comparar con la nueva y chequear si hubo movimiento
        this.carguero.oldPosition = {
          x: this.carguero.posY,
          y: this.carguero.posY,
          rotation: this.carguero.rotacion
        }
      }
    }else{
      if (this.submarino){
        if (this.cursors.left.isDown && (this.cursors.up.isDown || this.cursors.down.isDown)) {
          this.submarino.imagen.setAngularVelocity(-100)
        } else if (this.cursors.right.isDown && (this.cursors.up.isDown || this.cursors.down.isDown)) {
          this.submarino.imagen.setAngularVelocity(100)
        } else {
          this.submarino.imagen.setAngularVelocity(0) // Si no se esta apretando la tecla de arriba o abajo la velocidad de rotacion y de giro es 0
        }

        let oldPosition = {}

        // Calculo y seteo la velocidad de los barcos y el angulo de rotacion como una constante
        const velX = Math.cos((this.submarino.imagen.angle - 360) * 0.01745)
        const velY = Math.sin((this.submarino.imagen.angle - 360) * 0.01745)
        if (this.cursors.up.isDown) {
          this.submarino.imagen.setVelocityX(200 * velX)
          this.submarino.imagen.setVelocityY(200 * velY)
        } else if (this.cursors.down.isDown) {
          this.submarino.imagen.setVelocityX(-100 * velX)
          this.submarino.imagen.setVelocityY(-100 * velY)
        } else {
          this.submarino.imagen.setAcceleration(0)
        }

        // Comparo la posicion y rotacion actual del barco, y en caso de que haya cambiado envio el evento "playerMovement" al socket para comunicar a todos los clientes
        var x = this.submarino.imagen.x;
        var y = this.submarino.imagen.y;
        var r = this.submarino.imagen.rotation;

        if (oldPosition && (x !== oldPosition.x || y !== oldPosition.y || r !== oldPosition.rotation)) {
          let data = {
            x: this.submarino.imagen.x,
            y: this.submarino.imagen.y,
            rotation: this.submarino.imagen.rotation
          }
          this.socket.emit('playerMovement', data)
        }
        
        // Guardo la posicion actual del submarino para comparar con la nueva y chequear si hubo movimiento
        oldPosition = {
          x: this.submarino.posX,
          y: this.submarino.posY,
          rotation: this.submarino.rotacion
        }
      }
    }
    
    // Se intentan leer por teclado las letras M y U para mutear y desmutear la musica
    if (this.KeyMute.isDown){
      console.log('Muteo audio')
      //this.sound.stop();
    }
    if (this.KeyUnmute.isDown){
      console.log('Desmuteo audio')
      //this.sound.play();
      //this.sound.add('Music').play();
    }
  }
}