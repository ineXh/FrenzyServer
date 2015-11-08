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
			communication.socket.emit('spawn', input);

			character.init(input);
			this.characters[input.type].push(character);
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
  		this.character_length[character.type]--;
  		this.returnCharacter(character.type, character);

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
	this.maxspeed = width/100;
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
	minDist = width;
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
	desired.mult(this.maxspeed);
	var steer = PVector.sub(desired, this.vel);
	steer.limit(this.maxforce);
	return steer;
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
	this.pos = new PVector(0,0);
	this.vel = new PVector(0,0);
	this.accel = new PVector(0,0);
	this.sprite = new PIXI.Sprite(cow_texture);
	this.r = dim*0.05;
	this.scale = this.r / this.sprite.width;
	this.sprite.scale.set(this.scale);
	this.sprite.anchor.x = 0.5;
	this.sprite.anchor.y = 0.5;
}
Cow.prototype.init = function(input){
	this.maxspeed = 2*stage_width/1000;
	this.pos.x = input.x;
	this.pos.y = input.y;
	stage.addChild(this.sprite);
}
Cow.prototype.update = function(time){
	this.move(time);
	this.sprite.position.x = this.pos.x;
	this.sprite.position.y = this.pos.y;
}

