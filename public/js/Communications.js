var chatmonitor = $('#chatmonitor');
function Communications(){
	this.init();
}
Communications.prototype = {
	init:function(){

	},
	connect: function(){
		//this.socket = io.connect('http://localhost:80/');
		this.socket = io.connect('http://192.168.0.103:80/');
		//this.socket = io.connect('http://104.197.217.162:80/');
		this.sendClientInfo();

		this.socket.on('chat', onChat);
		this.socket.on('start info', onStartInfo);
		this.socket.on('spawn existing', onSpawnExisting);
		this.socket.on('spawn', onSpawnExisting);
		this.socket.on('path', onPath);
		this.socket.on('sync', onSync);

	},

	sendClientInfo: function(){
		this.socket.emit('client info', {width: width, height: height, stage_width: stage_width, stage_height: stage_height});
	},
	update: function(time){

	},
}; // end Communications

function onChat(msg){
	console.log(msg)
	addMessage(json.data.author, json.data.text,
				   json.data.color, new Date(json.data.time));

}
function onSpawn(msg){
	//console.log('onSpawn')
	//console.log(msg)
	/*var character = characters.spawn({x: msg.x*stage_width, y: msg.y*stage_height,
					type: msg.type, team: msg.team, color: msg.color});
	game.getTeam(msg.team).characters[msg.type].push(character);*/

}
function onSpawnExisting(msg){
	console.log('onSpawnExisting')
	//console.log(msg)
	for(var i = 0; i < msg.characters.length; i++){
		var character = characters.spawn({x: msg.characters[i].x*stage_width, y: msg.characters[i].y*stage_height,
					type: msg.characters[i].type, team: msg.team, color: msg.color});
		game.getTeam(msg.team).characters[msg.characters[i].type].push(character);
	}
	game.getTeam(msg.team).color = msg.color;
}
function onStartInfo(msg){
	gamestate = GameState.InPlay;
	myteam = msg.team;
	myteamcolor = msg.color;
	startlocation = msg.location;
	game.startgame();
}
function onPath(msg){
	//console.log(msg)
	game.getTeam(msg.team).path.startPath(	msg.points[0].x*stage_width,
											msg.points[0].y*stage_height);
	game.getTeam(msg.team).path.endPath(	msg.points[1].x*stage_width,
											msg.points[1].y*stage_height);
}
function onSync(msg){
	//console.log(msg);
	var team = game.getTeam(msg.team);
	for(var i = 0; i < msg.characters.length; i++){
		if(msg.characters[i] == undefined) continue;
		for(var j = 0; j < msg.characters[i].length; j++){
			team.characters[i][j].pos.x = msg.characters[i][j].x*stage_width;
			team.characters[i][j].pos.y = msg.characters[i][j].y*stage_height;
			team.characters[i][j].vel.x = msg.characters[i][j].vx*stage_width;
			team.characters[i][j].vel.y = msg.characters[i][j].vy*stage_height;
		}
	}
}
function addMessage(author, message, color, dt) {
	chatmonitor.prepend('<p><span "style="color:' + color + '"></span><span style="color:' + color + '">' + author + '</span> @ ' + convertTime(dt)
		 + ': ' + message + '</p>');
}
