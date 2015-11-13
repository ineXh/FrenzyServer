function Menu(){	
	this.init();
}
Menu.prototype = {
	init: function(){
		this.mainmenu = new MainMenu();
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
		this.mainmenu.update(time);
	}, // end update	
} // end Menu