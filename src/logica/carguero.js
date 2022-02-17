//import { Bote } from './logica/bote.js';

export class Carguero extends Bote () {
    
    constructor(nom, velocidad,vida,posx,posy,cod){
        super(nom, velocidad, vida, posx, posy);

        // Atributos propios
        this.cod=cod;
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

    // Setters
    setNom(nom) {
        this.nom = nom;
    };
    
    setVelocidad(velocidad) {
        this.velocidad = velocidad;
    };
    
    setVida(vida) {
        this.vida = vida;
    };
    
    setPosX(posx) {
        this.posx = posx;
    };
    
    setPosY(posy) {
        this.posy = posy;
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