var enums = require("./enums.js");

module.exports = exports = Communication;

// //////////////////////

function Communication(app, server){
	//this.http = require('http').Server(app);
	this.io = require('socket.io')(server);

    var gameServer = require('./gameServer.js');
	this.gameserver = new gameServer(this.io)
    this.webclient = require('./webClient.js')(this.io, this.gameserver);
	return this;
} // end Communication





