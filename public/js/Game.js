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
        this.collision_count = 0;
        this.collision_time = 40;
    },
    checkcollisions :function(){
        this.collision_count++;
        if(this.collision_count < this.collision_time) return;
        this.resetcollisioncounts();
        for(var i = 0; i < this.teams.length; i++){
            for(var j = 0; j < this.teams[i].characters.length; j++){
                for(var k = 0; k < this.teams[i].characters[j].length; k++){
                    var c = this.teams[i].characters[j][k];
                    if(c.collision_count >= 4) continue;
                    this.checkcollision(c);
                }
            }
        }
    },
    checkcollision: function(c){
      for(var i = 0; i < this.teams.length; i++){
            for(var j = 0; j < this.teams[i].characters.length; j++){
                for(var k = 0; k < this.teams[i].characters[j].length; k++){
                    var c2 = this.teams[i].characters[j][k];
                    if(c2.collision_count >= 4) continue;
                    c.collide(c2);
                }
            }
        }
    },
    resetcollisioncounts:function(){
        for(var i = 0; i < this.teams.length; i++){
            for(var j = 0; j < this.teams[i].characters.length; j++){
                for(var k = 0; k < this.teams[i].characters[j].length; k++){
                    this.teams[i].characters[j][k].collision_count = 0;
                }
            }
        }
    },
    update: function(){
        this.checkcollisions();
        this.teams.forEach(function(team){
            team.update();
        })
    },
    getTeam: function(team){
        return this.teams[team];
    },
    startgame: function(){
        //stage.width = width;
        //stage.height = height;
    switch(0){ // startlocation
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
    /*var msg = {team: myteam, color: myteamcolor, characters: []};
    for(var i = 0; i < 1; i++){
        for(var j = 0; j < 1; j++){
            spawnCow(-stage.x + width/2 + width/20*j,-stage.y + height/2 + width/20*i, msg);
        }
    }

    communication.socket.emit('spawn', msg);
    //spawnCow(-stage.x + width/2,-stage.y + height/2);

    //spawnCow(-stage.x + width/2 + width/50,-stage.y + height/2);

    center = this.getTeam(myteam).characters[CharacterType.Cow][0].pos;
    */
    }
}; // end Game
function spawnCow(x, y, msg){
    var input = {  x: x, y: y,
                    type: CharacterType.Cow, team: myteam, color: myteamcolor};

    var character = characters.spawn(input);
    game.getTeam(myteam).characters[input.type].push(character);
    //console.log(input)
    msg.characters.push({  x: input.x/stage_width, y: input.y/stage_height, type: CharacterType.Cow});
    //communication.socket.emit('spawn', {  x: input.x/stage_width, y: input.y/stage_height, type: CharacterType.Cow});
}

function Team(team){
    this.team = team;
    this.path = new Path(team);

    this.sync_count = 0;
    this.sync_time = 200;
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
                this.sendSyncCharacter();
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
    sendSyncCharacter:function(){
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
                msg[i].push({x: c.pos.x/stage_width, y: c.pos.y/stage_height,
                vx:c.vel.x / stage_width, vy: c.vel.y / stage_height, type: c.type})
            }
        }
        communication.socket.emit('sync character', msg)
        this.sendSyncPath();
    }, // emd sendSyncCharacter
    sendSyncPath : function(){

    }

} // end Team

