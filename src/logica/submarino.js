import { Bullets } from '../logica/bullet.js';

//Clase Submarino
export class Submarino{
    constructor(nom,velocidad,profundidad,vida,posX,posY,rotacion,cod,sonar,imagen,bullet,armas,reticula,largavista, ammoTor, ammoCan){
        //Atributos propios
        this.nom = nom;
        this.velocidad = velocidad;
        this.profundidad = profundidad;
        this.vida = vida;
        this.posX = posX;
        this.posY = posY;
        this.rotacion = rotacion;
        this.cod = cod;
        this.sonar = sonar;
        this.imagen = imagen;
        this.bullet = bullet;
        this.armas = armas;
        this.reticula = reticula;
        this.largavista = largavista;
        this.ammoTorpedos = ammoTor;
        this.ammoCanion = ammoCan;
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

    getSonar() {
        return this.sonar;
    };

    getArmas() {
        return this.armas;
    };

    getLargaVista() {
        return this.largavista;
    };

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

    setSonae(nuevoSonar) {
        this.sonar = nuevoSonar;
    };

    setArmas(nuevaArmas) {
        this.armas = nuevaArmas;
    };

    setLargaVistas(nuevoLargaVistas) {
        this.largavista = nuevoLargaVistas;
    };
}