function Computer(team){
	this.team = team;
	this.active = false;
	this.update_time = 300;
	this.update_count = 0;
	this.init();
}
Computer.prototype = {
  init: function(){
  	this.active = true;
  	this.path_center = false;
  },
  update: function(){
  	this.update_count++;
    if(this.update_count%this.update_time != 0) return;
    this.update_count = 0;
  },
  set_path: function(path_type){
  	switch(path_type){
  		case PathType.Center:
  			var team = game.getTeam(this.team);
  			team.path.startPath(team.startlocation_pos.x, team.startlocation_pos.y);
  			team.path.endPath(stage_width/2, stage_height/2);
  			this.path_center = true;
  			break;	
  	}
  	
  }
}