import { bootGame } from './escenas/bootGame.js';
import { game } from './escenas/game.js';
import { Bullets } from './logica/bullet.js';
import { Destructor } from './logica/destructor.js';
import { Carguero } from './logica/carguero.js';

// Configuracion de Phaser
var config = {
  type: Phaser.AUTO,
  scale: {
    //mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'thegame',
    width: 1920,
    height: 1080,
  },
  backgroundColor: '#ffffff',
  physics: {
    default: 'arcade',
    arcade: {
      debug: true, // En true para ver las hitbox reales de los objetos y el vector a donde apunta la direccion junto con la fuerza (tamaño de la flecha de direccion)
      gravity: { y: 0 }
    }
  },
  scene: [bootGame, game]
}

 // Defino mis variables
 var Game;
 Game = new Phaser.Game(config);
  //Metodo pque escucha cuando se hace un click en la pantalla, lockea el cursor para usarlo como mira
 Game.canvas.addEventListener('mousedown', function () {
  Game.input.mouse.requestPointerLock();
});