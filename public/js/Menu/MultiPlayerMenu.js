function MultiPlayerMenu(){
	stage_multiplayer_menu = new PIXI.Container();

	this.icons = [];

	//this.init();
}
MultiPlayerMenu.prototype = {
	init: function(){
		communication.connect();
		//ReactDOM.render(myChatMonitor, document.getElementById('content'));
		render_myChatMonitor();
	},
	update: function(time){

	},
} // end MultiPlayerMenu
