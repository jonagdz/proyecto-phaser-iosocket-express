import { Bullets } from '../logica/bullet.js';

//Clase Destructor
export class Destructor {
    constructor(nom,velocidad,vida,posX,posY,rotacion,cod,imagen,bullet,armas,reticula, cargas, ammoCar, ammoCan){
        //Atributos propios
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
        this.ammoCargas = ammoCar;
        this.ammoCanion = ammoCan;
        this.parti; 
    };

    //Métodos
    //Se definen los metodos de manera interna a la funcion para no generar conflictos con los nombres de otros metodos globalmente
    //Getters
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

    //Setters
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
}