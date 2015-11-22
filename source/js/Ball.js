function Ball(x, y, r, draw, texture){
  this.init(x,y, r);
  if(draw == undefined || draw == true){
    if(texture == undefined){
      this.toDraw = true;
      this.draw();
    }else{
      this.toDrawSprite = true;
      this.drawSprite(texture);
    }
  }
}
Ball.prototype = {

  init: function(x, y, r){

    this.clr = getRndColor();
    this.pos = new PVector(x,y);//{x : 500 - + Math.floor((Math.random() * 4) + 1)*25, y: 425 + Math.floor((Math.random() * 4) + 1)*25};
    this.vel = new PVector(Math.random()*width/10,Math.random()*height/10);//{x : 0, y: 1};
    this.accel = new PVector(1,0);//{x : 1, y: 0};
    this.r = r;//width/80;
    this.width = this.r*2;
    this.height = this.r*2;
    this.maxspeed = width/100;
    this.border = true;

  //  if(this.toDraw == undefined) this.toDraw = true;
    //if(this.toDraw) this.draw();
  },
  drawSprite: function(texture){
    this.sprite = new PIXI.Sprite(texture);
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;
    this.scale =  (this.r) /
                  ((this.sprite.width < this.sprite.height) ? this.sprite.width : this.sprite.height);
    this.sprite.scale.set(this.scale);
    stage.addChild(this.sprite);
  }, // end drawSprite
  draw: function(){
    this.graphics = new PIXI.Graphics();
    this.graphics.x = this.pos.x;
    this.graphics.y = this.pos.x;
    this.graphics.beginFill(this.clr);
    this.graphics.drawCircle(0, 0, this.r);
    this.graphics.endFill();
    stage.addChild(this.graphics);
  },
  setCollision: function(others){
    this.others = others;
  },
  addCollisionObjects: function(o){
    this.others.push(o);
  }, // end addCollisionObjects
  collide: function(o){
    if(o == this) return false;
    if(isIntersecting(this.sprite, o.sprite)){
      var dx = o.pos.x - this.pos.x;
      var dy = o.pos.y - this.pos.y;
      var minDist = o.r + this.r;
      var angle = Math.atan2(dy,dx);
      var targetX = o.pos.x + Math.cos(angle)*minDist;
      var targetY = o.pos.y + Math.sin(angle)*minDist;
      var ax = (targetX - o.pos.x)*spring;
      var ay = (targetY - o.pos.y)*spring;
      this.vel.x -= ax;
      this.vel.y -= ay;
      //if(!arrayContains(o.status, StatusType.NotMovable)){
        o.vel.x += ax;
        o.vel.y -= ax;  
      //}       
      this.collision_count++;
      o.collision_count++;
      return true;
    }
    return false;
    /*float dx = b.pos.x - pos.x;
      float dy = b.pos.y - pos.y;
      float distance = sqrt(dx*dx + dy*dy);
      float minDist = b.r + r;
      if (distance < minDist) {
        float angle = atan2(dy, dx);
        float targetX = b.pos.x + cos(angle) * minDist;
        float targetY = b.pos.y + sin(angle) * minDist;
        float ax = (targetX - b.pos.x) * spring;
        float ay = (targetY - b.pos.y) * spring;
        vel.x -= ax;
        vel.y -= ay;
        b.vel.x += ax;
        b.vel.y += ay;
      }*/
  },
  update: function(time){
    this.move(time);
    if(this.toDraw) this.render();
    if(this.toDrawSprite) this.renderSprite();
  },
  move: function(time){
    this.vel.add(this.accel);
    this.vel.mult(damping);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.accel.mult(0);
    if(this.border)   this.stayinBorder();
  },
  render: function(){
    this.graphics.x = this.pos.x;
    this.graphics.y = this.pos.y;
  },
  renderSprite: function(){
    this.sprite.x = this.pos.x;
    this.sprite.y = this.pos.y;
    this.sprite.rotation += 0.01;
  },
  stayinBorder : function(){
    if (this.pos.x - this.r < 0) {
      this.pos.x = this.r;
      this.vel.x = this.vel.x*walldamp;
      return true;
    }
    if (this.pos.x + this.r > stage_width) {
      //println(this.vel);
      this.vel.x = this.vel.x*walldamp;
      this.pos.x = stage_width - this.r;
      return true;
    }
    if (this.pos.y -this. r < 0) {
      this.vel.y = this.vel.y*walldamp;
      this.pos.y = this.r;
      return true;
    }
    if (this.pos.y + this.r > stage_height) {
      this.vel.y = this.vel.y*walldamp;
      this.pos.y = stage_height - this.r;
      return true;
    }
    return false;
  }, // end stayinBorder


}
