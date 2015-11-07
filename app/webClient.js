var enums = require("./enums.js");
module.exports = exports = webClient;

function webClient(io, clients){
	io.on('connection', function(socket){
		console.log('A webClient has connected.');
	}); // end io connection callback
	
	return this;
} // end webClient