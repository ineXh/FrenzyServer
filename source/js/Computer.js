function Computer(team){
	this.team = team;
	this.active = false;
	this.update_time = 300;
	this.update_count = 0;
}
Computer.prototype = {
  init: function(){
  	this.active = true;
  	this.path_center = false;
  },
  update: function(){
    if(!this.active) return;
  	this.update_count++;
    if(this.update_count%this.update_time != 0) return;
    this.update_count = 0;
    this.path_logic();
    this.upgrade_logic();
  },
  path_logic: function(){
    // Clear Path to Center if less than half units
    if(game.getTeam(this.team).characters[CharacterType.Cow].length < max_unit_count/2){
      this.set_path(PathType.Clear);
      this.path_center = false;
      return;
    }
    if(this.path_center) return;
    this.set_path(PathType.Center);
  },
  set_path: function(path_type){
  	var team = game.getTeam(this.team);
    switch(path_type){
  		case PathType.Center:
        var dir = new PVector(stage_width/2  - team.startlocation_pos.x,
                              stage_height/2 - team.startlocation_pos.y);
        var mag = dir.mag();
        dir.normalize();
        var x1,y1,x2,y2;
        x1 = team.startlocation_pos.x - dir.x*mag*0.2;
        y1 = team.startlocation_pos.y - dir.y*mag*0.2;
        x2 = team.startlocation_pos.x + dir.x*mag*0.8;
        y2 = team.startlocation_pos.y + dir.y*mag*0.8;
        // Center Path
  			team.path.startPath(x1, y1);
  			team.path.endPath(x2, y2);
        // Parallel offsets
        var offset = dim/10;
        team.path.startPath(x1 + offset *(y2-y1) / mag, y1 + offset*(x1-x2) / mag);
        team.path.endPath(x2 + offset *(y2-y1) / mag, y2 + offset*(x1-x2) / mag);
        offset = -dim/10;
        team.path.startPath(x1 + offset *(y2-y1) / mag, y1 + offset*(x1-x2) / mag);
        team.path.endPath(x2 + offset *(y2-y1) / mag, y2 + offset*(x1-x2) / mag);

  			this.path_center = true;
  			break;
      case PathType.Clear:
        team.path.clear();
        break;
  	}
  }, // end set_path
  upgrade_logic: function(){
    var team = game.getTeam(this.team);
    var cost1 = team.upgrade_cost(UpgradeType.Attack);
    var cost2 = team.upgrade_cost(UpgradeType.Defense);
    var cost3 = team.upgrade_cost(UpgradeType.Speed);
  }, // end upgrade_logic
} // end Computer
