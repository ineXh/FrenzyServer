var enums = require("./enums.js");

module.exports = exports = Communication;

// //////////////////////
var clients = [];

function Communication(app, server){
	//this.http = require('http').Server(app);
	this.io = require('socket.io')(server);

	this.webClient = require('./webClient.js')(this.io, clients);

	return this;
} // end Communication




