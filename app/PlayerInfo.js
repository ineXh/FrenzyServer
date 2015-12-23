var enums = require("./enums.js");
module.exports = exports = PlayerInfo;

function PlayerInfo(){
    this.init();
} // end PlayerInfo
PlayerInfo.prototype = {
    init: function(){
        this.ingame = false;
        this.requested = false;
        this.width = 0;
        this.height = 0;
        this.stage_width = 0;
        this.stage_height = 0;
        this.gameCount = 0;
        this.location = 0;
        this.team = 0;
        this.coins = 0;

    }
}
