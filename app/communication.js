var enums = require("./enums.js");

module.exports = exports = Communication;

// //////////////////////
var clients = [];
var games = [];
function Communication(app, server){
	//this.http = require('http').Server(app);
	this.io = require('socket.io')(server);

    var gameServer = require('./gameServer.js');
	this.gameserver = new gameServer(this.io, games)
    this.webclient = require('./webClient.js')(this.io, clients, this.gameserver);


	return this;
} // end Communication




