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
Hut.prototype.clean = function(){
    //this.sprite.stop();
    stage.removeChild(this.sprite);
    stage.removeChild(this.healthbar.bar);
}

Hut.prototype.update = function(path){    
    this.dropping();
    this.healthbar.update();
    if(this.hp <= 0) this.Dead = true;
}
