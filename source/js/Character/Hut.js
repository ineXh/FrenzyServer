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
    this.rect_sprite.scale.set(width*0.2 / this.rect_sprite.width);
    this.rect_sprite.anchor.x = 0.5;
    this.rect_sprite.anchor.y = 0.5;
    this.rect_sprite.position.x = 0;
    this.rect_sprite.position.y = 0;
    this.rect_scale = 0;
    this.rect_container.addChild(this.rect_sprite);

    this.attack_sprite = new PIXI.Sprite(attack_upgrade_texture);
    this.attack_sprite.scale.set(this.rect_sprite.width /4 / this.attack_sprite.width);
    this.attack_sprite.anchor.x = 0.5;
    this.attack_sprite.anchor.y = 0.5;
    this.attack_sprite.position.x = -this.attack_sprite.width*1.3;
    this.attack_sprite.position.y = 0;
    this.rect_container.addChild(this.attack_sprite);

    this.defense_sprite = new PIXI.Sprite(defense_upgrade_texture);
    this.defense_sprite.scale.set(this.rect_sprite.width /4 / this.defense_sprite.width);
    this.defense_sprite.anchor.x = 0.5;
    this.defense_sprite.anchor.y = 0.5;

    this.rect_container.addChild(this.defense_sprite);

    this.speed_sprite = new PIXI.Sprite(speed_upgrade_texture);
    this.speed_sprite.scale.set(this.rect_sprite.width /4 / this.speed_sprite.width);
    this.speed_sprite.anchor.x = 0.5;
    this.speed_sprite.anchor.y = 0.5;
    this.speed_sprite.position.x = this.speed_sprite.width*1.3;
    this.rect_container.addChild(this.speed_sprite);

    this.progress = new PIXI.Graphics();
    //this.progress.lineStyle(width/200, 0x00, 1);
    this.progress_angle = 0;
    this.progressed = true;
    /*this.progress.beginFill(0xFF0000, 0.5);
    //this.progress.arc(0,0, this.attack_sprite.width/2, 0, PI, false);
    this.progress.moveTo(100, 100)
    this.progress.arcTo(100,50,150,50,25)
    this.progress.endFill();*/
    //this.progress.drawRect(0, 0, stage_width, stage_height);
    this.rect_container.addChild(this.progress);

}
Hut.prototype.init = function(input){
    //console.log(input)
    if(input.id != undefined) this.id = input.id;
    this.team = input.team;
    if(input.color != undefined) this.sprite.tint = input.color;
    this.pos.x = input.x;
    this.pos.y = input.y;

    stage.addChild(this.sprite);

    this.pos.z = this.sprite.height*4;
    this.dropped = false;

    this.menu_popped = false;
    this.menu_pop = false;
    this.menu_unpop = false;
    if(this.team == myteam){
        this.sprite.interactive = true;
        this.sprite.mousedown = this.touchstart.bind(this);
        this.sprite.touchstart = this.touchstart.bind(this);
        this.sprite.mouseup = this.touchend.bind(this);
        this.sprite.touchend = this.touchend.bind(this);

        this.attack_sprite.interactive = true;
        this.attack_sprite.mousedown = this.attack_touchstart.bind(this);
        this.attack_sprite.touchstart = this.attack_touchstart.bind(this);
        //this.attack_sprite.mouseup = this.attack_touchend.bind(this);
        //this.attack_sprite.touchend = this.attack_touchend.bind(this);
    }


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
        stage.addChild(this.healthbar.bar);
    }

    this.sprite.position.x = this.pos.x;
    //this.sprite.position.y = this.pos.y;
    this.sprite.position.y = this.pos.y - this.pos.z;
} // end Hut dropping
Hut.prototype.popping = function(){
    if(this.menu_popped) return;
    this.rect_scale += 0.1;
    this.rect_container.scale.set(this.rect_scale);
    if(this.rect_scale >= 1.0 && this.menu_pop){
        this.menu_pop = false;
        this.menu_popped = true;
        spritetouched_cancel_cb = this.unpop.bind(this);

    }
} // end Hut popping
Hut.prototype.pop = function(){
    this.menu_popped = false;
    this.menu_pop = true;
    stage.addChild(this.rect_container);
    this.rect_container.x = this.pos.x - this.sprite.width *0 / 4;
    this.rect_container.y = this.pos.y - this.sprite.height;
    this.rect_scale = 0;
    this.rect_container.scale.set(this.rect_scale);
} // end Hut pop
Hut.prototype.unpopping = function(){
    if(!this.menu_unpop) return;
    this.rect_scale -= 0.1;
    this.rect_container.scale.set(this.rect_scale);
    if(this.rect_scale <= 0){
        this.menu_unpop = false;
        this.menu_popped = false;
        stage.removeChild(this.rect_container);
    }
} // end Hut unpopping
Hut.prototype.unpop = function(){
    this.menu_unpop = true;
}
Hut.prototype.spread = function(){
    //console.log('spread')
    this.rect_container.addChild(this.attack_sprite);
} // end Hut Spread
Hut.prototype.clean = function(){
    //this.sprite.stop();
    stage.removeChild(this.sprite);
    stage.removeChild(this.healthbar.bar);
    stage.removeChild(this.rect_container);
}

Hut.prototype.update = function(path){
    this.dropping();
    this.popping();
    this.unpopping();
    this.progressing();
    this.healthbar.update();
    if(this.hp <= 0) this.Dead = true;
}
Hut.prototype.touchstart = function(e){
    if(!this.dropped) return;
    if(this.menu_popped) return;
    spritetouched = true;
    this.pop();
    //console.log('touchstart')
    //console.log(event)
}
Hut.prototype.touchend = function(e){
    //console.log('touchend');
}
Hut.prototype.progressing = function(){
    if(this.progressed) return;
    //console.log('this.progress_angle ' + this.progress_angle)
    this.progress.clear();
    //this.progress.lineStyle(width/2000, 0x00, 1);
    this.progress.beginFill(0xFF0000, 0.5);

    this.progress_angle+=0.2;


    /*this.progress.moveTo(0, 0)
    var x = Math.cos(-PI/2 + this.progress_angle)*this.progress_r;
    var y = Math.sin(-PI/2 + this.progress_angle)*this.progress_r;
    this.progress.arcTo(0,-this.progress_r, x, y, this.progress_r)*/
    this.progress.moveTo(0, 0);
    this.progress.lineTo(0, -this.progress_r);
    this.progress.arc(0,0, this.progress_r, -PI/2, this.progress_angle, false);
    this.progress.endFill();


    //this.progress.lineStyle(this.attack_sprite.width/20, 0x00, 1);
    /*this.progress.beginFill(0x000000, 0.5);
    this.progress_angle += PI/200;



    this.progress.arc(0,0, this.attack_sprite.width/2, 0, 6, false);
    this.progress.endFill();*/
} // end Hut progressing


Hut.prototype.attack_touchstart = function(e){
    console.log('attack_touchstart')
    //this.progress.drawRect(0, 0, stage_width, stage_height);
    this.progress_angle = -PI/2;
    this.progress_r = this.attack_sprite.width/2;
    this.progress.x = this.attack_sprite.x;
    this.progress.y = this.attack_sprite.y;

    //this.rect_container.addChild(this.progress);
    this.progressed = false;
}
