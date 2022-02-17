export class Bullets extends Phaser.Physics.Arcade.Sprite
  {
    constructor (scene){
          super(scene);
          Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
          this.speed = 1;
          this.born = 0;
          this.direction = 0;
          this.xSpeed = 0;
          this.ySpeed = 0;
          //this.setSize(12, 12, true);
    }

        //DIspara proyectiles hacia la reticula del jugador
    fire (jugador, reticula) {
          this.setPosition(jugador.x, jugador.y); // posicion inicial
          //usamos el metodo numerico Math.atan para devolver el arcotangente entre el X y el Y
          this.direction = Math.atan( (reticula.x-this.x) / (reticula.y-this.y));
          
          // Calcula la velocidad desde el jugador a la reticula
          if (reticula.y >= this.y){
              this.xSpeed = this.speed*Math.sin(this.direction);
              this.ySpeed = this.speed*Math.cos(this.direction);
          }
          else{
              this.xSpeed = -this.speed*Math.sin(this.direction);
              this.ySpeed = -this.speed*Math.cos(this.direction);
          }
    
          this.rotation = jugador.rotation; // pasa el angulo de la rotacion del jugador a la bala
          this.born = 0; // tiempo demora hasta nacimiento de otra bala
    }
    update (time, delta) {
          this.x += this.xSpeed * delta;
          this.y += this.ySpeed * delta;
          this.born += delta;
          if (this.born > 1800)
          {
              this.setActive(false);
              this.setVisible(false);
          }
    }

}