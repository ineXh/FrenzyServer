function MultiPlayerMenu(){stage_multiplayer_menu=new PIXI.Container,this.icons=[]}MultiPlayerMenu.prototype={init:function(){communication.connect().then(function(n){console.log("connected"),render_myloginWindow()},function(n){console.log("cannot connect")})},init_main:function(){gamestate=GameState.MultiPlayerMenu,render_mymainInterface()},update:function(n){}};