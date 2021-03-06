//Definiciones de elementos multimedia
import { DEF } from "../def.js";

//Clase GameMenu
export class GameMenu extends Phaser.Scene{
    constructor(){
      super({key:'GameMenu'});
    }
    
    //Procedimiento inicializador
    init(){
        this.cargaPartida = false;
        this.partidaCargada;
        this.contJugador = 0;
        this.uno = true;
        this.partidaIniciada = false;
    }

    //Procedimiento de creación 
    create(){
        const self = this;
        this.socket = io();

        //Carga de imagen de fondo
        self.add.image(0, 0, DEF.IMAGENES.FONDO).setOrigin(0).setScrollFactor(1);

        //Carga de video
        self.intro = self.add.video(0, 0, DEF.VIDEO.INTRO).setOrigin(0).setScrollFactor(1).setScale(2.4);
        self.intro.play(true);
        self.intro.setPaused(false);

        //Carga de audio
        self.sounIntro = self.sound.add(DEF.AUDIO.MENU);
        self.sounIntro.play({volume: 0.7, loop: true});
        
        //Carga de sprites
        this.ini = self.add.sprite(790, 200, 'initpart').setOrigin(0).setScrollFactor(1).setDepth(2).setInteractive().on('pointerdown', () =>clickINIT());
        this.ini.setInteractive().on('pointerover', () => elegirIni(1));
        this.ini.setInteractive().on('pointerout', () => elegirIni(2));

        this.carg = self.add.sprite(790, 400, 'cargarpart').setOrigin(0).setScrollFactor(1).setDepth(2).setInteractive().on('pointerdown', () =>clickCARG());
        this.carg.setInteractive().on('pointerover', () => elegirCarg(1));
        this.carg.setInteractive().on('pointerout', () => elegirCarg(2));

        this.cont = self.add.sprite(790, 600, 'controls').setOrigin(0).setScrollFactor(1).setDepth(2).setInteractive().on('pointerdown', () =>clickCONTROL());
        this.cont.setInteractive().on('pointerover', () => elegirCont(1));
        this.cont.setInteractive().on('pointerout', () => elegirCont(2));

        this.cr = self.add.sprite(790, 800, 'credits').setOrigin(0).setScrollFactor(1).setDepth(2).setInteractive().on('pointerdown', () =>clickCREDITS());
        this.cr.setInteractive().on('pointerover', () => elegirCred(1));
        this.cr.setInteractive().on('pointerout', () => elegirCred(2));
        
        //Elección de iniciar partida
        function clickINIT(){
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

        //Elección de cargar partida
        function clickCARG()
        {            
            self.sounIntro.stop();
            self.socket.emit('cargarPartida', {data: 2});
            self.socket.emit('cargaPartIndication');
        }

        //Elección de créditos
        function clickCREDITS(){
            self.sounIntro.stop();
            self.scene.start(DEF.SCENES.CREDITS); 
        }

        //Elección de control
        function clickCONTROL(){
            self.sounIntro.stop();
            self.scene.start(DEF.SCENES.CONTROLS); 
        }

        //Sprite iniciar partida
        function elegirIni(tru){
            if(tru===1){
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

        //Sprite cargar partida
        function elegirCarg(v){
            if(v===1){
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

        //Sprite controles
        function elegirCont(u){
            if(u===1){
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

        //Sprite créditos
        function elegirCred(va){
            if(va===1){
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

        //Procedimientos sockets
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
        })
    }
}