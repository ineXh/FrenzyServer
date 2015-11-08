var enums = require("./enums.js");
module.exports = exports = webClient;

function webClient(io, clients, gameserver){
    var client = this;
    var game = gameserver;
	io.on('connection', function(socket){
        client.socket = socket;

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

        }
        function onSpawn(msg){
            msg.x = msg.x / client.stage_width;
            msg.y = msg.y / client.stage_height;
            game.spawn(client, msg);
        }
	}); // end io connection callback

	return this;
} // end webClient
