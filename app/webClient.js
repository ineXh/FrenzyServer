var enums = require("./enums.js");
module.exports = exports = webClient;

function webClient(io, gameserver){
    //var client = this;
    var gameserver = gameserver;
	io.on('connection', function(socket){

        var GameInfo = require('./GameInfo.js');
        this.gameinfo = new GameInfo();

        var client = {socket: socket, gameinfo: this.gameinfo};

        onConnect(socket, gameserver);

        socket.on('name', onName);
        socket.on('chat', onChat);
        //socket.on('request chat', onrequestChat);
        socket.on('client info', onClientInfo);
        socket.on('request game list', onRequestGameList)
        socket.on('join game', onJoinGame)
        socket.on('leave game', onLeaveGame)
        socket.on('GameRoom Change Team', onChangeTeam)
        socket.on('start game', onStartGame)
        socket.on('path', onPath);
        socket.on('spawn', onSpawn);
        socket.on('sync dead character', onSyncDeadCharacter)
        socket.on('periodic client sync', onSyncPeriodClient);
        socket.on('force client sync', onSyncForceClient);
        socket.on('disconnect', onDisconnect);

        function onConnect(socket, server){
            console.log('A webClient has connected.');
            socket.join('Global Chat')
            client.room = 'Global Chat';
            //socket.join('Game Chat')
            //socket.emit('chat', 'Hi Client.');
        }
        function onDisconnect(){
            console.log('A webClient has disconnected.');
            gameserver.leave(client);
        }
        function onrequestChat(){
            gameserver.sendChatHistory(client);
        }
        function onName(name){
            client.name = name;
            gameserver.join(client);
            gameserver.sendChatHistory(client);
            gameserver.sendWelcomeMsg(client);
        }
        function onChat(msg){
            console.log('onChat')
            console.log(msg);
            gameserver.sendChat(client, msg);
        }
        function onClientInfo(msg){
            client.gameinfo.width = msg.width;
            client.gameinfo.height = msg.height;
            client.gameinfo.stage_width = msg.stage_width;
            client.gameinfo.stage_height = msg.stage_height;
        }
        function onRequestGameList(){
            gameserver.send_game_list(client);
        }
        function onJoinGame(index){
            console.log('join game ' + index);
            gameserver.joinGame(client, index);
        }
        function onLeaveGame(msg){
            console.log('leave game ');
            gameserver.leaveGame(client);
        }
        function onChangeTeam(msg){
            //console.log('change team ' + msg)
            client.game.changeTeam(client, msg);
        }
        function onStartGame(){
            client.game.startGame();
        }
        function onPath(msg){
            //console.log(msg);
            client.gameinfo.onPath(msg);
            client.game.path(client, msg);
        }
        function onSpawn(msg){
            //msg.x = msg.x / client.stage_width;
            //msg.y = msg.y / client.stage_height;
            /*for(var i = 0; i < msg.characters.length; i++){
                var character = msg.characters[i];
                client.characters[character.type].push({x: character.x, y: character.y, type: character.type})
            }*/
            msg.team = client.team;
            msg.color = client.color;
            client.game.spawn(client, msg);
        }
        function onSyncDeadCharacter(msg){
            msg.team = client.team;

            client.game.DeadCharacter(client, msg);
        }
        function onSyncPeriodClient(msg){
            //console.log('onSync')
            //console.log(client.characters)
            //console.log(msg)
            client.gameinfo.onSyncUpdateClient(msg);
            //client.game.sync(client, msg);
        } // end onSyncPeriodClient
        function onSyncForceClient(msg){
            client.gameinfo.onSyncUpdateClient(msg);
            client.game.forceSync();
            //clearTimeout(myVar);
        }// end onSyncForceClient
	}); // end io connection callback

	return this;
} // end webClient
function characterlist(){
    var list = [];
    list[enums.Cow] = [];
    list[enums.Hut] = [];
    return list;
}
