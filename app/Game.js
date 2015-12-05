var enums = require("./enums.js");
module.exports = exports = Game;

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function Game(io, name){
    this.io = io;
    this.name = name;
    this.init();
    //return this;
} // end Game
Game.prototype = {
    init: function(){
        this.players = [];
        this.teams = [enums.Team0, enums.Team1, enums.Team2, enums.Team3];
    }, // end init
    getName:function(){
        return this.name;
    },
    getPlayers:function(){
        return this.players.length;
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
        var msg = '';
        this.players.forEach(function(p){
            p.emit('start game', msg);
        });
    },
    changeTeam : function(player, team){
        var index = -1;
        for(var i = 0; i < this.teams.length; i++){
            if(team == this.teams[i]) index = i;
        }
        /*console.log(this.teams)
        console.log('team ' + team)
        if(team == enums.Team0) console.log('Team0')
        if(team == enums.Team1) console.log('Team1')
        if(team == enums.Team2) console.log('Team2')
        if(team == enums.Team3) console.log('Team3')*/

        //var index = this.teams.indexOf(team);
        console.log('index ' + index)
        if(index > -1){
            this.teams.splice(index,1);
            this.teams.push(player.team);
            player.team = team;

        }
        this.updateplayerlist();
    },
    updateplayerlist : function(){
        console.log('updateplayerlist')
        var msg = {players: []};
        for(var i = 0; i < this.players.length; i++){
            msg.players.push({name: this.players[i].name, team: this.players[i].team});
        }
        this.players.forEach(function(p){
            p.emit('game player list', msg);
        });
        //this.players.forEach(function(p){
            //player.emit('game list', msg)
        //});
    }
} // end gameServer
