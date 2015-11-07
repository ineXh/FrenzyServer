var enums = require("./enums.js");
module.exports = exports = webClient;

function webClient(io, clients){
	io.on('connection', function(socket){
		console.log('A webClient has connected.');
        socket.emit('chat', 'Hi Client.');

        socket.on('chat', function(msg){onChat.call(this, msg);});
	}); // end io connection callback

	return this;
} // end webClient
function onChat(msg){
    console.log(msg);
}
