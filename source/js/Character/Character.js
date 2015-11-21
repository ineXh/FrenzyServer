function Characters(){
    this.pool = new CharacterPool();
    this.init();
}
Characters.prototype = {
	init: function(){
		this.characters = this.pool.initList();
	},
	getLength: function(){
		return this.characters.length;
	},
	update: function(){
		for (var i = 0; i < this.characters.length; i++) {
			if(this.characters[i] == undefined) continue;
			for(var j = this.characters[i].length - 1; j >= 0; j--) {
				var c = this.characters[i][j];
				c.update();
				if(c.isDead()){
					this.clean(c);
					var index = this.characters[c.type].indexOf(i);
					if(index > -1){
						var val = this.characters[c.type][index];
						this.characters[c.type].splice(index,1);
					}
					this.characters.splice(i,1);
				}
			}
		}
	}, // end update
	spawn: function(input){
		var character = this.pool.borrowCharacter(input.type);
		if(character != null){
			character.init(input);
			return character;
			//this.characters[input.type].push(character);
		}
  	},
  	clean_all : function(){
  		for (var i = this.characters.length - 1; i >= 0; i--) {
			var c = this.characters[i];
			this.clean(c);
			var index = this.getCharacterlist(c.type).indexOf(i);
				if(index > -1){
					var val = this.getCharacterlist(c.type)[index];
					this.getCharacterlist(c.type).splice(index,1);
					this.decrementCharacterlists(val);
				}
				this.characters.splice(i,1);
			}
  	},
  	clean: function(character){
  		//console.log("clean" + character);
  		character.clean();
  		//this.character_length[character.type]--;
  		this.pool.returnCharacter(character.type, character);

  	},
	getCharacterlist: function(characterType){
		return this.characterlist[characterType];
	}
}; /// end Characters
function Character(){
	this.SteerClosestTarget = 1;
	this.SteerTargets = [];
	this.searchClosestTime = 0;
  	this.searchClosestTotalTime = 2000;
  	this.closestTarget_idx = -1;
	this.accel = new PVector(0,0);
	this.vel = new PVector(0,0);
	this.pos = new PVector(0,0);
	this.maxspeed = big_dim/200;
	this.Dead = false;
}
Character.prototype = Object.create(Ball.prototype);
Character.prototype.constructor = Ball;
Character.prototype.applyBehaviors = function(time){
	var steerforce = this.steer(time);
	//console.log(steerforce);
	this.applyForce(steerforce);
	/*if(this.SteerTargets.length < 1){
		this.vel.x = 0;
		this.vel.y = 0;
	}*/
}; // end Character applyBehaviors
// Other contains target, weight, within_dist
Character.prototype.addTarget = function(targets, other){
	for(var i = 0; i < targets.length; i++){
		if(targets[i] == other){
			return;
		}
	}
	/*targets.forEach(function(t){
		if(t.target == other.target) return;
	})*/
	targets.push(other);
}; // end addSteerTarget
Character.prototype.removeTarget = function(targets, other){
	for(var i = 0; i < targets.length; i++){
		if(targets[i] == other){
			targets.splice(i, 1);
			return;
		}
	}
}; // end removeSteerTarget
Character.prototype.findClosestTarget = function(targets, pos){
	if(this.targets == null) return -1;
	this.minDist_idx = -1;
	minDist = big_dim;
	for(var i = 0; i < targets.length; i++){
		//console.log(targets[i]);
		if(targets[i].target != undefined){
			var target = targets[i].target;
		}else{
			var target = targets[i];
		}
		var dist = findDist(pos, target);
		if(dist < minDist){
			if(target.steer_distance != undefined){
				if(dist < target.steer_distance){
					//console.log("in steer distance");
					minDist = dist;
					this.minDist_idx = i;
				}
			}else{
				minDist = dist;
				this.minDist_idx = i;
			}
		}
	}
	return this.minDist_idx;
}
Character.prototype.steer = function(time){
	if(this.SteerTargets == null) return (new PVector(0,0));
	if(this.SteerTargets.length < 1) return (new PVector(0,0));
	//console.log("steer")
	if((time.t - this.searchClosestTime) > this.searchClosestTotalTime){
		var target_pos = [];
		for(var i = this.SteerTargets.length -1; i >= 0; i--){
			var t = this.SteerTargets[i].target;
			if(t.isDead()){
				this.SteerTargets.splice(i,1);
			}else{
				target_pos.push(t.pos);
			}
		}

		this.closestTarget_idx = this.findClosestTarget(target_pos, this.pos);
		this.closestTarget_idx = this.SteerTargets.length - 1 - this.closestTarget_idx;
		this.searchClosestTime = time.t;
	}
	//console.log(this.pos)
	//console.log("closestTarget_idx: " + closestTarget_idx);
	var force =  new PVector(0,0);
	//console.log(this.width)
	if(this.closestTarget_idx != -1){
		if(this.SteerTargets[this.closestTarget_idx] != undefined){
			// if already too close, dont need to steer towards it
			if(withinDist(this.pos,
							this.SteerTargets[this.closestTarget_idx].target.pos,
							this.width + this.SteerTargets[this.closestTarget_idx].width)){
			return force;
			}
			// Steer towards target position
			force = this.seek(this.SteerTargets[this.closestTarget_idx].target.pos);
		}
	}
	return force;
}
Character.prototype.seek = function(target){
	var desired = PVector.sub(target, this.pos);

	desired.normalize();
	desired.mult(this.maxspeed/2);

	//var steer = PVector.sub(desired, this.vel);
	//steer.limit(this.maxforce);
	//console.log(steer)
	return desired;
}
Character.prototype.isDead = function(){
	return this.Dead;
}

Cow.prototype = Object.create(Character.prototype);
Cow.prototype.constructor = Character;

function Cow(){
	this.create();
}
Cow.prototype.create = function(){
	//this.id = cow_id++;
	this.animationtype = AnimationType.Walk_Front;
	this.front_walk_frame = 0;
	this.front_attack_frame = 8;
	this.back_walk_frame = 14;
	this.back_attack_frame = 22;

	this.pos = new PVector(0,0);
	this.vel = new PVector(0,0);
	this.accel = new PVector(0,0);
	//this.sprite = new PIXI.Sprite(cow_texture);
	this.sprite = new PIXI.extras.MovieClip(cow_front_frames);
	this.sprite.animationSpeed = 0.1;
	this.sprite.play();

	this.r = big_dim*0.05;
	this.scale = this.r / this.sprite.width;
	this.sprite.scale.set(this.scale);
	this.sprite.anchor.x = 0.5;
	this.sprite.anchor.y = 0.5;
	this.maxspeed = 2*big_dim/1000;
	this.type = CharacterType.Cow;
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
Cow.prototype.init = function(input){
	//console.log(input)
	if(input.id != undefined) this.id = input.id;
	this.team = input.team;
	this.sprite.tint = input.color;
	this.pos.x = input.x;
	this.pos.y = input.y;
	stage.addChild(this.sprite);
	stage.addChild(this.healthbar.bar);
} // gotoAndPlay // currentFramenumber
Cow.prototype.animationdisplay = function(){
	switch(this.animationtype){
		case AnimationType.Walk_Front:
		//console.log(this.sprite.currentFrame)
			if(this.sprite.currentFrame >= this.front_attack_frame-1)
				this.sprite.gotoAndPlay(this.front_walk_frame)
		break;
		case AnimationType.Attack_Front:
			if(this.sprite.currentFrame >= this.back_walk_frame-1){
				this.attacking = false;
				this.animationtype = AnimationType.Walk_Front;
				if(this.opponent != null){
					this.opponent.hp -= 1;
					this.opponent.healthbar.set(this.opponent.hp);
				}
			}
		//console.log(this.sprite.currentFrame)
			//if(this.sprite.currentFrame >= this.back_walk_frame-1)
			//this.sprite.gotoAndPlay(this.front_attack_frame)
		break;
	}
}
Cow.prototype.clean = function(){
	this.sprite.stop();
	stage.removeChild(this.sprite);
	stage.removeChild(this.healthbar.bar);
}
Cow.prototype.attack = function(){
	if(!this.attacking){
		if(this.animationtype != AnimationType.Attack_Front)
		this.sprite.gotoAndPlay(this.front_attack_frame);
		this.animationtype = AnimationType.Attack_Front;
		this.attacking = true;
	}
}
Cow.prototype.update = function(path){
	if(path != null && !this.attacking){
		applyForce.call(this, path.follow(this));
		if(this.accel.mag() > big_dim/10)
		this.animationtype = AnimationType.Walk_Front;
	}
	if(this.opponent != null && this.accel.mag() < big_dim/1000
		&& !this.attacking){
		this.seekOpponent_count++;
        if(this.seekOpponent_count < this.seekOpponent_time) return;
        this.seekOpponent_count = 0;
        this.opponent_dist = findDist(this.pos, this.opponent.pos);
		if(this.opponent_dist >= dim/2 || this.opponent.isDead()){
			this.opponent = null;
			this.opponent_dist == undefined
		}
		if(this.opponent_dist >= this.r*1.5){
			if(this.opponent != null)
			applyForce.call(this, this.seek(this.opponent.pos));
			this.animationtype = AnimationType.Walk_Front;
		}else{
			this.attack();
		}
	}
	//if(this.animationtype == AnimationType.Attack_Front){
	//}else{
	if(!this.attacking){
		this.vel = this.accel;
	    this.vel.limit(this.maxspeed);
	    this.pos.add(this.vel);
	    this.accel.mult(0);
	    if(this.border)   this.stayinBorder();
	}
	if(this.opponent!= null){
		if(this.opponent.pos.x > this.pos.x) this.sprite.scale.x = -Math.abs(this.sprite.scale.x);
		else this.sprite.scale.x = Math.abs(this.sprite.scale.x);
	}
	//if(this.vel.x < 0) this.sprite.scale.x = Math.abs(this.sprite.scale.x);
	//else this.sprite.scale.x = -Math.abs(this.sprite.scale.x);

	//this.move(time);
	this.sprite.position.x = this.pos.x;
	this.sprite.position.y = this.pos.y;
	this.healthbar.update();
	this.animationdisplay();
	if(this.hp <= 0) this.Dead = true;
}
function HealthBar(character){
	this.init(character);
}
HealthBar.prototype = {
	init: function(character){
		this.character = character;
		this.pos = this.character.pos;
		this.r = this.character.r;
		this.maxhp = this.character.maxhp;
	    this.hp = this.maxhp;
		this.bar = new PIXI.Container();
	    this.innerbar = new PIXI.Graphics;
	    this.innerbar.beginFill(0x000000);
		this.innerbar.drawRoundedRect (0, 0, this.r*0.6, this.r/12, this.r/24);
		this.innerbar.endFill();
		this.bar.addChild(this.innerbar);

		//Create the front red rectangle
		this.outbar = new PIXI.Graphics();
		this.outbar.beginFill(0xFF3300);
		this.outbar.drawRoundedRect (0, 0, this.r*0.6, this.r/12, this.r/24);
		this.outbar.endFill();
		this.bar.addChild(this.outbar);
		this.bar.outer = this.outbar;
	},
	set : function(hp){
		var ratio = hp/this.maxhp;
		//console.log(ratio)
		/*var length = hp/this.maxhp *this.r*0.6;
		this.innerbar.beginFill(0x000000);
		this.innerbar.drawRoundedRect (0, 0, this.r*0.6, this.r/12, this.r/24);
		this.innerbar.endFill();*/
		if(hp <= 0){
			this.character.Dead = true;
			ratio = 0;
		}
		this.outbar.scale.x = ratio;
	},
	update:function(){
		this.bar.x = this.pos.x - this.r/4;
		this.bar.y = this.pos.y - this.r*3/8;
	}
} // end HealthBar
