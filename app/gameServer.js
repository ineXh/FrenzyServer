var enums = require("./enums.js");
module.exports = exports = gameServer;

// //////////////////////
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

var colors = [enums.Red, enums.Blue, enums.Teal, enums.Purple];
//var colors = ['Red', 'Blue', 'Teal', 'Purple'];
var teams = [enums.team0, enums.team1, enums.team2, enums.team3];
var locations = [enums.NW, enums.NE,enums.SW, enums.SE];

function gameServer(io, clients, games){
    this.io = io;
    this.games = games;
    this.clients = clients;

    this.init();
    //return this;
} // end gameServer
gameServer.prototype = {
    init: function(){
        var Game = require('./Game.js');
        game = new Game(this.io, 'Game1');
        this.games.push(game)
        var obj = {
          time: (new Date()).getTime(),
          msg: htmlEntities('Welcome to Game'),
          author: 'Server',
          color: 'black',
          id:0
        };
        this.chathistory = [obj];
        this.players = [];
        this.character_ids = [];
        for(var i = 0; i < 10000; i++) this.character_ids.push(i);
    }, // end init
    join: function(player){
        this.players.push(player);
        console.log('total players on server ' + this.players.length);
        //player.name = 'Bob';
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
    sendWelcomeMsg:function(player){
        //this.io.emit('chat', 'Welcome to the Chat ' + player.name);
        this.sendChat(player, 'Welcome to the Chat ' + player.name);
    },
    sendChatHistory: function(player){
        //console.log(this.chathistory)
        player.emit('chat', this.chathistory);
    },
    sendChat : function(player, msg){
      var obj = {
          time: (new Date()).getTime(),
          msg: htmlEntities(msg),
          author: player.name,
          color: player.color,
        };
        console.log('color ' + obj.color)
        if(obj.color == undefined) obj.color = 'Black';
        this.chathistory.unshift(obj);
        if(this.chathistory.length > 10) this.chathistory = this.chathistory.splice(0, this.chathistory.length - 1);
        //console.log('chat history')
        //console.log(this.chathistory);
        //this.history.push(obj);
        //

        // broadcast message to all connected clients
        //var json = JSON.stringify({ type:'message', data: obj });
        //console.log(json)
        this.io.emit('chat', this.chathistory);
    },
    spawn: function(player, msg){
        //console.log('spawn')
        //console.log(this)
        for(var i = 0; i < msg.characters.length; i++){
            var character = msg.characters[i];
            var id = this.character_ids.shift();
            //console.log(id)
            msg.characters[i].id = id;
            player.characters[character.type].push({x: character.x, y: character.y, type: character.type, id: id});

        }

        this.players.forEach(function(p){
            p.emit('spawn', msg)
        });
    }, // end spawn
    DeadCharacter: function(player, input){
        this.players.forEach(function(p){
            if(p != player){
                //console.log('player ' + p.team + ' to spawn.')
                p.emit('dead character', input)
            }
        });
    },
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
