var chatmonitor = $('#chatmonitor');
function Communications(){
	this.init();
}
Communications.prototype = {
	init:function(){

	},
	connect: function(){
		return new Promise(function(resolve, reject){

			//communication.socket = io.connect('http://localhost:80/',
			//communication.socket = io.connect('http://10.224.63.58:80/',
			//communication.socket = io.connect('http://192.168.0.104:80/',
			communication.socket = io.connect('http://75.1.30.179:80/',
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
		communication.socket.on('request server sync', onRequestedSync);
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
	ChatRoom = msg.room;
	//myteamcolor = msg.color;
	menu.multiplayermenu.init_gameroom();
}
function leaveGame(){
	communication.socket.emit('leave game');
	ChatRoom = 'Global';
	gameChats = [];
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
//game.teams[0].characters[0][0].pos.x -= 200
function onSyncPeriod(msg){
	//console.log('onSyncPeriod ' + Server_Sync_Period_Estimate);
	//console.log(msg)
	//console.log(msg.sync_type)
	/*if(msg.players[0].characters[0][0] != undefined){
		if(msg.players[0].characters[0][0].vx > 0) debugger;
	}*/
	/*if(msg.sync_type == 'force'){
		var b = 2;
		//debugger;
	}*/
	// Loop Message Players
	for(var i = 0; i < msg.players.length; i++){
		//if(i == myteam) console.log(gameCount - msg.players[i].gameCount)
		if(i == myteam){
			game.getTeam(i).coins = msg.players[i].coins;
		}
		if(msg.players[i].characters == undefined) continue;
		// Loop Player CharacterTypes
		for(var j = 0; j < msg.players[i].characters.length; j++){
			if(msg.players[i].characters[j] == undefined) continue;
			for(var k = msg.players[i].characters[j].length -1; k >= 0; k--){
			//for(var k = 0; k < msg.players[i].characters[j].length; k++){
				//if(game.teams[i].characters[j][k] == undefined) debugger;

				var m = msg.players[i].characters[j][k];
				var c = game.teams[i].characters[j][k];
				if(m == undefined) continue;
				if(c == undefined) continue;
				if(c.id != m.id){
                    //console.log('c.id: ' + c.id);
                    //console.log('m.id: ' + m.id);
                    //debugger;
                }
				if(m.Dead){
					c.Dead = true;
					characters.clean(c);
					msg.players[i].characters[j].splice(k,1);
					game.teams[i].characters[j].splice(k,1);
					//debugger;
					continue;
				}

				/*if(msg.players[i].characters[j][k].vx > 0){
					var a = 1;
					//communication.socket.removeListener('periodic server sync', onSyncPeriod);
					//debugger;
				}*/


				if(Server_Sync_Period_Estimate == 0) continue;
				if(msg.players[i].characters[j][k].x == null) continue;

				/*var predict = new PVector(0, 0);
				predict.x = msg.players[i].characters[j][k].x*stage_width +
					Server_Sync_Period_Estimate*msg.players[i].characters[j][k].vx*stage_width;
				predict.y = msg.players[i].characters[j][k].y*stage_height +
					Server_Sync_Period_Estimate*msg.players[i].characters[j][k].vx*stage_height;
				//game.teams[i].characters[j][k].vel.x = (predict.x - game.teams[i].characters[j][k].pos.x) / Server_Sync_Period_Estimate;
				//game.teams[i].characters[j][k].vel.y = (predict.y - game.teams[i].characters[j][k].pos.y) / Server_Sync_Period_Estimate;
				game.teams[i].characters[j][k].s_pos.x = predict.x;
				game.teams[i].characters[j][k].s_pos.y = predict.y;
				//if(game.teams[i].characters[j][k].vel.x > 0.1) debugger;
*/
				//if(game.teams[i].characters[j][k].hp < msg.players[i].characters[j][k].hp) debugger;
				//game.teams[i].characters[j][k].hp = msg.players[i].characters[j][k].hp - game.teams[i].characters[j][k].dmg;
				//if(game.teams[i].characters[j][k].hp < msg.players[i].characters[j][k].hp)
				//if(i != myteam)
				 //game.teams[i].characters[j][k].hp = msg.players[i].characters[j][k].hp;


				if(msg.sync_type == 'periodic'){
					// Do not sync hp if 'force'
					game.teams[i].characters[j][k].hp = msg.players[i].characters[j][k].hp;
					if(i == myteam) continue;


					var x = msg.players[i].characters[j][k].x*stage_width;
					var y = msg.players[i].characters[j][k].y*stage_height;
					var teleport_dist = findDist(game.teams[i].characters[j][k].pos,
						new PVector(x , y));
					if(teleport_dist >= dim/30){
						c.override = true;
						c.predict.x = (m.x +
							Server_Sync_Period_Estimate*m.vx)*stage_width;
						c.predict.y = (m.y +
							Server_Sync_Period_Estimate*m.vy)*stage_height;
						//debugger;
						if(isNaN(c.predict.x)) debugger;
					}else{
						c.override = false;
					}

					/*game.teams[i].characters[j][k].pos.x = x;
					game.teams[i].characters[j][k].pos.y = y;
					game.teams[i].characters[j][k].vel.x = msg.players[i].characters[j][k].vx*stage_width;
					game.teams[i].characters[j][k].vel.y = msg.players[i].characters[j][k].vy*stage_height;*/
				}

			}
		}
	}

	Server_Sync_gameCounts.push(gameCount);
	Server_Sync_gameCounts = Server_Sync_gameCounts.slice(-4);
	var sum = 0;
	for(var i = 1; i < Server_Sync_gameCounts.length; i++){
		sum += Server_Sync_gameCounts[i] - Server_Sync_gameCounts[i-1];
	}
	Server_Sync_Period_Estimate = Math.ceil(sum / (Server_Sync_gameCounts.length - 1));
} // end onSyncPeriod
function onRequestedSync(msg){
	game.teams[myteam].sync_force = true;
	game.teams[myteam].sendPeriodicSync();
}
function onSpawnPeriod(msg){
	//console.log('onSpawnPeriod')
	//console.log(msg)
	//debugger;
	/*for(var i = 0; i < msg.teams.length; i++){
		game.getTeam(i).spawn(msg.character_ids[i]);
	}*/
	for(var i = 0; i < msg.players.length; i++){
		var m = msg.players[i];
		if(m.id != undefined) game.getTeam(i).spawn(m.id);
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
