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
        this.minimap = new MiniMap();
        this.collision_count = 0;
        this.collision_time = 1;
        this.updateOpponent_count = 0;
        this.updateOpponent_time = 10;

    },
    checkcollisions :function(){
        this.collision_count++;
        if(this.collision_count < this.collision_time) return;
        this.collision_count = 0;
        this.resetcollisioncounts();
        for(var i = 0; i < this.teams.length; i++){
            for(var j = 0; j < this.teams[i].characters.length; j++){
                for(var k = 0; k < this.teams[i].characters[j].length; k++){
                    var c = this.teams[i].characters[j][k];
                    if(!c.sprite.visible && i != myteam) continue;
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
                    if(!c2.sprite.visible && i != myteam) continue;
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
    updateOpponent:function(){
        this.updateOpponent_count++;
        if(this.updateOpponent_count < this.updateOpponent_time) return;
        this.updateOpponent_count = 0;
        var find_closest_opponent = this.find_closest_opponent.bind(this);
        for(var i = 0; i < this.teams.length; i++){
            for(var j = 0; j < this.teams[i].characters.length; j++){
                for(var k = 0; k < this.teams[i].characters[j].length; k++){
                var c = this.teams[i].characters[j][k];
                    //if(!c.sprite.visible && i != myteam) continue;
                    find_closest_opponent(c);
                }
            }
        }
    },
    find_closest_opponent:function(c){
        //console.log('find_closest')
        //if(c.opponent != null) if(findDist(c.pos, c.opponent.pos <= dim*2/4)) return;
        /*if(c.opponent != null){
            c.opponent_dist = findDist(c.pos, c.opponent.pos);
            if(c.opponent_dist < c.r*6) return;
        }*/
        if(c.opponent_dist == undefined || c.opponent == null) c.opponent_dist = dim/2;
        var dist = dim/2;
        for(var i = 0; i < this.teams.length; i++){
            if(c.team == i) continue;
            for(var j = 0; j < this.teams[i].characters.length; j++){
                for(var k = 0; k < this.teams[i].characters[j].length; k++){
                    var c2 = this.teams[i].characters[j][k];
                    //if(!c2.sprite.visible && i != myteam) continue;
                    //console.log(c)
                    //console.log(c2)
                    new_dist = findDist(c.pos, c2.pos);
                    if(new_dist < dist && new_dist < c.opponent_dist){
                        c.opponent = c2;
                        c.opponent_dist = new_dist;
                    }
                }
            }
        }
    }, // end find_closest_opponent
    update: function(){
        this.checkcollisions();
        this.updateOpponent();
        this.teams.forEach(function(team){
            team.update();
        });
        this.minimap.update();
    },
    getTeam: function(team){
        return this.teams[team];
    },
    startsingle:function(){
        gamestate = GameState.InPlay;
        stage.x = 0;
        stage.y = 0;
        myteam = 0;
        myteamcolor = this.getTeam(myteam.color);

        this.teams.forEach(function(t){
            t.startsingle();
        })
        //center = this.getTeam(myteam).characters[CharacterType.Cow][0].pos.clone();
        this.minimap.init();

    },
    startgame: function(){
        //stage.width = width;
        //stage.height = height;
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
    var msg = {team: myteam, color: myteamcolor, characters: []};
    for(var i = -3; i < 3; i++){
        for(var j = -3; j < 3; j++){
            spawnCow(-stage.x + width/2 + width/20*j,-stage.y + height/2 + width/20*i, msg);
        }
    }

    communication.socket.emit('spawn', msg);
    //spawnCow(-stage.x + width/2,-stage.y + height/2);

    //spawnCow(-stage.x + width/2 + width/50,-stage.y + height/2);

    //center = this.getTeam(myteam).characters[CharacterType.Cow][0].pos;
    this.minimap.init();

    },
    onTouchStart: function(){
        if(gamestate == GameState.InPlay){
            if(isTouching(MousePos.x, MousePos.y, game.minimap.map)){
                this.minimap.onTouchStart();
                this.minimaptouched = true;
                //console.log('minimaptouched')
                return;
            }
            pan();
            game.getTeam(myteam).path.startPath(MousePos.stage_x, MousePos.stage_y);
        }
    },
    onTouchMove:function(){
        if(gamestate == GameState.InPlay){
            //pan();
            //center.x += MousePos.px - MousePos.x;
            if(this.minimaptouched
                //|| isTouching(MousePos.x, MousePos.y, game.minimap.map)
                ){
                this.minimap.onTouchMove();
                return;
            }
            pan();
            game.getTeam(myteam).path.updatePath(MousePos.stage_x, MousePos.stage_y);
        }
    },
    onTouchEnd:function(){
        if(gamestate == GameState.InPlay){
            if(this.minimaptouched){
                this.minimaptouched = false;
                //console.log('minimap not touched')
                return;
            }
            this.minimaptouched = false;
            //console.log('minimap not touched')
            game.getTeam(myteam).path.endPath(MousePos.stage_x, MousePos.stage_y);
            if(gamemode == GameMode.MultiPlayer) communication.socket.emit('path', game.getTeam(myteam).path.getLastTwoPoints());
        }
    },
    onTouching:function(){
        if(gamestate != GameState.InPlay) return;
        if(!MousePos.touched) return;
        if(this.minimaptouched) return;
        pan();
    }
}; // end Game
function spawnCow(x, y, msg){
    var input = {  x: x, y: y,
                    type: CharacterType.Cow, team: myteam, color: myteamcolor};

    //var character = characters.spawn(input);
    //game.getTeam(myteam).characters[input.type].push(character);
    //console.log(input)
    msg.characters.push({  x: input.x/stage_width, y: input.y/stage_height, type: CharacterType.Cow});
    //communication.socket.emit('spawn', {  x: input.x/stage_width, y: input.y/stage_height, type: CharacterType.Cow});
}

function Team(team){
    this.team = team;
    this.path = new Path(team);
    this.color = (team == 0)? Red:
                 (team == 1)? Blue:
                 (team == 2)? Teal:
                 (team == 3)? Purple: Red;

    this.startlocation = (team == 0)? StartLocation.NW:
                         (team == 1)? StartLocation.NE:
                         (team == 2)? StartLocation.SW:
                         (team == 3)? StartLocation.SE: StartLocation.NW;
    this.startlocation_pos = getstartlocation(this.startlocation);
    this.sync_count = 0;
    this.sync_time = 5;
    this.init();
}
Team.prototype = {
    init: function(){
        this.characters = characters.pool.initList();
    },
    clean: function(){

    },
    startsingle:function(){
        var input = {   x: this.startlocation_pos.x + width/2,
                                y: this.startlocation_pos.y + height/2,
                    type: CharacterType.Hut, team: this.team, color: this.color};
        var character = characters.spawn(input);
        this.characters[input.type].push(character);
        
        for(var i = -1; i < 1; i++){
            for(var j = -1; j < 1; j++){
                input = {   x: this.startlocation_pos.x + width/2 + width/20*j,
                                y: this.startlocation_pos.y + height/2 + width/20*i,
                    type: CharacterType.Cow, team: this.team, color: this.color};
                character = characters.spawn(input);
                this.characters[input.type].push(character);
            }
        }
    },
    update: function(){
        for (var i = 0; i < this.characters.length; i++) {
            if(this.characters[i] == undefined) continue;
            for(var j = this.characters[i].length - 1; j >= 0; j--) {
                var c = this.characters[i][j];
                c.update(this.path);
                this.check_dead(c);
            }
        }
        this.sendSyncCharacter();
    }, // end update
    check_dead:function(c){
        if(c.isDead()){
            var index = this.characters[c.type].indexOf(c);
            if(index > -1){
                var val = this.characters[c.type][index];

                if(gamemode != GameMode.MultiPlayer){
                    this.characters[c.type].splice(index,1);
                    characters.clean(c);
                }else{
                    this.sendSyncDeadCharacter(c.type, index, c.id);
                }
            }
        }
    }, // end check_dead

    sendSyncCharacter:function(){
        if(gamemode != GameMode.MultiPlayer) return;
        if(this.team != myteam) return;
        this.sync_count++;
        if(this.sync_count < this.sync_time) return;
        this.sync_count = 0;
        //console.log('sendSync')
        this.sync_count = 0;
        var msg = [];
        for (var i = 0; i < this.characters.length; i++) {
            if(this.characters[i] == undefined) continue;
            msg[i] = [];
            for(var j = 0; j < this.characters[i].length;j++){
                var c = this.characters[i][j];
                msg[i].push({x: c.pos.x / stage_width,
                             y: c.pos.y / stage_height,
                            vx: c.vel.x / stage_width,
                            vy: c.vel.y / stage_height,
                            hp: c.hp,
                            type: c.type,
                            id: c.id})
            }
        }
        communication.socket.emit('sync character', msg)
        this.sendSyncPath();
    }, // end sendSyncCharacter
    sendSyncDeadCharacter:function(type, index, id){
        if(gamemode != GameMode.MultiPlayer) return;
        //if(this.team != myteam) return;
        var msg = {type: type, index: index, id: id};
        communication.socket.emit('sync dead character', msg)

    },
    sendSyncPath : function(){

    }

} // end Team

var getstartlocation = function(startlocation){
    loc = new PVector(0,0);
    switch(startlocation){ //
        case StartLocation.NW:
            loc.x = 0;
            loc.y = 0;
            break;
        case StartLocation.NE:
            loc.x = stage_width - width;
            loc.y = 0;
            break;
        case StartLocation.SW:
            loc.x = 0;
            loc.y = stage_height - height;
            break;
        case StartLocation.SE:
            loc.x = stage_width - width;
            loc.y = stage_height - height;
            break;
    }
    return loc;
} // end getstartlocation
