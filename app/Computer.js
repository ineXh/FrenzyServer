var enums = require("./enums.js");
module.exports = exports = Computer;

function Computer(name){
    this.init(name);
} // end Computer
Computer.prototype = {
    init: function(name){
        this.name = name;
        var PlayerInfo = require('./PlayerInfo.js');
        this.playerinfo = new PlayerInfo();
        //var client = {playerinfo: this.playerinfo};
    }
}
