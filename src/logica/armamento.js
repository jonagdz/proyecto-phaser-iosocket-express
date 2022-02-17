export class Armamento {

    constructor(tipoarmamanto,cod,nombre,calibre,descripcion,municion,danio){
        if(tipoarmamento === "CAÑON105"){
            this.cod = 1;
            this.nombre = "CAÑON 105 MM";
            this.calibre = "105 MM";
            this.descripcion = "CAÑON DE 105 MM";
            this.municion = 20;
            this.danio=1;
        }else{
            if (tipoarmamento === "TORPEDO"){
                this.cod = 2;
                this.nombre = "TORPEDO";
                this.calibre = "533 MM";
                this.descripcion = "TORPEDO";
                this.municion = 16;
                this.danio = 2;
            }else{
                if(tipoarmamento === "CAÑON127"){
                    this.cod=3;
                    this.nombre="CAÑON 127 MM";
                    this.calibre="127 MM";
                    this.descripcion = "CAÑON DE 127 MM";
                    this.municion = 30;
                    this.danio = 1;
                }else{
                    this.cod=4;
                    this.nombre="CARGA DE PROFUNDIDAD";
                    this.calibre="CAÑON 127 MM";
                    this.descripcion = "CARGA DE PROFUNDIDAD";
                    this.municion = 10;
                    this.danio = 3;
                };
            };
        }; 
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