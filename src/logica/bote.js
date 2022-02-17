export class Bote{

    constructor(nom,vida,velocidad,posX,posY,rotacion){

        // Atributos propios
        this.nom = nom;
        this.vida = vida;
        this.velocidad = velocidad;
        this.posX = posX;
        this.posY = posY;
        this.rotacion = rotacion;
    };

    // Metodos
    // Se definen los metodos de manera interna a la funcion para no generar conflictos con los nombres de otros metodos globalmente

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

    // Metodos propios
    // Colision

    // Vision

    // Detección


    // Metodos auxiliares
};