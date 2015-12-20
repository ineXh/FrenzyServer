var enums = require("./enums.js");
module.exports = exports = GameInfo;

var maxline = 3;

function GameInfo(){
    this.init();
} // end GameInfo
GameInfo.prototype = {
    init: function(){
        this.ingame = false;
        this.width = 0;
        this.height = 0;
        this.stage_width = 0;
        this.stage_height = 0;
        this.gameCount = 0;
        this.team = enums.Observer;
        this.location = 0;
        this.characters = characterlist();
        this.path_points = [];
    },
    onPath : function(msg){
        if(this.path_points.length >= 2*maxline){
            this.path_points.splice(0,2);
        }
        msg[0].x = msg[0].x / this.stage_width;
        msg[0].y = msg[0].y / this.stage_height;
        msg[1].x = msg[1].x / this.stage_width;
        msg[1].y = msg[1].y / this.stage_height;
        this.path_points.push({x: msg[0].x,
                                 y: msg[0].y});
        this.path_points.push({x: msg[1].x,
                                 y: msg[1].y});
    },
    onSyncPeriodClient : function(msg){
        this.gameCount = msg.gameCount;
        //console.log('gameCount ' + this.gameCount);
        for(var i = 0; i < this.characters.length; i++){
            if(this.characters[i] == undefined) continue;
            for(var j = 0; j < this.characters[i].length; j++){
                var c = this.characters[i][j];
                var m = msg.characters[i][j];
                if(c != null && m != null){
                    c.x = m.x;
                    c.y = m.y;
                    c.vx = m.vx;
                    c.vy = m.vy;
                    c.hp = m.hp;
                }
            }
        }
        //console.log('onSyncPeriodClient')
        //console.log(this.characters)
    },
}; // end GameInfo
function characterlist(){
    var list = [];
    list[enums.Cow] = [];
    list[enums.Hut] = [];
    return list;
}
