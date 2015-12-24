function Game(){
    this.teams = [];
    this.teams.push(new Team(0));
    this.teams.push(new Team(1));
    this.teams.push(new Team(2));
    this.teams.push(new Team(3));
    this.players = [];
    this.init();
}
Game.prototype = {
    init: function(){
        this.minimap = new MiniMap();
        this.ui = new GameUI(this);
        this.collision_count = 0;
        this.collision_time = 2;
        this.updateOpponent_count = 0;
        this.updateOpponent_time = 20;
    },
    clean: function(){
        this.players.splice(0,this.players.length)
    },
    checkcollisions :function(){
        this.collision_count++;
        if(this.collision_count < this.collision_time) return;
        this.collision_count = 0;
        //this.resetcollisioncounts();
        for(var i = 0; i < this.teams.length; i++){
            for(var j = 0; j < this.teams[i].characters.length; j++){
                for(var k = 0; k < this.teams[i].characters[j].length; k++){
                    var c = this.teams[i].characters[j][k];
                    //if(!c.sprite.visible) continue;
                    //if(!c.sprite.visible && i != myteam) continue;
                    if(c.collision_count >= 2) continue;

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
                    //if(arrayContains(c2.status, StatusType.Inanimate)) continue;
                    //if(!c.sprite.visible) continue;
                    //if(!c2.sprite.visible && i != myteam) continue;
                    if(c2.collision_count >= 2) continue;
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
                if(arrayContains(c.status, StatusType.Inanimate)) continue;
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
        if(gamestate != GameState.InPlay) return;
        gameCount++;

        this.checkcollisions();
        this.updateOpponent();
        this.teams.forEach(function(team){
            team.update();
        });
        this.minimap.update();
        this.ui.update();
    },
    getTeam: function(team){
        return this.teams[team];
    },
    startsingle:function(){
        gameCount = 0;
        stagelayout.place_stage();
        gamestate = GameState.InPlay;
        gamemode = GameMode.SinglePlayer;
        stage.x = 0;
        stage.y = 0;
        myteam = 0;
        myteamcolor = this.getTeam(myteam.color);

        this.teams.forEach(function(t){
            t.startsingle();
        })
        //center = this.getTeam(myteam).characters[CharacterType.Cow][0].pos.clone();
        this.minimap.init();
        this.ui.init();

    },
    // Multiplayer Start Game
    startgame: function(){
        stagelayout.place_stage();
        gamestate = GameState.InPlay;
        gamemode = GameMode.MultiPlayer;
        this.teams.forEach(function(t){
            t.restartPath();
        })
        //stage.width = width;
        //stage.height = height;
        myteamcolor = this.getTeam(myteam.color);
        gamestartCount = 0;
        gameCount = 0;

        var loc = getstartlocation(startlocation);
        stage.x = -loc.x;
        stage.y = -loc.y;

        //this.spawnBase();

       /* var input = {   x: this.startlocation_pos.x + width/2,
                                y: this.startlocation_pos.y + height/2,
                    type: CharacterType.Hut, team: this.team, color: this.color};
        var character = characters.spawn(input);
        this.characters[input.type].push(character);*/


    //var msg = {team: myteam, color: myteamcolor, characters: []};
    //spawnUnitMsg(loc.x + width/2,loc.y + height/2, msg, CharacterType.Hut);

    /*for(var i = -3; i < 3; i++){
        for(var j = -3; j < 3; j++){
            spawnUnit(-stage.x + width/2 + width/20*j,-stage.y + height/2 + width/20*i, msg, CharacterType.Cow);
        }
    }*/

    //communication.socket.emit('spawn', msg);
    //spawnCow(-stage.x + width/2,-stage.y + height/2);

    //spawnCow(-stage.x + width/2 + width/50,-stage.y + height/2);

    //center = this.getTeam(myteam).characters[CharacterType.Cow][0].pos;
    this.minimap.init();
    this.ui.init();

    },
    spawnBase:function(msg){
        /*console.log('Spawn Base')
        console.log(this.players)
        debugger;*/

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
function spawnUnitMsg(x, y, msg, type){
    var input = {  x: x, y: y,
                    type: type, team: myteam, color: myteamcolor};

    //var character = characters.spawn(input);
    //game.getTeam(myteam).characters[input.type].push(character);
    //console.log(input)
    msg.characters.push({  x: input.x/stage_width, y: input.y/stage_height, type: type});
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
    this.sync_time = Client_to_Server_Sync_Period;
    this.sync_force = false;

    this.spawn_count = 0;
    this.spawn_time = SinglePlayer_Spawn_Period;
    this.spawn_j = 0;
    this.spawn_i = 0;
    this.init();
    this.max_unit_count = max_unit_count;
}

function getTeam(team){
    //console.log(team)
    switch(team){
        case Team0:
            return 'Team 0';
        case Team1:
            return 'Team 1';
        case Team2:
            return 'Team 2';
        case Team3:
            return 'Team 3';
        case Observer:
            return 'Observer';
    }
    return '';
}

Team.prototype = {
    init: function(){
        this.characters = characters.pool.initList();
        this.reset();
    },
    reset: function(){
        this.coins = 0;
        this.attack_upgrades = 0;
        this.defense_upgrades = 0;
        this.speed_upgrades = 0;
    }, // end Team reset
    clean: function(){
        this.Dead = false;
    },
    restartPath:function(){
        this.path.restart();
    },
    startsingle:function(){
        this.restartPath();
        var input = {   x: this.startlocation_pos.x + width/2,
                                y: this.startlocation_pos.y + height/2,
                    type: CharacterType.Hut, team: this.team, color: this.color};
        var character = characters.spawn(input);
        this.characters[input.type].push(character);

        /*for(var i = -1; i < 1; i++){
            for(var j = -1; j < 1; j++){
                input = {   x: this.startlocation_pos.x + width/2 + width/20*j,
                                y: this.startlocation_pos.y + height/2 + width/20*i,
                    type: CharacterType.Cow, team: this.team, color: this.color};
                character = characters.spawn(input);
                this.characters[input.type].push(character);
            }
        }*/
    },
    startmultiplayer:function(player){
        this.restartPath();
        var input = {   x: this.startlocation_pos.x + width/2,
                                y: this.startlocation_pos.y + height/2,
                    type: CharacterType.Hut, team: this.team,
                    color: this.color, id: player.base_id
                };
        var character = characters.spawn(input);
        this.characters[input.type].push(character);
    },
    spawnSinglePlayer:function(){
        if(gamemode == GameMode.MultiPlayer) return;

        if(this.characters[CharacterType.Cow].length >= this.max_unit_count) return;
        this.spawn_count++;
        if(this.spawn_count < this.spawn_time) return;
        this.spawn_count = 0;
        this.spawn(0);
    },
    spawn:function(id){
        if(this.characters[CharacterType.Hut].length <= 0){
            this.Dead = true;
            return;
        }
        if(this.characters[CharacterType.Cow].length >= this.max_unit_count) return;
        if(this.spawn_j > 2) this.spawn_j = -this.spawn_j;
        if(this.spawn_i > 2){
          this.spawn_i = -this.spawn_i;
          this.spawn_j++;
        }
        var input = {   x: this.startlocation_pos.x + width/2 + this.spawn_i++*big_dim/20,
                        y: this.startlocation_pos.y + height/2 + this.spawn_j*big_dim/20, // + this.characters[CharacterType.Hut][0].r
                        id: id,
                    type: CharacterType.Cow, team: this.team, color: this.color};

        /*if(gamemode == GameMode.MultiPlayer && this.team == myteam){
            var msg = {team: myteam, color: myteamcolor, characters: []};
            spawnUnitMsg(input.x, input.y, msg, CharacterType.Cow);
            communication.socket.emit('spawn', msg);
        }else if(gamemode != GameMode.MultiPlayer){*/
            var character = characters.spawn(input);
            this.characters[input.type].push(character);
        //}
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
        this.spawnSinglePlayer();
        this.sendPeriodicSync();
        //this.sendForceSync();
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

    sendPeriodicSync:function(){
        if(gamemode != GameMode.MultiPlayer) return;
        if(gamestate != GameState.InPlay) return;
        if(this.team != myteam) return;
        this.sync_count++;
        if(this.sync_count < this.sync_time && !this.sync_force) return;
        if(this.sync_force) this.sync_force = false;
        this.sync_count = 0;
        //console.log('sendSync')
        var msg = {gameCount    : gameCount,
            players: [{characters: []}, {characters: []}, {characters: []}, {characters: []}]};

        for(var i = 0; i < game.teams.length; i++){
        var team = game.teams[i];
            for(var j = 0; j < team.characters.length; j++){
                if(team.characters[j] == undefined) continue;
                msg.players[i].characters[j] = [];
                for(var k = 0; k < team.characters[j].length; k++){
                    var c = team.characters[j][k];
                    // Player Team
                    if(i == myteam){
                        msg.players[i].characters[j].push({
                            x: c.pos.x / stage_width,
                             y: c.pos.y / stage_height,
                            vx: c.vel.x / stage_width,
                            vy: c.vel.y / stage_height,
                            hp: c.hp,
                            type: c.type,
                            id: c.id})
                    }else{
                        msg.players[i].characters[j].push({
                            dmg: c.dmg,
                            type: c.type,
                            id: c.id})
                        c.dmg = 0;
                    }
                }
            }
        }
        /*
                    //characters  : []};
        for (var i = 0; i < this.characters.length; i++) {
            if(this.characters[i] == undefined) continue;
            msg.players[myteam].characters[i] = [];
            for(var j = 0; j < this.characters[i].length;j++){
                var c = this.characters[i][j];
                if(c.s_vel == undefined) debugger;
                c.s_vel.x = c.vel.x;
                c.s_vel.y = c.vel.y;
                c.s_pos.x = c.pos.x;
                c.s_pos.y = c.pos.y;
                msg.players[myteam].characters[i].push({
                            x: c.pos.x / stage_width,
                             y: c.pos.y / stage_height,
                            vx: c.vel.x / stage_width,
                            vy: c.vel.y / stage_height,
                            hp: c.hp,
                            type: c.type,
                            id: c.id})
            }
        }*/
        communication.socket.emit('periodic client sync', msg)
        this.sendSyncPath();
    }, // end sendPeriodicSync
    sendForceSync : function(){
        if(!this.sync_force) return;
        if(gamemode != GameMode.MultiPlayer) return;
        if(gamestate != GameState.InPlay) return;
        if(this.team != myteam) return;
        this.sync_force = false;
        console.log('send Force Sync')
        this.sync_count = 0;
        //console.log('sendSync')
        var msg = {gameCount    : gameCount,
                    characters  : []};
        for (var i = 0; i < this.characters.length; i++) {
            if(this.characters[i] == undefined) continue;
            msg.characters[i] = [];
            for(var j = 0; j < this.characters[i].length;j++){
                var c = this.characters[i][j];
                /*
                // Where the character will actually be - Where they are simulated / Period to get the adjusted simulated velocity
                var predict = new PVector(
                            c.pos.x +
                            c.vel.x*Server_Sync_Period_Estimate,
                            c.pos.y +
                            c.vel.y*Server_Sync_Period_Estimate);

                c.s_vel.x = (predict.x - c.s_pos.x) / Server_Sync_Period_Estimate;
                c.s_vel.y = (predict.y - c.s_pos.y) / Server_Sync_Period_Estimate;*/
                msg.characters[i].push({
                            //x: c.s_pos.x / stage_width,
                            //y: c.s_pos.y / stage_height,
                            //vx: c.s_vel.x / stage_width,
                            //vy: c.s_vel.y / stage_height,
                             x: c.pos.x / stage_width,
                             y: c.pos.y / stage_height,
                            vx: c.vel.x / stage_width,
                            vy: c.vel.y / stage_height,
                            hp: c.hp,
                            type: c.type,
                            id: c.id})
                c.s_pos.x = c.pos.x;
                c.s_pos.y = c.pos.y;
                c.s_vel.x = c.vel.x;
                c.s_vel.y = c.vel.y;
            }
        }

        communication.socket.emit('force client sync', msg)
        //debugger;
    }, // end sendForceSync
    sendSyncDeadCharacter:function(type, index, id){
        if(gamemode != GameMode.MultiPlayer) return;
        //if(this.team != myteam) return;
        var msg = {type: type, index: index, id: id};
        communication.socket.emit('sync dead character', msg)

    },
    sendSyncPath : function(){

    },
    upgrade_cost: function(upgrade_type){
        var upgrades;
        switch(upgrade_type){
            case UpgradeType.Attack:
                upgrades = this.attack_upgrades;
            break;
            case UpgradeType.Defense:
                upgrades = this.defense_upgrades;
            break;
            case UpgradeType.Speed:
                upgrades = this.speed_upgrades;
            break;
        }
        return 5 + upgrades *5;
    },
    upgrade:function(upgrade_type){
        var cost = this.upgrade_cost(upgrade_type);
        if(this.coins >= cost){
            this.coins -= cost;
            return true;
        }
        return false;
    },
    upgrade_finished : function(upgrade_type){
        //console.log('upgrade_finished ' + upgrade_type)
        switch(upgrade_type){
            case UpgradeType.Attack:
                this.attack_upgrades++;
            break;
            case UpgradeType.Defense:
                this.defense_upgrades++;
            break;
            case UpgradeType.Speed:
                this.speed_upgrades++;
            break;
        }
        for(var i = 0; i < this.characters[CharacterType.Cow].length; i++){
            var character = this.characters[CharacterType.Cow][i];
            character.upgrade_update();
        }
    }, // end Team upgrade_finished

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
var getCoin = function(team, opponent){
    //particles.spawn({x: MousePos.stage_x_pct*stage_width, y:MousePos.stage_y_pct*stage_height,
    if(team == myteam){
        particles.spawn({x: opponent.pos.x, y: opponent.pos.y,
                     lifespan_d: 10,
                     ax: getRandomArbitrary(-1, 1)*-width*0.001,
                     ay: getRandomArbitrary(0.5, 1)*-height*0.001,
                     rs: dim*0.025,
                     re: dim*0.025,
                      container: stage},//particles.container
                     ParticleType.COIN);
    }
    if(gamemode == GameMode.SinglePlayer) game.teams[team].coins++;
    else game.teams[team].sync_force = true;

}
