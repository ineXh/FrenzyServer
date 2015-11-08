var enums = require("./enums.js");
module.exports = exports = webClient;
var maxline = 2;

function webClient(io, clients, gameserver){
    //var client = this;
    var game = gameserver;
	io.on('connection', function(socket){
        var client = socket;
        client.characters = characterlist();
        client.path_points = [];

        onConnect(socket, gameserver);
        socket.on('chat', onChat);
        socket.on('client info', onClientInfo);
        socket.on('path', onPath);
        socket.on('spawn', onSpawn);
        socket.on('disconnect', onDisconnect);

        function onConnect(){
            console.log('A webClient has connected.');
            //socket.emit('chat', 'Hi Client.');
            game.join(client);

        }
        function onDisconnect(){
            console.log('A webClient has disconnected.');
            game.leave(client);
        }
        function onChat(msg){
            console.log(msg);
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
            game.path(client, msg);
        }
        function onSpawn(msg){
            msg.x = msg.x / client.stage_width;
            msg.y = msg.y / client.stage_height;
            client.characters[msg.type].push(msg)
            game.spawn(client, msg);
        }
	}); // end io connection callback

	return this;
} // end webClient
function characterlist(){
    var list = [];
    list[enums.Cow] = [];
    return list;
}
