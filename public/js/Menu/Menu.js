function Menu(){	
	this.init();
}
Menu.prototype = {
	init: function(){
		this.mainmenu = new MainMenu();
		this.multiplayermenu = new MultiPlayerMenu();
		this.onAssetsLoaded();
	},	
	restart :function(){
	},
	clean	: function(){
				
	},
	update : function(time){
		
		
	},
	onAssetsLoaded : function(){
		this.mainmenu.onAssetsLoaded();
	},	
	update: function(time){
		switch(gamestate){
			case GameState.Loading:
			case GameState.MainMenu:
				this.mainmenu.update(time);
			break;
			case GameState.MultiPlayerMenu:
				this.multiplayermenu.update(time);
			break;
		}
	}, // end update	
} // end Menu