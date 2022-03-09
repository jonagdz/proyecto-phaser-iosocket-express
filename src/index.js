//Clases
import { BootGame } from './escenas/BootGame.js';
import { PreGameMenu } from './escenas/PreGameMenu.js';
import { Game } from './escenas/Game.js';
import { GameMenu} from './escenas/GameMenu.js';
import { SalaEspera } from './escenas/SalaEspera.js';
import { GameOver } from './escenas/GameOver.js';
import { Creditos } from './escenas/Creditos.js';
import { Controles } from './escenas/Controles.js';

//Configuracion de Phaser
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
      debug: false,
      gravity: { y: 0 }
    }
  },
  //Escena incluidas
  scene: [BootGame, PreGameMenu, SalaEspera, Game, GameMenu, GameOver, Creditos, Controles]
}

window.onload = () =>{
  var Game;
  Game = new Phaser.Game(config);
}