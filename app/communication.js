var enums = require("./enums.js");

module.exports = exports = Communication;

// //////////////////////
var clients = [];

function Communication(app){
	this.http = require('http').Server(app);
	this.io = require('socket.io')(this.http);
  
	this.webClient = require('./webClient')(this.io, clients);

	return this;
} // end Communication




