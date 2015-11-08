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
		this.socket.on('spawn existing', onSpawnExisting);
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
	console.log(msg)
	var character = characters.spawn({x: msg.x*stage_width, y: msg.y*stage_height,
					type: msg.type, team: msg.team, color: msg.color});
	game.getTeam(msg.team).characters[msg.type].push(character);

}
function onSpawnExisting(msg){
	console.log('onSpawnExisting')
	console.log(msg)
	for(var i = 0; i < msg.characters.length; i++){
		var character = characters.spawn({x: msg.characters[i].x*stage_width, y: msg.characters[i].y*stage_height,
					type: msg.characters[i].type, team: msg.team, color: msg.color});
		game.getTeam(msg.team).characters[msg.characters[i].type].push(character);
	}

}
function onStartInfo(msg){
	gamestate = GameState.InPlay;
	myteam = msg.team;
	myteamcolor = msg.color;
	startlocation = msg.location;
	game.startgame();
}
