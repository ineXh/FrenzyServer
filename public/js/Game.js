function Game(){this.teams=[],this.teams.push(new Team(0)),this.teams.push(new Team(1)),this.teams.push(new Team(2)),this.teams.push(new Team(3)),this.init()}function spawnCow(a,b,c){var d={x:a,y:b,type:CharacterType.Cow,team:myteam,color:myteamcolor},e=characters.spawn(d);game.getTeam(myteam).characters[d.type].push(e),c.characters.push({x:d.x/stage_width,y:d.y/stage_height,type:CharacterType.Cow})}function Team(a){this.team=a,this.path=new Path(a),this.color=0==a?Red:1==a?Blue:2==a?Teal:3==a?Purple:Red,this.startlocation=0==a?StartLocation.NW:1==a?StartLocation.NE:2==a?StartLocation.SW:3==a?StartLocation.SE:StartLocation.NW,this.startlocation_pos=getstartlocation(this.startlocation),this.sync_count=0,this.sync_time=50,this.init()}Game.prototype={init:function(){this.collision_count=0,this.collision_time=1,this.updateOpponent_count=0,this.updateOpponent_time=0,this.minimap=new MiniMap},checkcollisions:function(){if(this.collision_count++,!(this.collision_count<this.collision_time)){this.collision_count=0,this.resetcollisioncounts();for(var a=0;a<this.teams.length;a++)for(var b=0;b<this.teams[a].characters.length;b++)for(var c=0;c<this.teams[a].characters[b].length;c++){var d=this.teams[a].characters[b][c];(d.sprite.visible||a==myteam)&&(d.collision_count>=4||this.checkcollision(d))}}},checkcollision:function(a){for(var b=0;b<this.teams.length;b++)for(var c=0;c<this.teams[b].characters.length;c++)for(var d=0;d<this.teams[b].characters[c].length;d++){var e=this.teams[b].characters[c][d];(e.sprite.visible||b==myteam)&&(e.collision_count>=4||a.collide(e))}},resetcollisioncounts:function(){for(var a=0;a<this.teams.length;a++)for(var b=0;b<this.teams[a].characters.length;b++)for(var c=0;c<this.teams[a].characters[b].length;c++)this.teams[a].characters[b][c].collision_count=0},updateOpponent:function(){if(this.updateOpponent_count++,!(this.updateOpponent_count<this.updateOpponent_time)){this.updateOpponent_count=0;for(var a=this.find_closest_opponent.bind(this),b=0;b<this.teams.length;b++)for(var c=0;c<this.teams[b].characters.length;c++)for(var d=0;d<this.teams[b].characters[c].length;d++){var e=this.teams[b].characters[c][d];a(e)}}},find_closest_opponent:function(a){(void 0==a.opponent_dist||null==a.opponent)&&(a.opponent_dist=dim/2);for(var b=dim/2,c=0;c<this.teams.length;c++)if(a.team!=c)for(var d=0;d<this.teams[c].characters.length;d++)for(var e=0;e<this.teams[c].characters[d].length;e++){var f=this.teams[c].characters[d][e];new_dist=findDist(a.pos,f.pos),new_dist<b&&new_dist<a.opponent_dist&&(a.opponent=f,a.opponent_dist=new_dist)}},update:function(){this.checkcollisions(),this.updateOpponent(),this.teams.forEach(function(a){a.update()}),this.minimap.update()},getTeam:function(a){return this.teams[a]},startsingle:function(){gamestate=GameState.InPlay,stage.x=0,stage.y=0,myteam=0,myteamcolor=this.getTeam(myteam.color),this.teams.forEach(function(a){a.startsingle()}),center=this.getTeam(myteam).characters[CharacterType.Cow][0].pos.clone()},startgame:function(){switch(startlocation){case StartLocation.NW:stage.x=0,stage.y=0;break;case StartLocation.NE:stage.x=-stage_width+width,stage.y=0;break;case StartLocation.SW:stage.x=0,stage.y=-stage_height+height;break;case StartLocation.SE:stage.x=-stage_width+width,stage.y=-stage_height+height}for(var a={team:myteam,color:myteamcolor,characters:[]},b=0;5>b;b++)for(var c=0;5>c;c++)spawnCow(-stage.x+width/2+width/20*c,-stage.y+height/2+width/20*b,a);communication.socket.emit("spawn",a),center=this.getTeam(myteam).characters[CharacterType.Cow][0].pos}},Team.prototype={init:function(){this.characters=characters.pool.initList()},clean:function(){},startsingle:function(){for(var a=0;1>a;a++)for(var b=0;1>b;b++){var c={x:this.startlocation_pos.x+width/2+width/20*b,y:this.startlocation_pos.y+height/2+width/20*a,type:CharacterType.Cow,team:this.team,color:this.color},d=characters.spawn(c);this.characters[c.type].push(d)}},update:function(){this.sendSyncCharacter();for(var a=0;a<this.characters.length;a++)if(void 0!=this.characters[a])for(var b=this.characters[a].length-1;b>=0;b--){var c=this.characters[a][b];if(c.update(this.path),c.isDead()){characters.clean(c);var d=this.characters[c.type].indexOf(c);if(d>-1){this.characters[c.type][d];this.characters[c.type].splice(d,1)}}}},sendSyncCharacter:function(){if(gamemode==GameMode.MultiPlayer&&this.team==myteam&&(this.sync_count++,!(this.sync_count<this.sync_time))){this.sync_count=0,this.sync_count=0;for(var a=[],b=0;b<this.characters.length;b++)if(void 0!=this.characters[b]){a[b]=[];for(var c=0;c<this.characters[b].length;c++){var d=this.characters[b][c];a[b].push({x:d.pos.x/stage_width,y:d.pos.y/stage_height,vx:d.vel.x/stage_width,vy:d.vel.y/stage_height,type:d.type})}}communication.socket.emit("sync character",a),this.sendSyncPath()}},sendSyncPath:function(){}};var getstartlocation=function(a){switch(loc=new PVector(0,0),a){case StartLocation.NW:loc.x=0,loc.y=0;break;case StartLocation.NE:loc.x=stage_width-width,loc.y=0;break;case StartLocation.SW:loc.x=0,loc.y=stage_height-height;break;case StartLocation.SE:loc.x=stage_width-width,loc.y=stage_height-height}return loc};