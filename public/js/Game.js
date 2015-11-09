function Game(){
    this.teams = [];
    this.teams.push(new Team(0));
    this.teams.push(new Team(1));
    this.teams.push(new Team(2));
    this.teams.push(new Team(3));

    this.init();
}
Game.prototype = {
    init: function(){

    },
    update: function(){
        this.teams.forEach(function(team){
            team.update();
        })
    },
    getTeam: function(team){
        return this.teams[team];
    },
    startgame: function(){
    switch(startlocation){ //
        case StartLocation.NW:
            stage.x = 0;
            stage.y = 0;
            break;
        case StartLocation.NE:
            stage.x = -stage_width + width;
            stage.y = 0;
            break;
        case StartLocation.SW:
            stage.x = 0;
            stage.y = -stage_height + height;
            break;
        case StartLocation.SE:
            stage.x = -stage_width + width;
            stage.y = -stage_height + height;
            break;
    }
    var input = {  x: -stage.x + width/2, y: -stage.y + height/2,
                    type: CharacterType.Cow, team: myteam, color: myteamcolor};

    var character = characters.spawn(input);
    this.getTeam(myteam).characters[input.type].push(character);
    //console.log(input)
    communication.socket.emit('spawn', {  x: input.x/stage_width, y: input.y/stage_height, type: CharacterType.Cow});
    //center = characters.characters[CharacterType.Cow][0].pos;
    center = this.getTeam(myteam).characters[CharacterType.Cow][0].pos;

    }
}; // end Game
function Team(team){
    this.team = team;
    this.path = new Path(team);
    this.sync_count = 0;
    this.sync_time = 300;
    this.init();
}
Team.prototype = {
    init: function(){
        this.characters = characters.pool.initList();
    },
    clean: function(){

    },
    update: function(){

        for (var i = 0; i < this.characters.length; i++) {
            if(this.characters[i] == undefined) continue;
            for(var j = this.characters[i].length - 1; j >= 0; j--) {
                var c = this.characters[i][j];
                c.update(this.path);
                this.sendSync();
                if(c.isDead()){
                    this.clean(c);
                    var index = this.characters[c.type].indexOf(i);
                    if(index > -1){
                        var val = this.characters[c.type][index];
                        this.characters[c.type].splice(index,1);
                    }
                    this.characters.splice(i,1);
                }
            }
        }
    }, // end update
    sendSync:function(){
        if(this.team != myteam) return;
        this.sync_count++;
        if(this.sync_count < this.sync_time) return;
        //console.log('sendSync')
        this.sync_count = 0;
        var msg = [];
        for (var i = 0; i < this.characters.length; i++) {
            if(this.characters[i] == undefined) continue;
            msg[i] = [];
            for(var j = 0; j < this.characters[i].length;j++){
                var c = this.characters[i][j];
                msg[i].push({x: c.pos.x/stage_width, y: c.pos.y/stage_height, type: c.type})
            }
        }
        communication.socket.emit('sync', msg)
    }
} // end Team

