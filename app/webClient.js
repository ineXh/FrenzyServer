var enums = require("./enums.js");
module.exports = exports = webClient;

function webClient(io, clients, gameserver){
	io.on('connection', function(socket){
        var game = gameserver;
        onConnect(socket, gameserver);
        socket.on('chat', onChat);
        socket.on('path', onPath);
        socket.on('spawn', onSpawn);

        socket.on('disconnect', onDisconnect);

        function onConnect(){
            console.log('A webClient has connected.');
            //socket.emit('chat', 'Hi Client.');
            game.join(socket);
        }
        function onDisconnect(){
            console.log('A webClient has disconnected.');
            game.leave(socket);
        }
        function onChat(msg){
            console.log(msg);
        }
        function onPath(msg){
            
        }
        function onSpawn(msg){
            //console.log(msg);
            game.spawn(socket, msg);
        }
	}); // end io connection callback

	return this;
} // end webClient
