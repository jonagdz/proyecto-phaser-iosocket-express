import { Bullets } from '../logica/bullet.js';

export class Submarino{

    constructor(nom,velocidad,profundidad,vida,posX,posY,rotacion,cod,imagen, bullet,armas, reticula){

        // Atributos propios
        this.nom = nom;
        this.velocidad = velocidad;
        this.profundidad = profundidad;
        this.vida = vida;
        this.posX = posX;
        this.posY = posY;
        this.rotacion = rotacion;
        this.cod = cod;
        this.imagen = imagen;
        this.bullet = bullet;
        this.armas = armas;
        this.reticula = reticula;
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
        return this.posx;
    };

    getPosY() {
        return this.posy;
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

   /* manejoMira(X, Y, miraX, miraY){
        console.log("la distancia entre mira y x", (miraX - X));
        console.log("la distancia entre mira e Y", (miraY - Y));
        console.log("entro al manejo de la mira");
        //if(this.armas === 0){
        if ((miraX - X) > 100){
            miraX = X + 100;
        }else if ((miraX - X) < -100){
            miraX = X - 100;
        }
        if ((miraY - Y) > 100){
            miraY = Y + 100;
        }else if ((miraY - Y) < -100){
            miraY = Y - 100;
        }    
        /*}else if(this.armas === 1){
          if (miraX - X > 50)
            miraX = X + 50;
          else if (miraX - X < -50)
            miraX = X - 50;
          if (miraY - Y > 50)
            miraY = Y + 50;
          else if (miraY - Y < -50)
            miraY = Y - 50;
        }*/
   // }
}