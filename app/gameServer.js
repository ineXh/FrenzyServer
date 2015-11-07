module.exports = exports = gameServer;

// //////////////////////

function gameServer(io, games){
    this.io = io;
    this.init();
    //return this;
} // end gameServer
gameServer.prototype = {
    init: function(){
        this.players = [];
        this.cows = [];
    }, // end init
    join: function(player){
        this.players.push(player);
        console.log('players ' + this.players.length);
    },
    leave: function(player){
        var index = this.players.indexOf(player);
        if(index > -1) this.players.splice(index, 1);
        console.log('players ' + this.players.length);
    },
    spawn: function(player, input){
        this.players.forEach(function(p){
            if(p != player) p.emit('spawn', input)
        });
    }
} // end gameServer
