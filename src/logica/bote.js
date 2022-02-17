export class Bote {
    constructor(nom,velocidad,vida,posX,posY,rotacion){

        // Atributos propios
        this.nom = nom;
        this.velocidad = velocidad;
        this.vida = vida;
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
    // Dont to make a RenderTexture the size of your entire tilemap if your game scrolls. Adjust the position of the mask image based on how much the camera has scrolled. Keep the RenderTexture to the size of your screen.
    /*
    Vision = this.make.image({
		x: this.posX,
		y: this.posY,
		key: 'vision',
		add: false
	})
    */

    // Detección


    // Metodos auxiliares
}