function Communications(){
	this.init();
}
Communications.prototype = {
	init: function(){
		this.socket = io.connect('http://localhost:80/');
		//this.socket = io.connect('http://104.197.217.162:80/');
		this.sendClientInfo();

		this.socket.on('chat', onChat);
		this.socket.on('start info', onStartInfo);
		this.socket.on('spawn', onSpawn);

	},

	sendClientInfo: function(){
		this.socket.emit('client info', {width: width, height: height, stage_width: stage_width, stage_height: stage_height});
	},
	update: function(time){

	},
}; // end Communications

function onChat(msg){
	console.log(msg)
}
function onSpawn(msg){
	console.log('onSpawn')
	characters.spawn({x: msg.x*stage_width, y: msg.y*stage_height,
					type: CharacterType.Cow});
}
function onStartInfo(msg){
	gamestate = GameState.InPlay;
	team = msg.team;
	teamcolor = msg.color;
	startlocation = msg.location;
	game.startgame();
}
