import { Bote } from './bote.js';

export class Carguero { // extends Bote
    
    constructor(nom,velocidad,vida,posX,posY,rotacion,cod,imagen){
        //super(nom,velocidad,vida,posx,posy,rotacion);

        // Atributos propios
        this.nom = nom;
        this.velocidad = velocidad;
        this.vida = vida;
        this.posX = posX;
        this.posY = posY;
        this.rotacion = rotacion;
        this.cod = cod;
        this.imagen = imagen;
    };

    // Metodos
    // Se definen los metodos de manera interna a la funcion para no generar conflictos con los nombres de otros metodos globalmente

    // Getters
    getNom() {
        return this.nom;
    };
    
    getVelocidad() {
        return this.Velocidad;
    };
    
    getVida() {
        return this.vida;
    };
    
    getPosX() {
        return this.posx;
    };
    
    getPosy() {
        return this.posy;
    };

    getRotacion() {
        return this.rotacion;
    };

    getCod() {
        return this.cod;
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

    // Metodos propios
    // Colision

    // Disparo

    // Vision

    // Detección

    // Daño

    // Restar vida
    disminuirVida(puntos){
        this.vida-=puntos;
    };

    // Aumentar vida
    incrementarVida(puntos){
        this.vida+=puntos;
    };
    
    // Metodos axuiliares

}