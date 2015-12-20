var chatmonitor = $('#chatmonitor');
function Communications(){
	this.init();
}
Communications.prototype = {
	init:function(){

	},
	connect: function(){
		return new Promise(function(resolve, reject){

			communication.socket = io.connect('http://localhost:80/',
			//communication.socket = io.connect('http://10.224.63.58:80/',
			//communication.socket = io.connect('http://192.168.0.104:80/',
			//communication.socket = io.connect('http://75.1.30.179:80/',
				{reconnection: false});
			//this.socket = io.connect('http://104.197.217.162:80/');
			//if(!this.socket.connected) return false;
			setTimeout( function(){
				if(communication.socket.connected){
					communication.setupconnection();
					resolve();
				}else{
					communication.socket.io._reconnection =false;
					reject();
				}
			}, 1000 );

			//return true;
		});
	},
	setupconnection:function(){
		communication.sendClientInfo();
		//this.socket.on('chat', onChat);
		communication.socket.on('joinServer', onjoinServer);
		communication.socket.on('joinGameSuccess', onjoinGameSuccess)
		communication.socket.on('start game', onstartGame)


		communication.socket.on('dead character', onDeadCharacter);
		communication.socket.on('path', onPath);
		communication.socket.on('sync', onSync);
		communication.socket.on('spawn period', onSpawnPeriod);
		communication.socket.on('periodic server sync', onSyncPeriod);

		communication.socket.on('some event', onsomeevent)
		//communication.socket.on('chat', onChat);
		//communication.socket.on('game list', onGameList);
		//communication.socket.on('spawn existing', onSpawnExisting); // obsolete
		//communication.socket.on('spawn', onSpawnExisting); // obsolete
	},

	sendClientInfo: function(){
		this.socket.emit('client info', {width: width, height: height, stage_width: stage_width, stage_height: stage_height});
	},
	update: function(time){

	},
}; // end Communications
function onsomeevent(msg){
	console.log('on some event')
	//console.log(msg)
}

function onGameList(msg){
	//console.log(msg)
}
function sendName(name){
	username = name;
	communication.socket.emit('name', name);
	menu.multiplayermenu.init_main();
}
function joinGame(index){
	if(index < 0) return;
	communication.socket.emit('join game', index);
}
function onjoinGameSuccess(msg){
	console.log('onjoinGameSuccess')
	console.log(msg)
	myteam = msg.team;
	//myteamcolor = msg.color;
	menu.multiplayermenu.init_gameroom();
}
function leaveGame(){
	communication.socket.emit('leave game');
	menu.multiplayermenu.init_main();
}
function startGame(){
	//console.log('start game press')
	communication.socket.emit('start game');
}
function onstartGame(msg){
	console.log('onstartGame');
	console.log(msg)
	//startlocation = msg.location;
	startlocation = msg.players[myteam].location;
	menu.multiplayermenu.init_game();


	//game.spawnBase(msg);

	var teams = game.teams;
	for(var i = 0; i < game.players.length; i++){
		var player = game.players[i];
		var team = player.team;
		if(team == Team.Observer) continue;
		teams[team].startmultiplayer(msg.players[team]);
	}
    /*game.players.forEach(function(p){
        teams[parseInt(p.team)].startmultiplayer(msg);
    });*/
	//myteam = msg.team;
	//myteamcolor = msg.color;

}
function sendChat(msg){
	communication.socket.emit('chat', msg);
}
function onChat(msg){
	/*console.log(msg)
	addMessage(msg.author, msg.text,
				   msg.color, new Date(msg.time));*/
	//console.log('get chat')
    //console.log(msg)
    if(Object.prototype.toString.call( msg ) === '[object Array]'){
    	msg.forEach(function(m){
        	placechat(m)
        })
    }else{
    	placechat(msg)
	}
}
function onSyncPeriod(msg){
	console.log('onSyncPeriod');
	console.log(msg)
	/*if(msg.players[0].characters[0][0] != undefined){
		if(msg.players[0].characters[0][0].vx > 0) debugger;
	}*/
} // end onSyncPeriod

function onSpawnPeriod(msg){
	//console.log('onSpawnPeriod')
	console.log(msg)
	for(var i = 0; i < msg.teams.length; i++){
		game.getTeam(i).spawn(msg.character_ids[i]);
	}
}
function onSpawn(msg){
	//console.log('onSpawn')
	//console.log(msg)
	/*var character = characters.spawn({x: msg.x*stage_width, y: msg.y*stage_height,
					type: msg.type, team: msg.team, color: msg.color});
	game.getTeam(msg.team).characters[msg.type].push(character);*/

}
function onDeadCharacter(msg){
	//console.log(msg)
	//game.getTeam(msg.team).characters[msg.type][msg.index].Dead = true;
	var character = game.getTeam(msg.team).characters[msg.type][msg.index];
	characters.clean(character);
	game.getTeam(msg.team).characters[msg.type].splice(msg.index,1);
}
function onSpawnExisting(msg){
	//console.log('onSpawnExisting')
	//console.log(msg)
	for(var i = 0; i < msg.characters.length; i++){
		var character = characters.spawn({x: msg.characters[i].x*stage_width, y: msg.characters[i].y*stage_height,
				type: msg.characters[i].type, team: msg.team, color: msg.color,
				id: msg.characters[i].id});
		game.getTeam(msg.team).characters[msg.characters[i].type].push(character);
	}
	game.getTeam(msg.team).color = msg.color;
}
function onjoinServer(msg){
	playerid = msg.id;
	//globalchatcolor = msg.color;
	//gamestate = GameState.InPlay;
	//myteam = msg.team;
	//myteamcolor = msg.color;
	//startlocation = msg.location;
	//game.startgame();
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
			if(team.characters[i][j] == undefined) continue; //debugger;
			team.characters[i][j].pos.x = msg.characters[i][j].x*stage_width;
			team.characters[i][j].pos.y = msg.characters[i][j].y*stage_height;
			team.characters[i][j].vel.x = msg.characters[i][j].vx*stage_width;
			team.characters[i][j].vel.y = msg.characters[i][j].vy*stage_height;
			team.characters[i][j].hp = msg.characters[i][j].hp;
		}
	}
} // end onSync
function addMessage(author, message, color, dt) {
	chatmonitor.prepend('<p><span "style="color:' + color + '"></span><span style="color:' + color + '">' + author + '</span> @ ' + convertTime(dt)
		 + ': ' + message + '</p>');
}
