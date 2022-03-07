import { DEF } from "../def.js";

export class GameMenu extends Phaser.Scene{
  constructor(){
      super({key:'GameMenu'});
    }
          
    init()
  {
    this.cargaPartida = false;
    this.partidaCargada;
    this.contJugador = 0;
    this.uno = true;
    this.partidaIniciada = false;
  }

  create(){

        const self = this;
        this.socket = io();

        self.add.image(0, 0, DEF.IMAGENES.FONDO).setOrigin(0).setScrollFactor(1);
        self.intro = self.add.video(0, 0, DEF.VIDEO.INTRO).setOrigin(0).setScrollFactor(1).setScale(2.4);
        self.intro.play(true);
        self.intro.setPaused(false);
        self.sounIntro = self.sound.add(DEF.AUDIO.MENU);
        self.sounIntro.play({volume: 0.7, loop: true});

  ///////////////////////////////////////////////////////////////////////////////////////////      
        this.ini = self.add.sprite(790, 200, 'initpart').setOrigin(0).setScrollFactor(1).setDepth(2).setInteractive().on('pointerdown', () =>ClickINIT());
        this.ini.setInteractive().on('pointerover', () => ElegirIni(1));
        this.ini.setInteractive().on('pointerout', () => ElegirIni(2));

  /////////////////////////////////////////////////////////////////////////////////////////// 
        this.carg = self.add.sprite(790, 400, 'cargarpart').setOrigin(0).setScrollFactor(1).setDepth(2).setInteractive().on('pointerdown', () =>ClickCARG());
        this.carg.setInteractive().on('pointerover', () => ElegirCarg(1));
        this.carg.setInteractive().on('pointerout', () => ElegirCarg(2));

  ///////////////////////////////////////////////////////////////////////////////////////////   

        this.cont = self.add.sprite(790, 600, 'controls').setOrigin(0).setScrollFactor(1).setDepth(2).setInteractive().on('pointerdown', () =>ClickCONTROL());
        this.cont.setInteractive().on('pointerover', () => ElegirCont(1));
        this.cont.setInteractive().on('pointerout', () => ElegirCont(2));

 /////////////////////////////////////////////////////////////////////////////////////////// 
        this.cr = self.add.sprite(790, 800, 'credits').setOrigin(0).setScrollFactor(1).setDepth(2).setInteractive().on('pointerdown', () =>ClickCREDITS());
        this.cr.setInteractive().on('pointerover', () => ElegirCred(1));
        this.cr.setInteractive().on('pointerout', () => ElegirCred(2));
 /////////////////////////////////////////////////////////////////////////////////////////// 
        function ClickINIT(){
            self.sounIntro.stop();
            var data = {
                socket: self.socket,
                cargaPartida: self.cargaPartida,
                partidaCargada: self.partidaCargada,
                contador: self.contJugador,
                uno: self.uno,
                partIni: self.partidaIniciada
              }
            self.socket.emit('iniciarPartidaIndication');
            self.scene.start(DEF.SCENES.MENU, data);
        }

        function ClickCARG()
        {            
            self.sounIntro.stop();
            self.socket.emit('cargarPartida', {data: 2});
            self.socket.emit('cargaPartIndication');
        }

        self.socket.on('cargaPartIndicated', function(data){
            if(data.id != self.socket.id)
            {
                self.uno = data.uno;
            }
        })

        self.socket.on('partidaIniciadaIndicated', function(data){
            if(data.id != self.socket.id)
            {
                self.partidaIniciada = true;
            }
        })


        self.socket.on('partidaCargada', function (partida) {
            self.partidaCargada = partida;
            self.cargaPartida = true;
            var data = {
                socket: self.socket,
                cargaPartida: self.cargaPartida,
                partidaCargada: partida,
                contador: self.contJugador,
                uno: self.uno
            }
            self.scene.start(DEF.SCENES.MENU, data);
        })
        

        self.socket.on('seUneJugador', function(data){
            self.contJugador = data;
            //console.log('se une jugador: '+self.contJugador)
        })

        function ClickCREDITS(){
            self.sounIntro.stop();
            self.scene.start(DEF.SCENES.CREDITS); 
        }

        function ClickCONTROL(){
            self.sounIntro.stop();
            console.log("controles");
            self.scene.start(DEF.SCENES.CONTROLS); 
        }

        function ElegirIni(tru){

            if(tru===1){
                //console.log("entroalif");
                self.anims.create({  
                key: 'animinini',
                frames: [
                    { key: 'initpart',frame:"botonIniciarPartida1barco2.png" },

                ],
                frameRate: 5,
                repeat:-1,
                hideOnComplete: true,
                
                });
                self.ini.play('animinini');
            }
            else{
                //console.log("entroalelse");
                self.anims.create({  
                key: 'animin',
                frames: [
                    { key: 'initpart',frame:"botonIniciarPartida1barco.png" },

                ],
                frameRate: 5,
                repeat:-1,
                hideOnComplete: true,
                
                });
                self.ini.play('animin');
            }
        }


        function ElegirCarg(v){

            if(v===1){
                //console.log("entroalif");
                self.anims.create({  
                key: 'animinc',
                frames: [
                    { key: 'cargarpart',frame:"botonCargarPartida1carpeta.png" },

                ],
                frameRate: 5,
                repeat:-1,
                hideOnComplete: true,
                
                });
                self.carg.play('animinc');
            }
            else{
                //console.log("entroalelse");
                self.anims.create({  
                key: 'animincc',
                frames: [
                    { key: 'cargarpart',frame:"botonCargarPartida1carpeta1.png" },

                ],
                frameRate: 5,
                repeat:-1,
                hideOnComplete: true,
                
                });
                self.carg.play('animincc');
            }
        }

        function ElegirCont(u){

            if(u===1){
                //console.log("entroalif");
                self.anims.create({  
                key: 'anim',
                frames: [
                    { key: 'controls',frame:"botonControles2.png" },

                ],
                frameRate: 5,
                repeat:-1,
                hideOnComplete: true,
                
                });
                self.cont.play('anim');
            }
            else{
                //console.log("entroalelse");
                self.anims.create({  
                key: 'animi',
                frames: [
                    { key: 'controls',frame:"botonControles1.png" },

                ],
                frameRate: 5,
                repeat:-1,
                hideOnComplete: true,
                
                });
                self.cont.play('animi');
            }
        }



        function ElegirCred(va){

            if(va===1){
                //console.log("entroalif");
                self.anims.create({  
                key: 'an',
                frames: [
                    { key: 'credits',frame:"botonCreditos2.png" },

                ],
                frameRate: 5,
                repeat:-1,
                hideOnComplete: true,
                
                });
                self.cr.play('an');
            }
            else{
                //console.log("entroalelse");
                self.anims.create({  
                key: 'anm',
                frames: [
                    { key: 'credits',frame:"botonCreditos.png" },

                ],
                frameRate: 5,
                repeat:-1,
                hideOnComplete: true,
                
                });
                self.cr.play('anm');
            }
        }





    }
}