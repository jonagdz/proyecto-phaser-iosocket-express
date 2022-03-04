import { bootGame } from './escenas/bootGame.js';
import { preGameMenu } from './escenas/preGameMenu.js';
import { game } from './escenas/game.js';
import { GameMenu} from './escenas/GameMenu.js';
import { salaEspera } from './escenas/salaEspera.js';
import { gameOver } from './escenas/gameOver.js';
import { creditos } from './escenas/creditos.js';
import { controles } from './escenas/controles.js';

// Configuracion de Phaser
var config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'thegame',
    width: 1920,
    height: 1080,
  },
  backgroundColor: '#000000',
  pixelArt: false,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true, // En true para ver las hitbox reales de los objetos y el vector a donde apunta la direccion junto con la fuerza (tamaño de la flecha de direccion)
      gravity: { y: 0 }
    }
  },
  scene: [bootGame, preGameMenu, salaEspera, game, GameMenu, gameOver, creditos, controles]
}

window.onload = () =>{
  // Defino mis variables
  var Game;
  Game = new Phaser.Game(config);

}