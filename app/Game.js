var enums = require("./enums.js");
module.exports = exports = Game;

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function Game(io, server, name){
    this.io = io;
    this.server = server;
    this.name = name;
    this.init();
    //return this;
} // end Game
Game.prototype = {
    init: function(){
        this.players = [];
        this.teams = [enums.Team0, enums.Team1, enums.Team2, enums.Team3];
        this.locations = [enums.NW, enums.NE,enums.SW, enums.SE];
        this.character_ids = [];
        for(var i = 0; i < 10000; i++) this.character_ids.push(i);
        this.spawncounter = new SpawnCounter();
        this.state = enums.GameRoom;
        //this.gameStarted = false;
    }, // end init
    getName:function(){
        return this.name;
    },
    getPlayers:function(){
        return this.players.length;
    },
    getState: function(){
        return this.state;
    },
    join : function(player){
        console.log(player.name + ' joins ' + this.name);
        player.team = this.teams.shift();
        if(player.team == undefined) player.team = enums.Observer;
        //this.players.push({player: player, name: player.name, team: player.team});
        this.players.push(player);

        var msg = {color    : player.gamecolor,
                    team    : player.team}
        player.emit('joinGameSuccess', msg)
        this.updateplayerlist();
        //this.spawncounter.add(player.team, 5);
        //this.spawn_existing(player);
    },
    leave: function(player){
        if(player.team != undefined && player.team != enums.Observer){
            this.teams.push(player.team);
            player.team = enums.Observer;
        }
        var index = this.players.indexOf(player);
        if(index > -1) this.players.splice(index, 1);
        this.updateplayerlist();
    },
    startGame : function(){
        var game = this;
        this.players.forEach(function(p){
            var msg = {};
            if(p.team != enums.Observer){
                p.location = game.locations.shift();
                msg.location = p.location;
                game.spawncounter.add(p.team, 5);
            }
            p.emit('start game', msg);
        });
        setTimeout(this.spawnPeriodUnit.bind(this), 5000);
        //this.gameStarted = true;
        this.state = enums.InGame;
        this.server.send_game_list(null);
    },
    changeTeam : function(player, team){
        var index = -1;
        for(var i = 0; i < this.teams.length; i++){
            if(team == this.teams[i]) index = i;
        }
        //console.log('index ' + index)
        if(index > -1){
            this.teams.splice(index,1);
            this.teams.push(player.team);
            player.team = team;
        }else if(team == enums.Observer){
            if(player.team != enums.Observer) this.teams.push(player.team);
            player.team = team;
        }
        this.updateplayerlist();
    },
    updateplayerlist : function(){
        console.log('updateplayerlist')
        var msg = {players: []};
        for(var i = 0; i < this.players.length; i++){
            msg.players.push({name: this.players[i].name, team: this.players[i].team, id: this.players[i].id});
        }
        this.players.forEach(function(p){
            p.emit('game player list', msg);
        });
    },
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
    spawnPeriodUnit: function(){
        //console.log('spawnPeriodUnit')
        //this.spawn_count++;
        //var msg = {teams: []};
        var msg = this.spawncounter.update();
        //console.log(msg)
        if(msg != null){
            this.players.forEach(function(p){
                p.emit('spawn period', msg)
            });
        }

        setTimeout(this.spawnPeriodUnit.bind(this), 1000);
    },
    DeadCharacter: function(player, msg){
        if(player.characters[msg.type][msg.index] == undefined) return;
        if(msg.id != player.characters[msg.type][msg.index].id) return;
        player.characters[msg.type].splice(msg.index,1);
        this.players.forEach(function(p){
            p.emit('dead character', msg)
            //if(p != player){
                //console.log('player ' + p.team + ' to spawn.')

            //}
        });
    },
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
    sync: function(player, msg){
        for(var i = 0; i < player.characters.length; i++){
                if(player.characters[i] == undefined) continue;
                for(var j = 0; j < player.characters[i].length; j++){
                    var c = player.characters[i][j];
                    var m = msg[i][j];
                    if(c != null && m != null && m.id == c.id){
                        c.x = m.x;
                        c.y = m.y;
                        c.vx = m.vx;
                        c.vy = m.vy;
                        c.hp = m.hp;
                    }
                }
            }

        var msg = {team: player.team, characters: msg};
        this.players.forEach(function(p){
            //if(p != player){
                //console.log('player ' + p.team + ' to path.')
                p.emit('sync', msg)
            //}
        });
    }, // end sync
} // end Game

function SpawnCounter(){
    this.init();
} // end SpawnCounter
SpawnCounter.prototype = {
    init: function(){
        this.counter = 0;
        this.time = [];
    },
    add: function(team, timer){
        this.time[team] = timer;
    },
    update: function(){
        this.counter++;
        var counter = this.counter;
        var msg = {teams: []};
        for(var i = 0; i < this.time.length; i++){
            if(this.time[i] == undefined) continue;
            if(this.counter % this.time[i] == 0){
                msg.teams.push(i);
            }
        }
        if(msg.teams.length <= 0) return null;
        else return msg;
    } // end update
} // ebd SpawnCounter
