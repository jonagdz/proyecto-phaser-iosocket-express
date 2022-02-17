import { Bote } from '../logica/bote.js';

export class Destructor extends Bote {

    constructor(nom,vida,velocidad,posX,posY,rotacion,cantMunicion,armas){
        super(nom,vida,velocidad,posX,posY,rotacion);

        // Atributos propios
        this.cantMunicion = cantMunicion;
        this.armas = armas;
    };

    // Metodos: Se definen los metodos de manera interna a la funcion para no generar conflictos con los nombres de otros metodos globalmente

    // Getters
    getNom() {
        return this.nom;
    };

    getVida() {
        return this.vida;
    };

    getVelocidad() {
        return this.velocidad;
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

    getCantMunicion() {
        return this.cantMunicion;
    };

    getArmas() {
        return this.armas;
    };

    // Setters
    setNom(nuevoNom) {
        this.nom = nuevoNom;
    };

    setVida(nuevaVida) {
        this.vida = nuevaVida;
    };

    setVelocidad(nuevaVelocidad) {
        this.velocidad = nuevaVelocidad;
    };

    setPosX(nuevaPosX) {
        this.posX = nuevaPosX;
    };

    setPosY(nuevaPosY) {
        this.posY = nuevaPosY;
    };

    setRotacion(nuevaRotacion) {
        this.rotacion = nuevaRotacion;
    };

    setCantMunicion(nuevaCantMunicion) {
        this.cantMunicion = nuevaCantMunicion;
    };

    setArmas(nuevaArmas) {
        this.armas = nuevaArmas;
    };

    // Metodos propios
    // Disparo

    // Daño

    // Metodos auxiliares

    // Los metodos de Vision, Detección y Colision los heredaria de bote y habria que hacerle las modificaciones correspondientes (Ej. rango de vision x3)
}