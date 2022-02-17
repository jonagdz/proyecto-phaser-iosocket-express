export class Armamento {
    constructor(cod,nombre,calibre,descripcion,municion,danio){

        // Atributos propios
        this.cod = cod;
        this.nombre = nombre;
        this.calibre = calibre;
        this.descripcion = descripcion;
        this.municion = municion;
        this.danio = danio;
    };

    // Metodos: se definen los metodos de manera interna a la funcion para no generar conflictos con los nombres de otros metodos globalmente

    // Getters
    getCod() {
        return this.cod;
    };

    getNombre() {
        return this.nombre;
    };

    getCalibre() {
        return this.calibre;
    };
    
    getDescripcion() {
        return this.descripcion;
    };

    getMunicion() {
        return this.municion;
    };

    getDanio() {
        return this.danio;
    };

    // Setters
    setCod(nuevoCod) {
        this.cod = nuevoCod;
    };

    setNombre(nuevoNombre) {
        this.nombre = nuevoNombre;
    };

    setVida(nuevoCalibre) {
        this.calibre = nuevoCalibre;
    };

    setPosX(nuevaDescripcion) {
        this.descripcion = nuevaDescripcion;
    };

    setPosY(nuevaMunicion) {
        this.municion = nuevaMunicion;
    };

    setRotacion(nuevoDanio) {
        this.danio = nuevoDanio;
    };

    // Metodos propios

    // Metodos auxiliares
}