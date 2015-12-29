var enums = require("./enums.js");
var utils = require("./Utils.js");

module.exports = exports = Game;

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
// Important
var max_unit_count = 10;
var cow_max_hp = 10;
var hut_max_hp = 25;

// Character Spawn Period
var period_unit_spawn = 1000;
// To Make Sure Clients know unit removal and new coins
// Server to Client Periodic Sync
var period_server_sync = 1000;
// To Make Sure Server and Client Positions are in Sync
var period_request_sync = 3000;

var spawn_count = 0;
var spawn_time = 20;
var request_sync_count = 0;
var request_sync_time = 10;

var period_update = 200;

function Game(io, server, name){
    this.io = io;
    this.server = server;
    this.name = name;
    this.init();
    //return this;
} // end Game
Game.prototype = {
    init: function(){
        var GameInfo = require('./GameInfo.js');
        this.gameinfo = new GameInfo();

        this.players = [];
        this.teams = [enums.Team0, enums.Team1, enums.Team2, enums.Team3];
        this.locations = [enums.NW, enums.NE,enums.SW, enums.SE];
        this.colors = [enums.Red, enums.Blue, enums.Teal, enums.Purple];
        //var colors = ['Red', 'Blue', 'Teal', 'Purple'];

        this.character_ids = [];
        for(var i = 0; i < 10000; i++) this.character_ids.push(i);
        //this.spawncounter = new SpawnCounter();
        this.state = enums.GameRoom;
        this.requested = false;
        //this.gameStarted = false;
    }, // end init
    clean: function(){
        console.log('Clean ' + this.name);
        this.state = enums.GameRoom;
    },
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
        player.playerinfo.team = this.teams.shift();
        if(player.playerinfo.team == undefined) player.playerinfo.team = enums.Observer;

        console.log(player.name + ' joins ' + this.name + ' in team ' + player.playerinfo.team);

        this.players.push(player);
        this.gameinfo.join(player);

        player.color = getColor(player.playerinfo.team);
        //console.log('player.color ' + player.color)

        var msg = {//color    : player.playerinfo.gamecolor,
                    team    : player.playerinfo.team,
                    room    : this.name
                    }
        player.socket.leave('Global Chat')
        player.socket.join(this.name);
        player.room = this.name;
        //console.log('Client joins ' + this.name)
        player.socket.emit('joinGameSuccess', msg)

        var obj = {
          time: (new Date()).getTime(),
          msg: htmlEntities('Hey! Welcome ' + player.name + '! You joined ' + this.name),
          author: this.name + ' MaNagEr',
          color: 'Black',
        };

        this.io.in(this.name).emit('chat', obj);
        this.updateplayerlist();
        //this.spawncounter.add(player.playerinfo.team, 5);
        //this.spawn_existing(player);
    },
    leave: function(player){
        if(player.playerinfo.team != undefined && player.playerinfo.team != enums.Observer){
            this.teams.push(player.playerinfo.team);
            this.gameinfo.leave(player);
            player.playerinfo.team = enums.Observer;
        }
        player.color = player.globachatcolor;
        player.socket.leave(this.name);
        player.socket.join('Global Chat')
        player.room = 'Global Chat';
        var index = this.players.indexOf(player);
        if(index > -1) this.players.splice(index, 1);
        if(this.players.length < 1){
            this.clean();
            return;
        }
        this.updateplayerlist();
    },
    startGame : function(){
        var game = this;
        //this.players.forEach(function(p){
            var msg = {players: [{},{},{},{}]};

            for(var i = 0; i < this.players.length; i++){
                var player = this.players[i];
                if(player.playerinfo.team == enums.Observer) continue;
                var location = game.locations.shift();
                var id = this.character_ids.shift();
                var team = player.playerinfo.team;
                player.playerinfo.location = location;
                //msg.players.push({team: player.playerinfo.team, location: location, base_id: id})

                msg.players[team].location = location;
                msg.players[team].team = team;
                msg.players[team].base_id = id;

                this.gameinfo.players[team].characters[enums.Hut].push({
                    x: null, y:null,
                    vx:0, vy:0,
                    hp: hut_max_hp,
                    Dead: false,
                    type: enums.Hut, id: id});

                //game.spawncounter.add(player.playerinfo.team, 4);
            }
            this.io.in(this.name).emit('start game', msg);

            /*if(p.team != enums.Observer){
                p.location = game.locations.shift();
                msg.location = p.location;
                game.spawncounter.add(p.team, 4);
            }*/
            //p.socket.emit('start game', msg);
        //});
        //this.periodicSpawnTimeout = setTimeout(this.periodicSpawn.bind(this), period_unit_spawn);
        //this.periodicSyncTimeout = setTimeout(this.periodicSync.bind(this), period_server_sync);

        //this.periodicRequestSyncTimeout = setTimeout(this.requestSync.bind(this), period_request_sync);

        this.periodicUpdateTimeout = setTimeout(this.periodicUpdate.bind(this), period_update);

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
        // Found Team in Pool
        if(index > -1){
            this.teams.splice(index,1);
            this.teams.push(player.playerinfo.team);
            this.gameinfo.players[player.playerinfo.team].playerinfo = null;
            player.playerinfo.team = team;
            this.gameinfo.players[team].playerinfo = player.info;
        }else if(team == enums.Observer){
            if(player.playerinfo.team != enums.Observer) this.teams.push(player.playerinfo.team);
            this.gameinfo.players[player.playerinfo.team].playerinfo = null;
            player.playerinfo.team = team;
        }
        player.color = getColor(player.playerinfo.team);
        //console.log('player.color ' + player.color)
        this.updateplayerlist();
    },
    updateplayerlist : function(){
        //console.log('updateplayerlist')
        var msg = {players: []};
        for(var i = 0; i < this.players.length; i++){
            //console.log(this.players[i].gameinfo.team)
            msg.players.push(
                {name: this.players[i].name,
                 team: this.players[i].playerinfo.team,
                 id: this.players[i].id});
        }
        /*this.players.forEach(function(p){
            p.socket.emit('game player list', msg);
        });*/
        this.io.in(this.name).emit('game player list', msg);
    },
    getPlayer:function(team){
        for(var i = 0; i < this.players.length; i++){
            if(this.players[i].playerinfo.team == team) return this.players[i];
        }
        return null;
    },
    /*spawn_existing: function(player){
        //this.cows.forEach(function(team){
        this.players.forEach(function(p){
            if(p != player){
                var msg = {color: p.color, team: p.team, characters: []};
                p.characters.forEach(function(charactertype){
                    charactertype.forEach(function(c){
                        msg.characters.push(c)
                    })
                })
                if(msg.characters.length > 0) player.socket.emit('spawn existing', msg)
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
            player.gameinfo.characters[character.type].push({x: character.x, y: character.y, type: character.type, id: id});

        }

        this.players.forEach(function(p){
            p.socket.emit('spawn', msg)
        });
    }, // end spawn*/
    periodicSpawn: function(){
        //console.log('periodicSpawn')
        //this.spawn_count++;
        //var msg = {teams: []};
        if(this.state != enums.InGame) return;

        spawn_count++;
        if(spawn_count < spawn_time) return;
        spawn_count = 0;

        var msg = {players: [{},{},{},{}]};
        var send = false;
        for(var i = 0; i < this.players.length; i++){
            var player = this.players[i];
            var team = player.playerinfo.team;
            if(team == enums.Observer) continue;
            if(player == null || player == undefined) continue;
            if(this.gameinfo.players[team].characters[enums.Cow].length
                >= max_unit_count)  continue;
            if(this.gameinfo.players[team].characters[enums.Hut].length
                <= 0)  continue;
            send = true;
            var id = this.character_ids.shift();
            msg.players[team].id = id;
            this.gameinfo.players[team].characters[enums.Cow].push({
                    x: null, y:null,
                    vx:0, vy:0,
                    hp: cow_max_hp,
                    Dead: false,
                    //state:'new',
                    type: enums.Cow, id: id});

        }
        if(send) this.io.in(this.name).emit('spawn period', msg);
        //var msg = this.spawncounter.update();
        /*if(msg != null){
            msg.character_ids = [];
            for(var i = 0; i < msg.teams.length; i++){
                //console.log('i ' + i)
                //console.log('msg.teams[i] ' + msg.teams[i])
                var team = msg.teams[i];
                var player = this.getPlayer(team);//this.players[msg.teams[i]];

                if(player == null) continue;
                if(this.gameinfo.players[team].characters[enums.Cow].length >= max_unit_count)
                    continue;
                var id = this.character_ids.shift();
                msg.character_ids.push(id);
                this.gameinfo.players[team].characters[enums.Cow].push({
                    x: null, y:null,
                    vx:0, vy:0,
                    Dead: false,
                    //state:'new',
                    type: enums.Cow, id: id});
            }
            //if(msg.character_ids.length >= 1)
               this.io.in(this.name).emit('spawn period', msg);
        }*/
        //console.log(msg)
        //if(msg != null){

            /*this.players.forEach(function(p){
                p.socket.emit('spawn period', msg)
            });*/
        //}

        //this.periodicSpawnTimeout = setTimeout(this.periodicSpawn.bind(this), period_unit_spawn);
    },
    DeadCharacter: function(player, msg){
        /*
        if(player.gameinfo.characters[msg.type][msg.index] == undefined) return;
        if(msg.id != player.gameinfo.characters[msg.type][msg.index].id) return;
        player.gameinfo.characters[msg.type].splice(msg.index,1);
        this.players.forEach(function(p){
            p.socket.emit('dead character', msg)
            //if(p != player){
                //console.log('player ' + p.team + ' to spawn.')

            //}
        });*/
    },
    path: function(player, input){
        //console.log('path')
        var msg = {team: player.playerinfo.team, points: input};
        this.players.forEach(function(p){
            if(p != player){
                //console.log('player ' + p.team + ' to path.')
                p.socket.emit('path', msg)
            }
        });
    },
    periodicUpdate:function(){
        //console.log('periodicUpdate')
        if(this.gameinfo.requireUpdate) this.forceSync('force');
        this.periodicSpawn();
        this.requestSync();
        //console.log('in periodicUpdate ' + this.gameinfo.requireUpdate)

        //console.log('end periodicUpdate')
        this.periodicUpdateTimeout = setTimeout(this.periodicUpdate.bind(this), period_update);
    },
    periodicSync: function(){
        if(this.state != enums.InGame) return;
        //this.periodicSyncTimeout = setTimeout(this.periodicSync.bind(this), period_server_sync);
        if(!this.gameinfo.requireUpdate){
          return;
        }
        this.gameinfo.requireUpdate = false;

        var msg = { sync_type: 'periodic',
                    players: [{},{},{},{}]};

        for(var i = 0; i < this.players.length; i++){
            var player = this.players[i];
            if(player.playerinfo.team == enums.Observer) continue;
            var team = player.playerinfo.team;
            msg.players[team].gameCount = player.playerinfo.gameCount;
            msg.players[team].characters = this.gameinfo.players[team].characters;
            msg.players[team].coins = player.playerinfo.coins;
        }
        this.io.in(this.name).emit('periodic server sync', msg);

        if(this.gameinfo.units_have_died){
            this.gameinfo.clean_dead_units();
        }

        //this.periodicSyncTimeout = setTimeout(this.periodicSync.bind(this), period_server_sync);
    }, // end periodicSync

    requestSync:function(){
        if(this.state != enums.InGame) return;
        request_sync_count++;
        //console.log('request_sync_count ' + request_sync_count);
        if(request_sync_count < request_sync_time) return;
        request_sync_count = 0;
        //console.log('requestSync')
        this.io.in(this.name).emit('request server sync');

        for(var i = 0; i < this.players.length; i++){
            var player = this.players[i];
            if(player.playerinfo.team == enums.Observer) continue;
            player.playerinfo.requested = true;
            //console.log('team ' + player.playerinfo.team + ' current count' + player.playerinfo.gameCount);
        }
        this.requested = true;

        //this.periodicRequestSyncTimeout = setTimeout(this.requestSync.bind(this), period_request_sync);
    }, // end requestSync
    checkGotPlayerSync:function(){
        if(!this.requested) return;
        // If Any Player has not yet replied, return.
        for(var i = 0; i < this.players.length; i++){
            var player = this.players[i];
            if(player.playerinfo.team == enums.Observer) continue;
            if(player.playerinfo.requested) return;
        }
        this.requested = false;
        //console.log('in checkGotPlayerSync')
        for(var i = 0; i < this.players.length; i++){
            var player = this.players[i];
            //console.log('team ' + player.playerinfo.team + ' got count' + player.playerinfo.gameCount);
        }
        this.forceSync('periodic');
        //console.log('GotPlayerSync')
    },
    forceSync: function(type){
        if(this.state != enums.InGame) return;
        //console.log('forceSync')
        //console.log('in forcesync ' + this.gameinfo.requireUpdate)
        if(this.gameinfo.requireUpdate) this.gameinfo.requireUpdate = false;

        var msg = { sync_type: type,
                    players: [{},{},{},{}]};

        for(var i = 0; i < this.players.length; i++){
            var player = this.players[i];
            if(player.playerinfo.team == enums.Observer) continue;
            var team = player.playerinfo.team;
            msg.players[team].gameCount = player.playerinfo.gameCount;
            msg.players[team].characters = this.gameinfo.players[team].characters;
            msg.players[team].coins = player.playerinfo.coins;
        }
        this.io.in(this.name).emit('periodic server sync', msg);

        if(this.gameinfo.units_have_died){
            this.gameinfo.clean_dead_units();
        }
        //clearTimeout(this.periodicSyncTimeout);
        //this.periodicSyncTimeout = setTimeout(this.periodicSync.bind(this), period_server_sync);
    }, // end forceSync
    // Obsolete sync
    sync: function(player, msg){
        /*
        for(var i = 0; i < player.gameinfo.characters.length; i++){
                if(player.gameinfo.characters[i] == undefined) continue;
                for(var j = 0; j < player.gameinfo.characters[i].length; j++){
                    var c = player.gameinfo.characters[i][j];
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

        var msg = {team: player.playerinfo.team, characters: msg};
        this.players.forEach(function(p){
            //if(p != player){
                //console.log('player ' + p.team + ' to path.')
                p.socket.emit('sync', msg)
            //}
        });*/
    }, // end sync
} // end Game

function getColor(team){
    team = parseInt(team);
    switch(team){
        case enums.Team0:
            return enums.Red;
        case enums.Team1:
            return enums.Blue;
        case enums.Team2:
            return enums.Teal;
        case enums.Team3:
            return enums.Purple;
        case enums.Observer:
            return enums.Black;
    }
    return enums.Black;
}

function SpawnCounter(){
    this.init();
} // end SpawnCounter
SpawnCounter.prototype = {
    init: function(){
        this.counter = 0;
        this.time = [0, 0, 0, 0];
    },
    add: function(team, timer){
        this.time[team] = timer;
    },
    update: function(){
        this.counter++;
        var msg = {teams: []};
        for(var i = 0; i < this.time.length; i++){
            if(this.time[i] == 0) continue;
            if(this.counter % this.time[i] == 0){
                msg.teams.push(i);
            }
        }
        if(msg.teams.length <= 0) return null;
        else return msg;
    } // end update
} // ebd SpawnCounter
