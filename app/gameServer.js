var enums = require("./enums.js");
module.exports = exports = gameServer;

// //////////////////////
var colors = [enums.Red, enums.Blue, enums.Teal, enums.Purple];
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
    }, // end init
    join: function(player){
        this.players.push(player);
        console.log('total players ' + this.players.length);

        player.color = colors.shift();
        player.team = teams.shift();
        player.location = locations.shift();
        this.send_start_info(player);
        this.spawn_existing(player);
        //console.log('start location ' + player.location);
    },
    leave: function(player){
        colors.push(player.color)
        teams.push(player.team)
        locations.push(player.location)
        var index = this.players.indexOf(player);
        if(index > -1) this.players.splice(index, 1);
        console.log('total players ' + this.players.length);
    },
    sendChat : function(userName, userColor, msg){
      var obj = {
          time: (new Date()).getTime(),
          text: htmlEntities(msg),
          author: userName,
          color: userColor,
        };
        //this.history.push(obj);
        //this.history = this.history.slice(-100);

        // broadcast message to all connected clients
        //var json = JSON.stringify({ type:'message', data: obj });
        //console.log(json)
        this.io.emit('chat message', json);
    },
    spawn: function(player, input){
        //console.log('spawn')
        this.players.forEach(function(p){
            if(p != player){
                //console.log('player ' + p.team + ' to spawn.')
                p.emit('spawn', input)
            }
        });
    }, // end spawn
    send_start_info: function(player){
        player.emit('start info',
            {color      : player.color,
             team       : player.team,
             location   : player.location
         });
    }, // end send_start_info
    spawn_existing: function(player){
        //this.cows.forEach(function(team){
        this.players.forEach(function(p){
            if(p != player){
                var msg = {color: p.color, team: p.team, characters: []};
                p.characters.forEach(function(charactertype){
                    charactertype.forEach(function(c){
                        msg.characters.push(c)
                    })
                })
                if(msg.characters.length > 0) player.emit('spawn existing', msg)
            }
        })
    }, // end spawn_existing
    path: function(player, input){
        //console.log('path')
        var msg = {team: player.team, points: input};
        this.players.forEach(function(p){
            if(p != player){
                //console.log('player ' + p.team + ' to path.')
                p.emit('path', msg)
            }
        });
    },
    sync: function(player, input){
        var msg = {team: player.team, characters: input};
        this.players.forEach(function(p){
            if(p != player){
                //console.log('player ' + p.team + ' to path.')
                p.emit('sync', msg)
            }
        });
    } // end sync
} // end gameServer
