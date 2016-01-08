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
  set_path: function(){
  	game.getTeam(this.team).path.startPath(MousePos.stage_x, MousePos.stage_y);
  }
}