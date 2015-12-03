function MultiPlayerMenu(){
	stage_multiplayer_menu = new PIXI.Container();

	this.icons = [];

	//this.init();
}
MultiPlayerMenu.prototype = {
	init: function(){
		communication.connect().then(function(value){
			console.log('connected')
			//render_myChatMonitor();
			render_myloginWindow();
		}, function(reason){
			console.log('cannot connect')
		});

		//ReactDOM.render(myChatMonitor, document.getElementById('content'));

	},
	init_main:function(){
		gamestate = GameState.MultiPlayerMenu;
		//render_myChatMonitor();
		render_mymainInterface();
	},
	init_gameroom: function(){
		gamestate = GameState.GameRoom;
		render_mygameroomInterface();
	},
	update: function(time){

	},
} // end MultiPlayerMenu
