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
    }, // end init
    getName:function(){
        return this.name;
    },
    join : function(player){
        console.log(player.name + ' joins ' + this.name);

    },
    updateplayerlist : function(){
        console.log('updateplayerlist')
        var msg = {players: []};
        for(var i = 0; i < this.players.length; i++){
            msg.players.push(this.players[i].getName());
        }
        //this.players.forEach(function(p){
            //player.emit('game list', msg)
        //});
    }
} // end gameServer
