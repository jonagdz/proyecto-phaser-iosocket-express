//Definiciones de elementos multimedia
import { DEF } from "../def.js";
//Clases
import { Submarino } from '../logica/submarino.js';
import { Destructor } from '../logica/destructor.js';

//Clase Bullets
export class Bullets extends Phaser.Physics.Arcade.Sprite{
    constructor (scene){
        super(scene);
        Phaser.GameObjects.Image.call(this, scene, 0, 0, DEF.IMAGENES.BALA);
        this.speed = 1;
        this.born = 0;
        this.direction = 0;
        this.xSpeed = 0;
        this.ySpeed = 0;
    }

    //Dispara proyectiles hacia la reticula del jugador
    fire (jugador, reticula) {
        this.setPosition(jugador.x, jugador.y); // posicion inicial
        //Usamos el método numérico Math.atan para devolver el arcotangente entre el X y el Y
        this.direction = Math.atan( (reticula.x-this.x) / (reticula.y-this.y));
        //Calcula la velocidad desde el jugador a la reticula
        if (reticula.y >= this.y){
            this.xSpeed = this.speed*Math.sin(this.direction);
            this.ySpeed = this.speed*Math.cos(this.direction);
        }
        else{
            this.xSpeed = -this.speed*Math.sin(this.direction);
            this.ySpeed = -this.speed*Math.cos(this.direction);
        }
        //Pasa el angulo de la rotación del jugador a la bala
        this.rotation = jugador.rotation; 
        //Tiempo de demora hasta nacimiento de otra bala
        this.born = 0; 
    }

    update (time, delta){
        this.x += this.xSpeed * delta;
        this.y += this.ySpeed * delta;
        this.born += delta;
        if (this.born > 1800)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    } 
}