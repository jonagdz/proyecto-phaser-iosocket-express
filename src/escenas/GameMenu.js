import { DEF } from "../def.js";

export class GameMenu extends Phaser.Scene{
  constructor(){
      super({key:'GameMenu'});
    }
          
  create(){

        const self = this;

        self.add.image(0, 0, DEF.IMAGENES.FONDO).setOrigin(0).setScrollFactor(1);

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
            self.scene.start(DEF.SCENES.MENU);
        }

        function ClickCARG(){
            console.log("cargar partida");
        }
        
        function ClickCREDITS(){
            self.scene.start(DEF.SCENES.CREDITS); 
        }

        function ClickCONTROL(){
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