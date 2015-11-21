Hut.prototype = Object.create(Character.prototype);
Hut.prototype.constructor = Character;

function Hut(){
    this.create();
}
Hut.prototype.create = function(){

    this.pos = new PVector(0,0);
    this.vel = new PVector(0,0);
    this.accel = new PVector(0,0);
    this.sprite = new PIXI.Sprite(Hut_texture);


    this.r = big_dim*0.05;
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
    this.maxhp = 5;
    this.hp = this.maxhp;
    this.healthbar = new HealthBar(this);

}
Hut.prototype.init = function(input){
    //console.log(input)
    if(input.id != undefined) this.id = input.id;
    this.team = input.team;
    this.sprite.tint = input.color;
    this.pos.x = input.x;
    this.pos.y = input.y;
    stage.addChild(this.sprite);
    stage.addChild(this.healthbar.bar);
} // gotoAndPlay // currentFramenumber

Hut.prototype.clean = function(){
    //this.sprite.stop();
    stage.removeChild(this.sprite);
    stage.removeChild(this.healthbar.bar);
}

Hut.prototype.update = function(path){
    this.sprite.position.x = this.pos.x;
    this.sprite.position.y = this.pos.y;
    this.healthbar.update();
    if(this.hp <= 0) this.Dead = true;
}
