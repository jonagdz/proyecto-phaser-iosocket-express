import { Bote } from './bote.js';

export class Destructor { // extends Bote
    // se saca el astributo armas del destructor, ya que hay que importar y agregar la clase armas
    constructor(nom,velocidad,vida,posX,posY,rotacion,cod,imagen){
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
        //this.armas = armas;
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
    // Metodos propios
    // Disparo

    // Daño

    // Metodos auxiliares

    // Los metodos de Vision, Detección y Colision los heredaria de bote y habria que hacerle las modificaciones correspondientes (Ej. rango de vision x3)
}