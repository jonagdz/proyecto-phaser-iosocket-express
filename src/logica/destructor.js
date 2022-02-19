import { Bote } from './bote.js';

export class Destructor extends Bote {

    constructor(nom,velocidad,vida,posx,posy,rotacion,cod,armas){
        super(nom,velocidad,vida,posx,posy,rotacion);

        // Atributos propios
        this.cod = cod;
        this.armas = armas;
        this.vida = 8;
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

    // Metodos propios
    // Disparo

    // Daño

    // Metodos auxiliares

    // Los metodos de Vision, Detección y Colision los heredaria de bote y habria que hacerle las modificaciones correspondientes (Ej. rango de vision x3)
}