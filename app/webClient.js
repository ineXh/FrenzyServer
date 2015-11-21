var enums = require("./enums.js");
module.exports = exports = webClient;
var maxline = 3;

function webClient(io, clients, gameserver){
    //var client = this;
    var gameserver = gameserver;
	io.on('connection', function(socket){
        var client = socket;
        client.characters = characterlist();
        client.path_points = [];

        onConnect(socket, gameserver);
        socket.on('name', onName);
        socket.on('chat', onChat);
        socket.on('request chat', onrequestChat);
        socket.on('client info', onClientInfo);
        socket.on('path', onPath);
        socket.on('spawn', onSpawn);
        socket.on('sync dead character', onSyncDeadCharacter)
        socket.on('sync character', onSyncCharacter);
        socket.on('disconnect', onDisconnect);

        function onConnect(){
            console.log('A webClient has connected.');
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
            gameserver.sendWelcomeMsg(client);
            gameserver.join(client);
        }
        function onChat(msg){
            console.log('onChat')
            console.log(msg);
            gameserver.sendChat(client, msg);
        }
        function onClientInfo(msg){
            client.width = msg.width;
            client.height = msg.height;
            client.stage_width = msg.stage_width;
            client.stage_height = msg.stage_height;
        }
        function onPath(msg){
            //console.log(msg);
            if(client.path_points.length >= 2*maxline){
                client.path_points.splice(0,2);
            }
            msg[0].x = msg[0].x / client.stage_width;
            msg[0].y = msg[0].y / client.stage_height;
            msg[1].x = msg[1].x / client.stage_width;
            msg[1].y = msg[1].y / client.stage_height;
            client.path_points.push({x: msg[0].x,
                                     y: msg[0].y});
            client.path_points.push({x: msg[1].x,
                                     y: msg[1].y});
            gameserver.path(client, msg);
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
            gameserver.spawn(client, msg);
        }
        function onSyncDeadCharacter(msg){
            msg.team = client.team;

            gameserver.DeadCharacter(client, msg);
        }
        function onSyncCharacter(msg){
            //console.log('onSync')
            //console.log(client.characters)
            //console.log(msg)
            for(var i = 0; i < client.characters.length; i++){
                if(client.characters[i] == undefined) continue;
                for(var j = 0; j < client.characters[i].length; j++){
                    var c = client.characters[i][j];
                    var m = msg[i][j];
                    if(c != null && m != null){
                        c.x = m.x;
                        c.y = m.y;
                    }
                }
            }
            gameserver.sync(client, msg);
        } // end onSync
	}); // end io connection callback

	return this;
} // end webClient
function characterlist(){
    var list = [];
    list[enums.Cow] = [];
    return list;
}
