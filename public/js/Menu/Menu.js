function Menu(){this.init()}Menu.prototype={init:function(){this.mainmenu=new MainMenu,this.multiplayermenu=new MultiPlayerMenu,this.onAssetsLoaded()},restart:function(){},clean:function(){},update:function(e){},onAssetsLoaded:function(){this.mainmenu.onAssetsLoaded()},update:function(e){switch(gamestate){case GameState.Loading:case GameState.MainMenu:this.mainmenu.update(e);break;case GameState.MultiPlayerMenu:this.multiplayermenu.update(e)}}};