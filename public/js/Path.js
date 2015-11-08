
function Path(){
  this.points = [];
  this.line_pool = [];
  this.radius = 5;
  this.outer_radius = dim / 20;
  //this.gap = 50;
  this.maxline = 1;
  this.num_lines = 0;
  this.path_started = false;

  this.init();

}
Path.prototype = {
  init: function(){
    this.debug = true;
    //path_container = new PIXI.Container();
    //stage0.addChild(path_container);
    this.path = new PIXI.Container();
    stage.addChild(this.path);
    for(var i = 0; i < this.maxline; i++){
      this.line_pool.push(this.createArrow());
    }

  }, // end init
  createArrow: function(){
    var line = new PIXI.Container();
    line.pivot.x = 0;
    line.pivot.y = 0;

    arrow_line = new PIXI.Sprite(arrow_line_texture);
    arrow_line.anchor.x = 0.0;
    arrow_line.anchor.y = 0.5;

    this.scale =  width/20 / arrow_line.width;
    arrow_line.scale.set(this.scale);
    arrow_line.width = 0;
    arrow_line.x = 0;
    arrow_line.y = 0;
    arrow_line.tint = 0xAA33BB;
    arrow_line.alpha = 0.2;
    line.addChild(arrow_line);

    arrow_head = new PIXI.Sprite(arrow_head_texture);
    arrow_head.scale.set(this.scale);
    arrow_head.anchor.x = 0.5;
    arrow_head.anchor.y = 0.5;
    arrow_head.x = 0;
    arrow_head.y = 0;
    arrow_head.tint = arrow_line.tint;
    arrow_head.alpha = arrow_line.alpha;
    line.addChild(arrow_head);
    return line;
  },
  addPoint : function(x, y){
    var point = new PVector(x, y);
    this.points.push(point);
  },// end addPoint
  getStart : function() {
     return this.points[0];
  },
  getEnd : function(){
    if(this.points.length <= 0) return -1;
    return this.points[this.points.length-1];
  },
  getEndLine : function(){
    return this.path.children[this.path.children.length-1];
  },
  borrowline : function(){
    if(this.line_pool.length >= 1)  return this.line_pool.shift();
    else{
      this.returnfirstline();
      return this.line_pool.shift();
    }

  },
  returnfirstline : function(){
    this.points.splice(0,1);
    this.points.splice(0,1);
    this.line_pool.push(this.path.children.shift());
    this.num_lines--;
  },
  startPath:function(x,y){
    //console.log('startpath')
    this.path_started = true;
    this.addPoint(x,y);
    var line = this.borrowline();
        line.x = x;
        line.y = y;
        line.children[0].width = 0;
    /*this.lastline = new PIXI.Graphics();
    this.lastline.lineStyle(30, 0xAA, 0.8);
    this.lastline.moveTo(x, y);*/
    //this.lastline.lineTo(x+50, y+50);
    //this.lastline.lineTo(x, y+100);
    this.path.addChild(line);

  }, // end startPath
  updatePath : function(x,y){
    if(!this.path_started) return;
    p0 = this.getEnd();
    // line
    this.getEndLine().children[0].width = findDist(p0, new PVector(x,y));
    // arrow head
    this.getEndLine().children[1].x = this.getEndLine().children[0].width;
    this.getEndLine().rotation = Math.atan2(y-p0.y, x-p0.x);
  },
  endPath : function(x,y){
    this.addPoint(x,y);
    this.num_lines++;
    this.path_started = false;
  },
  drawPath : function(){
      //console.log('drawPath')
    for (var i = 0; i < this.points.length - 1; i++) {
      var line0 = new PIXI.Graphics();
      line0.lineStyle(30, 0xAA, 0.8);
      var p0 = this.points[i];
      var p1 = this.points[i+1];
      var dist = findDist(p0, p1);
      var line = new PIXI.Container();
      var num_dots = Math.floor(dist / this.gap);
      //console.log('num_dots ' + num_dots)
      for(var j = 0; j < num_dots; j++){
        dot = new PIXI.Sprite(arrow_dot_texture);
        dot.anchor.x = 0.5;
        dot.anchor.y = 0.5;
        this.scale =  (this.gap)*3 / dot.width;
        dot.scale.set(this.scale);
        dot.x = (p1.x - p0.x) * j / (num_dots + 1) + p0.x;
        dot.y = (p1.y - p0.y) * j/ (num_dots + 1) + p0.y;
        dot.tint = 0xFFFF00;
        line.addChild(dot);
      }

      line0.moveTo(p0.x, p0.y);
      line0.lineTo(p1.x, p1.y);
      this.path.addChild(line0);
      this.path.addChild(line);
    };
    path_container.addChild(this.path);
  },
  follow : function(character){
    var followforce = new PVector(0,0);
    for(var i = 0; i < this.num_lines; i++){
      var p0 = this.points[i*2];
      var p1 = this.points[i*2+1];
      var normal = getNormalPoint(character.pos, p0, p1);
      if(isBetween(normal, p0, p1) && withinDist(normal, character.pos, this.outer_radius)){
        var vel_line = PVector.sub(p1, p0);
        vel_line.normalize();
        var tempfollowforce = vel_line;
        followforce.add(tempfollowforce);
      }
    }
    followforce.normalize();
    followforce.mult(character.maxspeed);
    return followforce;
    /*//console.log('follow')
    //if(team != p.team && p.team != Team.Neutral) return (new PVector(0,0));
    //if(!p.exist) return (new PVector(0,0));

    // Predict location 50 (arbitrary choice) frames ahead
    var predict = character.vel.clone();
    predict.normalize();
    predict.mult(50);
    var predictLoc = PVector.add(character.pos, predict);

    // Look at the line segment
    //PVector a = p.start;
    //PVector b = p.end;

    var followforce = new PVector(0,0);
    for (var i = 0; i < this.points.length - 1; i++) {
      var p0 = this.points[i];
      var p1 = this.points[i+1];
      var tempfollowforce = this.calculatefollowforce(p0, p1, predictLoc, character);
      //println("i: " + i);
      //println("a: " + a);
      //println("b: " + b);
      //console.log(tempfollowforce);
      followforce.add(tempfollowforce);
    }
    return followforce;*/
  },
  calculatefollowforce : function(a, b, predictLoc, character){
    //console.log("a: " + a);
    //console.log("b: " + b);
    // Get the normal point to that line
    var normalPoint = getNormalPoint(predictLoc, a, b);
    //console.log(normalPoint)
    // Find target point a little further ahead of normal
    var dir = PVector.sub(b, a);
    dir.normalize();
    dir.mult(50);  // This could be based on velocity instead of just an arbitrary 10 pixels
    //console.log(dir)
    var target = PVector.add(normalPoint, dir);
    //console.log(target)
    //console.log("isbetween: " + isBetween(target, b, a));
    if(!isBetween(target, b, a)) return (new PVector(0,0));
    // How far away are we from the path?
    var distance = PVector.dist(predictLoc, normalPoint);
    // Only if the distance is greater than the path's radius do we bother to steer
    //console.log("follow distance: " + distance);
    //console.log("this.radius: " + this.radius);
    if (distance > this.radius && distance < this.outer_radius) {
      //console.log('within path bound')
      //if(millis() - FollowTime < 100) return (new PVector(0,0));
      //println("after follow time");
      //FollowTime = millis();
      var followforce = seek(character, target);
      followforce.mult(1);
      //console.log(followforce)
      //applyForce(followforce);
      //println("followforce: " + followforce);
      return followforce;
    }else if(distance <= this.radius){
      //FollowTime = millis();
        var followforce = (b.clone());//seek(target);
        followforce.sub(a);
        followforce.limit(1);
        //followforce.mult(followforce_Scale*1);
        //println("followforce: " + followforce);
        //if(followforce.x <= 0) println("followforce: " + followforce);
        return followforce;
    }

    // Draw the debugging stuff
    var debug = true;//false;//true;//false;
    /*if (debug) {
      fill(0);
      stroke(0);
      line(pos.x, pos.y, predictLoc.x, predictLoc.y);
      ellipse(predictLoc.x, predictLoc.y, 4, 4);

      // Draw normal location
      fill(0);
      stroke(0);
      line(predictLoc.x, predictLoc.y, normalPoint.x, normalPoint.y);
      ellipse(normalPoint.x, normalPoint.y, 4, 4);
      stroke(0);
      if (distance > p.radius) fill(255, 0, 0);
      //noStroke();
      ellipse(target.x+dir.x, target.y+dir.y, 8, 8);
    }*/
    return new PVector(0,0);
  } // end calculatefollowforce
} // end Path

function seek(character, target) {
    //console.log(target)
    var desired = PVector.sub(target, character.pos);  // A vector pointing from the location to the target
    // Normalize desired and scale to maximum speed
    desired.normalize();
    desired.mult(character.maxspeed);
    // Steering = Desired minus velocity
    var steer = PVector.sub(desired, character.vel);
    steer.limit(character.maxforce);  // Limit to maximum steering force
    //console.log(steer)
    return steer;
  } // end seek
