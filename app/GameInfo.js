var enums = require("./enums.js");
module.exports = exports = GameInfo;

var maxline = 3;

function GameInfo(){
    this.init();
} // end GameInfo
GameInfo.prototype = {
    init: function(){
        //this.team = enums.Observer;
        //this.location = 0;
        //this.characters = characterlist();
        //this.path_points = [];
        this.players = [];
        for(var i= 0; i < 4; i++){
            var characters = characterlist();
            this.players.push({playerinfo : null,
                                 characters: characters,
                                path_points: []});
        }
        this.requireUpdate = false;
        this.units_have_died = false;
    },
    join: function(player){
        var team = player.playerinfo.team;
        this.players[team].playerinfo = player.playerinfo;
    },
    leave: function(player){
        var team = player.playerinfo.team;
        this.players[team].playerinfo = null;
    },
    onPath : function(player, msg){
        var team = player.playerinfo.team;

        if(this.players[team].path_points.length >= 2*maxline){
            this.players[team].path_points.splice(0,2);
        }
        msg[0].x = msg[0].x / this.players[team].playerinfo.stage_width;
        msg[0].y = msg[0].y / this.players[team].playerinfo.stage_height;
        msg[1].x = msg[1].x / this.players[team].playerinfo.stage_width;
        msg[1].y = msg[1].y / this.players[team].playerinfo.stage_height;
        this.players[team].path_points.push({x: msg[0].x,
                                 y: msg[0].y});
        this.players[team].path_points.push({x: msg[1].x,
                                 y: msg[1].y});
    },
    onSyncUpdateClient : function(player, msg){
        var team = player.playerinfo.team;
        player.playerinfo.gameCount = msg.gameCount;
        if(player.playerinfo.requested) player.playerinfo.requested = false;
        //console.log('gameCount ' + this.gameCount);
        for(var i = 0; i < this.players.length; i++){
            for(var j = 0; j < this.players[i].characters.length; j++){
                if(this.players[i].characters[j] == undefined) continue;
                for(var k = 0; k < this.players[i].characters[j].length; k++){
                    var c = this.players[i].characters[j][k];
                    var m = msg.players[i].characters[j][k];
                    if(c == null || m == null) continue;
                    if(c.id != m.id){
                        console.log('c.id: ' + c.id);
                        console.log('m.id: ' + m.id);
                    }
                    if(i == team){
                        c.x = m.x;
                        c.y = m.y;
                        c.vx = m.vx;
                        c.vy = m.vy;
                        c.hp = m.hp;
                    }else{
                        if(c.hp > 0 && m.dmg > c.hp){
                            player.playerinfo.coins += 1;
                            c.Dead = true;
                            console.log(c.id + ' has died');
                            this.units_have_died = true;
                            this.requireUpdate = true;
                        }
                        c.hp -= m.dmg;
                    }
                }
            }
        }
        //console.log('onSyncUpdateClient')
        //console.log(this.characters)
    }, // end onSyncUpdateClient
    clean_dead_units : function(){
        if(!this.units_have_died) return;
        this.units_have_died = false;
        for(var i = 0; i < this.players.length; i++){
            for(var j = 0; j < this.players[i].characters.length; j++){
                if(this.players[i].characters[j] == undefined) continue;
                for(var k = this.players[i].characters[j].length -1;
                     k > 0; k--){
                    var c = this.players[i].characters[j][k];
                    if(c.Dead){
                        this.players[i].characters[j].splice(k, 1);
                    }
                }
            }
        }
    },// end clean_dead_units

}; // end GameInfo
function characterlist(){
    var list = [];
    list[enums.Cow] = [];
    list[enums.Hut] = [];
    return list;
}
