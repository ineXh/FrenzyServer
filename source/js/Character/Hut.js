Hut.prototype = Object.create(Character.prototype);
Hut.prototype.constructor = Character;

function Hut(){
    this.create();
}
Hut.prototype.create = function(){
    this.pos = new PVector(0,0);
    this.vel = new PVector(0,0);
    this.accel = new PVector(0,0);
    this.sprite = new PIXI.Sprite(hut_texture);

    this.r = big_dim*0.1;
    this.scale = this.r / this.sprite.width;
    this.sprite.scale.set(this.scale);
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;
    this.maxspeed = 2*big_dim/1000;
    this.type = CharacterType.Hut;
    this.seekOpponent_count = 0;
    this.seekOpponent_time = 0;
    this.attack_count = 0;
    this.attack_time = 10;
    this.attacking = false;
    this.Dead = false;
    this.border = true;
    this.maxhp = 25;
    this.hp = this.maxhp;
    this.healthbar = new HealthBar(this);
    this.status = [StatusType.NotMovable];

    this.rect_container = new PIXI.Container();
    this.rect_sprite = new PIXI.Sprite(rect_texture);
    //this.rect_sprite.scale.set(big_dim*0.1 / this.rect_sprite.width);
    this.rect_sprite.anchor.x = 0.0;
    this.rect_sprite.anchor.y = 0.0;
    this.rect_sprite.position.x = 0;
    this.rect_sprite.position.y = 0;
    this.rect_scale = 0;
    this.rect_container.addChild(this.rect_sprite);


}
Hut.prototype.init = function(input){
    //console.log(input)
    if(input.id != undefined) this.id = input.id;
    this.team = input.team;
    if(input.color != undefined) this.sprite.tint = input.color;
    this.pos.x = input.x;
    this.pos.y = input.y;

    stage.addChild(this.sprite);
    stage.addChild(this.healthbar.bar);
    this.pos.z = this.sprite.height*4;
    this.dropped = false;

    this.menu_popped = false;
    this.sprite.interactive = true;
    this.sprite.mousedown = this.touchstart.bind(this);
    this.sprite.touchstart = this.touchstart.bind(this);
    this.sprite.mouseup = this.touchend.bind(this);
    this.sprite.touchend = this.touchend.bind(this);


} // gotoAndPlay // currentFramenumber
Hut.prototype.dropping = function(){
    if(this.dropped) return;
    this.accel.add(new PVector(0, 0, -this.sprite.height/20));
    this.z_scale = 1 + this.pos.z/this.sprite.height;
    this.sprite.scale.set(this.scale*this.z_scale);

    this.vel = this.accel;
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.accel.mult(0);
    if(this.pos.z <= 0){
        this.pos.z = 0;
        this.dropped = true;
    }

    this.sprite.position.x = this.pos.x;
    //this.sprite.position.y = this.pos.y;
    this.sprite.position.y = this.pos.y - this.pos.z;
} // end Hut dropping
Hut.prototype.popping = function(){
    if(this.menu_popped) return;
    this.rect_scale += 0.01;
    this.rect_container.scale.set(this.rect_scale);
    if(this.rect_scale >= 1.0) this.menu_popped = true;
} // end Hut popping
Hut.prototype.pop = function(){
    this.menu_popped = false;
    stage.addChild(this.rect_container);
    this.rect_container.x = this.pos.x - this.sprite.width *3 / 4;
    this.rect_container.y = this.pos.y - this.sprite.height;
    this.rect_scale = 0;
    this.rect_container.scale.set(this.rect_scale);
} // end Hut pop
Hut.prototype.clean = function(){
    //this.sprite.stop();
    stage.removeChild(this.sprite);
    stage.removeChild(this.healthbar.bar);
}

Hut.prototype.update = function(path){
    this.dropping();
    this.popping();
    this.healthbar.update();
    if(this.hp <= 0) this.Dead = true;
}
Hut.prototype.touchstart = function(e){
    if(!this.dropped) return;
    spritetouched = true;
    this.pop();
    //console.log('touchstart')
    //console.log(event)
}
Hut.prototype.touchend = function(e){
    //console.log('touchend');
}
