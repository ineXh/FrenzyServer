var enums = require("./enums.js");
module.exports = exports = gameServer;

// //////////////////////
var colors = ['Red', 'Blue', 'Teal', 'Purple'];
var teams = [enums.team0, enums.team1, enums.team2, enums.team3];
var locations = [enums.NW, enums.NE,enums.SW, enums.SE];

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
        console.log('total players ' + this.players.length);

        player.color = colors.shift();
        player.team = teams.shift();
        player.location = locations.shift();
        player.socket.emit('start info',
                        {color      : player.color,
                         team       : player.team,
                         location   : player.location
                     });
        this.cows[player.team] = [];
        console.log('start location ' + player.location);
    },
    leave: function(player){
        colors.push(player.color)
        teams.push(player.team)
        locations.push(player.location)
        var index = this.players.indexOf(player);
        if(index > -1) this.players.splice(index, 1);
        console.log('players ' + this.players.length);
    },
    spawn: function(player, input){
        console.log('spawn')
        this.players.forEach(function(p){
            if(p != player) p.socket.emit('spawn', input)
        });
    }
} // end gameServer
