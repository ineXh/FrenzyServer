var enums = require("./enums.js");
module.exports = exports = gameServer;

// //////////////////////
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

var colors = [enums.Red, enums.Blue, enums.Teal, enums.Purple,
              enums.Brown, enums.Orange, enums.DarkOrange,
              enums.LightGreen, enums.DarkGreen, enums.Lime,
              enums.Aqua, enums.LightBlue, enums.DarkPurple,
              enums.Burlywood  ];
colors.sort(function(a,b) { return Math.random() > 0.5; } );

function gameServer(io){
    this.io = io;
    this.games = [];

    this.init();
    //return this;
} // end gameServer
gameServer.prototype = {
    init: function(){
        var Game = require('./Game.js');
        game = new Game(this.io, this, 'Game 1');
        this.games.push(game)
        game = new Game(this.io, this, 'Game 2');
        this.games.push(game)
        game = new Game(this.io, this, 'Game 3');
        this.games.push(game)

        var obj = {
          time: (new Date()).getTime(),
          msg: htmlEntities('Welcome to Cow Frenzy'),
          author: 'Server',
          color: enums.Black,
          id:0
        };
        this.chathistory = [obj];
        this.players = [];
        this.player_ids = [];
        for(var i = 0; i < 90000; i++) this.player_ids.push(i);
    }, // end init

    join: function(player){
        this.players.push(player);
        console.log('total players on server ' + this.players.length);
        //player.name = 'Bob';
        player.id = this.player_ids.shift();
        player.globachatcolor = colors.shift();
        player.color = player.globachatcolor
        colors.push(player.color);

        player.state = enums.MultiPlayerMenu;
        this.send_joinserver_info(player);
        this.send_game_list(player);
        //console.log('start location ' + player.location);
    },
    leave: function(player){
        if(player.game != null) this.leaveGame(player);
        this.player_ids.push(player.id);

        //locations.push(player.location)
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
        player.socket.emit('chat', this.chathistory);
    },
    sendChat : function(player, msg){
      var obj = {
          time: (new Date()).getTime(),
          msg: htmlEntities(msg),
          author: player.name,
          color: player.color,
        };
        //console.log('color ' + obj.color)
        if(obj.color == undefined) obj.color = 'Black';

        this.chathistory.push(obj);
        this.chathistory = this.chathistory.slice(-10);

        this.io.in(player.room).emit('chat', obj);
    },
    joinGame : function(player, index){
        if(index < 0) return;
        if(this.games[index].getState() == enums.InGame) return;
        player.game = this.games[index];
        player.state = enums.GameRoom;
        player.game.join(player);
        this.send_game_list(null);

    },
    leaveGame: function(player){
        player.state = enums.MultiPlayerMenu;
        player.game.leave(player);
        player.game = null;
        var server = this;
        setTimeout(function(){server.send_game_list(player);},500);
    },

    send_game_list: function(player){
        var msg = {games: []};
        for(var i = 0; i < this.games.length; i++){
            msg.games.push({name    : this.games[i].getName(),
                            players : this.games[i].getPlayers(),
                            state   : this.games[i].getState()});
        }
        if(player == null){
            this.players.forEach(function(p){
                //console.log('player state ' + p.state)
                if(p.state == enums.MultiPlayerMenu) p.socket.emit('game list', msg)
            });
        }else{
            player.socket.emit('game list', msg)
        }
        //this.players.forEach(function(p){

        //});
    }, // end send_game_list
    send_joinserver_info: function(player){
        player.socket.emit('joinServer',
            {color      : player.color,
             id         : player.id,
         });
    }, // end send_joinserver_info
} // end gameServer

