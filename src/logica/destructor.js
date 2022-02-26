import { Bote } from './bote.js';
import { Bullets } from '../logica/bullet.js';

export class Destructor { // extends Bote
    // se saca el astributo armas del destructor, ya que hay que importar y agregar la clase armas
    constructor(nom,velocidad,vida,posX,posY,rotacion,cod,imagen,bullet,armas,reticula, cargas){
        //super(nom,velocidad,vida,posX,posY,rotacion);

        // Atributos propios
        this.nom = nom;
        this.velocidad = velocidad;
        this.vida = vida;
        this.posX = posX;
        this.posY = posY;
        this.rotacion = rotacion;
        this.cod = cod;
        this.imagen = imagen;
        this.bullet = bullet;
        this.armas = armas;
        this.reticula = reticula;
        this.cargas = cargas;
    };

    // Metodos
    // Se definen los metodos de manera interna a la funcion para no generar conflictos con los nombres de otros metodos globalmente

    // Getters
    getNom() {
        return this.nom;
    };

    getVelocidad() {
        return this.velocidad;
    };

    getVida() {
        return this.vida;
    };

    getPosX() {
        return this.posX;
    };

    getPosY() {
        return this.posY;
    };

    getRotacion() {
        return this.rotacion;
    };

    getCod() {
        return this.cod;
    };

    getArmas() {
        return this.armas;
    };

    getCargas(){
        return this.cargas;
    }

    // Setters
    setNom(nuevoNom) {
        this.nom = nuevoNom;
    };

    setVelocidad(nuevaVelocidad) {
        this.velocidad = nuevaVelocidad;
    };

    setVida(nuevaVida) {
        this.vida = nuevaVida;
    };

    setPosX(nuevaPosX) {
        this.posx = nuevaPosX;
    };

    setPosY(nuevaPosY) {
        this.posy = nuevaPosY;
    };

    setRotacion(nuevaRotacion) {
        this.rotacion = nuevaRotacion;
    };

    setCod(nuevoCod) {
        this.cod = nuevoCod;
    };

    setArmas(nuevaArmas) {
        this.armas = nuevaArmas;
    };
    setCargas(nuevaCarga){
        this.cargas = nuevaCarga;
    }

    /*manejoMira(X, Y, miraX, miraY){
        let distX = miraX - X; // X distancia entre el jugador y la mira
        let distY = miraY - Y; // Y distancia entre el jugador y la mira
        console.log("el dist x es", distX, "y el distY es: ", distY);
        console.log("entro al manejo de la mira");
        //if(this.armas === 0){
          if (distX > 200)
            miraX = X + 200;
          else if (distX < -200)
            miraX = X - 200;
          if (distY > 200)
            miraY = Y + 200;
          else if (distY < -200)
            miraY = Y - 200;
        /*}else if(this.armas === 1){
          if (distX > 50)
            miraX = X + 50;
          else if (distX < -50)
            miraX = X - 50;
          if (distY > 50)
            miraY = Y + 50;
          else if (distY < -50)
            miraY = Y - 50;
 */
            //       }
    //}
    /*
    setAngularVelocity(value){
        this.imagen.setAngularVelocity(value);
    }
    setVelocityX(value){
        this.imagen.setVelocityX(value);
    }

    setVelocityY(value){
        this.imagen.setVelocityY(value);
    }

    setAcceleration(value){
        this.imagen.setAcceleration(value);
    }
    */
    
    
}