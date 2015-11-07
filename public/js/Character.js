function CharacterPool() {
	this.complete = false;
	this.loadPool();
}
CharacterPool.prototype = {
	loadPool: function(){
		this.createPiranha();
		this.createDuck();
	},
	createPiranha: function(){
		this.piranhas = [];
		this.addPiranha(10);
	},
	addPiranha: function(amount){
		for(var i = 0; i < amount; i++){
			var piranha = new Piranha({		 num: 20,
										base_pos: new PVector(100, 100)});
			this.piranhas.push(piranha);
			//console.log("addPiranha");
		}
	}, // end addPiranha
	borrowPiranha : function(){
		if(this.piranhas.length >= 1)	return this.piranhas.shift();
		else return null;
	}, // end borrowPiranha
	returnPiranha: function(character){
		this.piranhas.push(character);
	}, // end returnPiranha

	createDuck: function(){
		this.ducks = [];
		this.addDuck(5);
	},
	addDuck: function(amount){
		for(var i = 0; i < amount; i++){
			var duck = new Duck({		 num: 20,
										base_pos: new PVector(100, 100)});
			this.ducks.push(duck);
			//console.log("addDuck");
		}
	}, // end addDuck
	borrowDuck : function(){
		if(this.ducks.length >= 1)	return this.ducks.shift();
		else return null;
	}, // end borrowDuck
	returnDuck: function(character){
		this.ducks.push(character);
	}, // end returnDuck
} // end CharacterPool
function Characters(){
	this.init();
    this.pool = new CharacterPool();
    this.createLookupTables();
}
Characters.prototype = {
	init: function(){
		// characters on the stage Currently, Gained when borrowed from the pool
		this.characters = [];  		  
	},
	getLength: function(){
		return this.characters.length;
	},  
	update: function(time, dt){		
		for (var i = this.characters.length - 1; i >= 0; i--) {
			var c = this.characters[i];
			c.update(time);
			if(c.isDead()){
				//console.log(c);
				this.clean(c);
				var index = this.getCharacterlist(c.type).indexOf(i);
				if(index > -1){ 
					var val = this.getCharacterlist(c.type)[index];
					this.getCharacterlist(c.type).splice(index,1);
					this.decrementCharacterlists(val);
				}
				this.characters.splice(i,1);
			} 
		}
	},	
	spawn: function(input, type){
		var character = this.borrowCharacter(type);
		if(character != null){
			character.init(input);
			this.characters.push(character);			
			this.getCharacterlist(type).push(this.characters.length-1);
			this.character_length[type]++;
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
	createLookupTables: function(){
		this.borrowCharacterLookup = [];
		this.borrowCharacterLookup[CharacterType.Piranha] = this.pool.borrowPiranha;
		this.borrowCharacterLookup[CharacterType.Duck] = this.pool.borrowDuck;
		this.returnCharacterLookup = [];
		this.returnCharacterLookup[CharacterType.Piranha] = this.pool.returnPiranha;
		this.returnCharacterLookup[CharacterType.Duck] = this.pool.returnDuck;		
		this.character_length = [];
		this.character_length[CharacterType.Piranha] = 0;
		this.character_length[CharacterType.Duck] = 0;		
		this.characterlist = [];
		this.characterlist[CharacterType.Piranha] = [];
		this.characterlist[CharacterType.Duck] = [];
	},
	borrowCharacter : function(characterType){
		return this.borrowCharacterLookup[characterType].call(this.pool);
	},
	returnCharacter: function(characterType, character){
		return this.returnCharacterLookup[characterType].call(this.pool, character);
	},
	getCharacterlist: function(characterType){
		return this.characterlist[characterType];
	},
	decrementCharacterlists:function(index){
		for(var i = 0; i < this.characterlist.length; i++){
			if(this.characterlist[i] != undefined){
				for(var j = 0; j < this.characterlist[i].length; j++){
					if(this.characterlist[i][j] > index) this.characterlist[i][j]--;
				}
			}
		}
	},
	getlength :function(characterType)	{
		return this.character_length[characterType];
	},
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

Piranha.prototype = Object.create(Character.prototype);
Piranha.prototype.constructor = Character;
function Piranha(input){
	Character.call(this);
	this.type = CharacterType.Piranha;
	this.maxforce = width/10000;
    this.maxspeed = width/600;
    this.turnspeed = PI/360;
	this.width = width/100;
	// Head is tracking this
	this.tipball = new Ball(0, 0, 1, false);
	this.tipball.border = true;
	
	this.targets = [];
	this.target_base = new PVector(100, 100);
	this.target_hunt = null;
	
	this.target_current = new PVector(this.target_base.x, this.target_base.y);	//this.target_hunt;

	this.sprite = new PIXI.Sprite(piranha_open_texture);

	this.scale =  (dim*0.1) / this.sprite.width;
	
	//this.botsprite = new PIXI.Sprite(piranha_open_bot_texture);
	this.num = input.num;
		
	this.onFire_offset = 3;


	this.arm = new Arm();
	this.leaves = [];
	this.leaves_offset = 5;
		
	this.sprite.anchor.x = 0.5;
	this.sprite.anchor.y = 0.5;
	this.sprite.scale.set(this.scale);
	/*this.botsprite.anchor.x = 0.5;
	this.botsprite.anchor.y = 0.5;
	this.botsprite.scale.set(this.scale);
	stage.addChild(this.botsprite);*/		

	// Hunt -> Bite -> Retreat
	this.thrustTime = 0;
  	this.thrustTotalTime = 4000;   // Total Cycle time
  	this.thrustNotBiteTime = 3000; // Hunting time
  	this.thrustBiteTime = 1000;		// Biting Time

  	this.searchTargetTime = 0;
  	this.searchTargetTotalTime = 3000;

  	this.burnTime = 0;
  	this.burnTotalTime = 100;	
	
	this.catchfireTime = 0;
  	this.catchfireTotalTime = 100;
} // end Piranha initialize
Piranha.prototype.init = function(input){
	this.targets = [];
	//this.pos.x = input.base_pos.x;
	//this.pos.y = input.base_pos.y;
	this.target_base.x = input.base_pos.x;
	this.target_base.y = input.base_pos.y;

	this.tipball.pos.x = input.base_pos.x;
	this.tipball.pos.y = input.base_pos.y;
	this.num = input.num;
	this.arm.init(input.num, this.tipball.pos);// = new Arm(input.num, this.tipball.pos);
	this.arm.setBasepos(input.base_pos);
	this.arm.onFire = [];
	if(input.maxspeed != undefined) this.maxspeed = input.maxspeed;
	this.arm.setBasepos(input.base_pos);
	this.arm.update();
	this.pos = this.arm.getBase();

	if(input.target != undefined){ 
		this.target_hunt = input.target;
	}
	// Leaves
	for(var i = 0; i < Math.floor(this.num/this.leaves_offset*2)-2; i++){
		var sprite = new PIXI.Sprite(leaf_texture);
		sprite.anchor.x = 0.5;
		sprite.anchor.y = 0.5;
		sprite.scale.set(this.scale);
		//stage.addChild(sprite);
		this.leaves.push(sprite);
	}

	// Unfade Sprites
	this.sprite.alpha = 1;
	this.arm.alpha = 1;	
	this.leaves.forEach(function(f){f.alpha = 1;});
	// Reset States
	this.thrusting = false;
	this.biting = false;
	this.dying = false;
	this.Dead =false;
	// Reset Fire
	this.arm.num_onFire = 0;
	for(var i = 0; i < this.arm.onFire.length; i++) this.arm.onFire[i] = false;
	this.burning_ls = 255;	
	stage.addChild(this.sprite);
	this.leaves.forEach(function(l){stage.addChild(l);});	
} // end Piranha init
Piranha.prototype.clean = function(input){
	this.Dead = true;
	this.arm.clean();
	stage.removeChild(this.sprite);
	//this.leaves.forEach(function(l){stage.removeChild(l);});	
	for (var i = this.leaves.length - 1; i >= 0; i--) {
      var l = this.leaves[i];
      stage.removeChild(l);
      this.leaves.splice(i,1);
    }    
    num_burnt ++;
} // end Piranha clean
/*Piranha.prototype.drawTop = function(){
	stage.addChild(this.sprite);
}*/
Piranha.prototype.add_target_hunt = function(other){
	for(var i = 0; i < this.targets.length; i++){
		if(this.targets[i] == other) return;
	}
	this.targets.push(other);
}
// Search Target is the character which contains position
Piranha.prototype.searchTarget = function(time){
	//console.log(time)
	if(this.targets.length < 1){
		this.target_hunt = null;
		return;	
	} 
	if((time.t - this.searchTargetTime) > this.searchTargetTotalTime){
		//console.log("searchTarget");
		this.target_hunt = null;
		var target_pos = [];
		for (var i = this.targets.length - 1; i >= 0; i--) {
			var t = this.targets[i];
			if(t.isDead()){	// remove dead targets
				this.targets.splice(i,1);
			}else{
				target_pos.push(t.pos);
			}
		}
		
		//for(var i = 0; i < this.targets.length; i++) target_pos.push(this.targets[i].pos);
		var idx = this.findClosestTarget(target_pos, this.arm.getTip().pos);
		this.target_hunt = this.targets[this.targets.length -1 - idx];
		this.searchTargetTime = time.t;

		//idx = this.findClosestTarget(this.SteerTargets, this.arm.getTip().pos);
		//var force = 
	}
} // end searchTarget
Piranha.prototype.update_base = function(){
	if(this.dying) return;
	this.vel.add(this.accel);    
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.accel.mult(0);
    this.target_base.x = this.pos.x + width*0.1;
	this.target_base.y = this.pos.y+ height*0.1;
} // end update_base
Piranha.prototype.update_leaf = function(){
	for(var i = 0; i < this.leaves.length; i=i+2){
		var arm_idx = Math.floor(this.leaves_offset*(i+2)/2);
		this.leaves[i].x 			= this.arm.pos[arm_idx].x;
		this.leaves[i].y 			= this.arm.pos[arm_idx].y;
		this.leaves[i].rotation 	= this.arm.angle[arm_idx];
		this.leaves[i+1].x 			= this.arm.pos[arm_idx].x;
		this.leaves[i+1].y 			= this.arm.pos[arm_idx].y;
		this.leaves[i+1].rotation 	= this.arm.angle[arm_idx];
		this.leaves[i+1].scale.y 	= -this.leaves[i].scale.y;//-1;
	}
} // end update_leaf
Piranha.prototype.update = function(time){
	this.tipball.update(time);
	this.tipball.vel.x = map(this.target_current.x - this.tipball.pos.x,
							 -width, width ,
							  (this.thrusting) ? -width/5 : -width/400,
							  (this.thrusting) ?  width/5 :  width/400);
	this.tipball.vel.y = map(this.target_current.y - this.tipball.pos.y,
							 -height, height ,
							  (this.thrusting) ? -height/5 : -height/400,
							  (this.thrusting) ?  height/5 :  height/400);
	
	this.searchTarget(time);
  	this.applyBehaviors(time);
	this.update_base();		
	this.update_leaf();

	if(this.target_hunt != null){
		var ang = this.arm.getAnglefromTip(this.target_hunt.pos);
		//console.log("ang: " + ang);
		this.sprite.rotation += this.tilt_ang(ang, this.sprite.rotation);
		//this.botsprite.rotation = this.sprite.rotation;
		this.thrust(ang, this.sprite.rotation, time);
		this.bite(time);
	}
	
	var tip = this.arm.getTip();
	this.sprite.x = tip.pos.x;
	this.sprite.y = tip.pos.y;

	//this.botsprite.x = tip.pos.x;
	//this.botsprite.y = tip.pos.y;
	//this.sprite.rotation = tip.angle;
	//if(this.dying) this.arm.alpha -= 0.05;
	this.arm.update(time);
	this.burn(time);
	this.catchFire(time);

	this.isDead();
} // end Piranha update
Piranha.prototype.tilt_ang = function(ang, orientation){
	var new_ang = ang - orientation;
	while(new_ang > 2*Math.PI) new_ang -= 2*Math.PI;
	while(new_ang < 0) new_ang += 2*Math.PI;
	if(new_ang < Math.PI/30 || new_ang > (2*PI - PI/30)){
		return 0;
	}else if(new_ang > PI){ // ccw
		return -((this.thrusting)? this.turnspeed*3 : this.turnspeed);
	}else{
		return ((this.thrusting) ? this.turnspeed*3 : this.turnspeed);
	}
} // end Piranha tilt_ang
Piranha.prototype.thrust = function(ang, orientation, time){
	if(	  time.t - this.thrustTime 	< 	this.thrustNotBiteTime) return; // Hunting
	//console.log("(time.t - this.thrustTime): " + (time.t - this.thrustTime));
	if(	((time.t - this.thrustTime)  >= 	this.thrustNotBiteTime) &&
		((time.t - this.thrustTime) 	<	this.thrustTotalTime)) { // Done Hunting
			this.target_current = this.target_base;
			//console.log("return to base");
			return;
		}else{	// New Hunt
			this.target_current = this.target_hunt.pos;
			this.thrusting = false;
		}
		// Looking for a thrust		
		var new_ang = ang - orientation;
    	while (new_ang > 2*PI) new_ang -= 2*PI;
    	while (new_ang < 0) new_ang += 2*PI;
    	// within angle
    	if (new_ang < PI/4 || new_ang > (2*PI - PI/4)) {
	      	this.thrusting = true;
	      	//console.log("go for thrust");
	      	this.thrustTime = time.t;
    	} else {
      		this.thrusting = false;
    	}
} // end Piranha thrust
Piranha.prototype.bite = function(time){
	if ((this.thrusting && (time.t - this.thrustTime > this.thrustBiteTime) 
		&& (time.t - this.thrustTime < this.thrustNotBiteTime)) && !this.dying) {
		if(isIntersecting(this.sprite, this.target_hunt.sprite)){
				this.sprite.texture = piranha_close_texture;
				this.biting = true;
				//console.log("bite");
				this.target_hunt.Dead = true;
		}
	}else{
		this.sprite.texture = piranha_open_texture;
		this.biting = false;
	}
} // end Piranha bite
Piranha.prototype.burn = function(time){
	if(this.Dead) return;  	
	if(time.t - this.burnTime < this.burnTotalTime) return;	
	for(var i = 0; i < this.arm.onFire.length; i += this.onFire_offset){
		if(this.arm.onFire[i]){
			//console.log("i" + i)
			gameobjects.particles.spawn({x: this.arm.pos[i].x,
										y: this.arm.pos[i].y,
										//x: this.arm.pos[i*this.onFire_offset].x,
										// y: this.arm.pos[i*this.onFire_offset].y,
								 lifespan_d: 50, 
								 ax: getRandomArbitrary(-1, 1)*-width*0.002, 
								 ay: getRandomArbitrary(-0.5, 1)*-height*0.01},
								 ParticleType.FLAME);
		}
	}
	this.burnTime = time.t;
} // end Piranha burn
Piranha.prototype.catchFire = function(time){
	if(time.t - this.catchfireTime < this.catchfireTotalTime) return;
	var fire;
	var arm = this.arm;
	var offset = this.onFire_offset;
	for(var i = 0; i < this.arm.pos.length; i++){
		if(arm.onFire[i] == true) continue;
		gameobjects.particles.particles.forEach(function(f){
			//console.log(f);
			//console.log(f.type);
			if(f.type != ParticleType.FLAME) return;
			if(withinDist(f.pos, arm.pos[i], arm.segWidth)){
				//var j = Math.floor(i / offset);
				arm.onFire[i] = true;
				arm.num_onFire ++;
				//console.log("arm on fire: " + arm.num_onFire);
			}
		});
	}
	//this.catchfireTime = time.t;	
} // end Piranha catchFire
Piranha.prototype.isDead = function(){
	if(this.Dead) return true;
	if (this.arm.numSegments * 0.7 <= this.arm.num_onFire && !this.dying) {
		//console.log("dying");
		this.Dead = false;
		this.dying = true;
		var drop_position = new PVector(this.arm.getBase().x, height);	
		//new Ball(this.arm.getBase().x, this.arm.getBase().y, 20, true);
		this.targets = [];
		//this.targets.push(drop_position);
		this.target_base = drop_position;
		//this.target_hunt = drop_position;
		this.target_current	= drop_position;
		//this.target_current = this.target_base;
		//this.target_current = this.target_hunt;
	}else if(this.dying){		
		this.burning_ls -= 1;
		var alpha = this.burning_ls/255;
		this.sprite.alpha = alpha;
		this.arm.alpha = alpha;	
		this.leaves.forEach(function(f){
			f.alpha = alpha;
		});
		if(this.burning_ls <= 0){
	        this.Dead = true;
	        menu.scores();
	        return true;
    	}    	
	}
	return false;
}  // end Piranha isDead

Duck.prototype = Object.create(Character.prototype);
Duck.prototype.constructor = Character;
function Duck(){
	Character.call(this);
	this.type = CharacterType.Duck;
	this.border = true;	
	this.catchfireTime = 0;
  	this.catchfireTotalTime = 100;
  	this.hp = 3;		
}
Duck.prototype.init = function(input){		
	this.sprite1 = new PIXI.extras.MovieClip(duck_frames);
	this.sprite2 = new PIXI.Sprite(chicken_texture);
	this.sprite = this.sprite1;
	stage.addChild(this.sprite);
	this.maxspeed = width/100;
	this.r = dim*0.05;	
	
	this.scale =  (this.r) / this.sprite.width;	
	this.sprite.scale.set(this.scale);
	this.width = this.sprite.width;
	this.height = this.sprite.height;
    this.sprite.position.set(this.pos.x, this.pos.y);
    this.sprite.anchor.set(0.5);
    this.sprite.animationSpeed = 0.02;
    alive_ducks += 1;
	this.reset(input);
} // end Duck init
Duck.prototype.reset= function(input){
	this.pos.x = input.x;
	this.pos.y = input.y;
	if(input.maxspeed != undefined) this.maxspeed = input.maxspeed;    
    this.loaded = true;
    this.accel.x = Math.random()*10;
    this.accel.y = Math.random()*10;
    this.Dead = false;
    this.fried = false;
    this.sprite = this.sprite1;
    this.sprite1.play();
},
Duck.prototype.clean = function(){
	this.Dead = true;
	//console.log("duck clean")
	this.sprite1.stop();
	stage.removeChild(this.sprite);
	if(!this.fried) alive_ducks -= 1;
}
Duck.prototype.update = function(time){	
	
	if(!this.fried){
		this.move(time);
		if(this.vel.x > 0){ this.sprite.scale.x = -Math.abs(this.sprite.scale.x);
		}else{ this.sprite.scale.x = Math.abs(this.sprite.scale.x);}
		this.sprite.position.set(this.pos.x, this.pos.y);
		this.catchFire(time);
	}
}
Duck.prototype.catchFire = function(time){
	if(time.t - this.catchfireTime < this.catchfireTotalTime) return;
	var duck_sprite = this.sprite;
	var duck = this;
	gameobjects.particles.particles.forEach(function(f){
		if(f.type != ParticleType.FLAME) return;
		if(isIntersecting(duck_sprite, f.sprite)){
			//console.log("duck burned");
			duck.hp-=1;
			duck.catchfireTime = time.t;
			if(duck.hp <= 0) duck.fry();
			return;
		}
	});
Duck.prototype.fry = function(){
	//this.sprite = this.sprite2;
	if(this.fried) return;
	this.fried = true;
	this.sprite1.stop();
	stage.removeChild(this.sprite);
	this.sprite = this.sprite2;
	this.sprite.position.set(this.pos.x, this.pos.y);
	stage.addChild(this.sprite);
	alive_ducks -= 1;
}
	/*var fire;
	var arm = this.arm;
	var offset = this.onFire_offset;
	for(var i = 0; i < this.arm.pos.length; i++){
		if(arm.onFire[i] == true) continue;
		gameobjects.particles.particles.forEach(function(f){
			//console.log(f);
			//console.log(f.type);
			if(f.type != ParticleType.FLAME) return;
			if(withinDist(f.pos, arm.pos[i], arm.segWidth)){
				//var j = Math.floor(i / offset);
				arm.onFire[i] = true;
				arm.num_onFire ++;
				//console.log("arm on fire: " + arm.num_onFire);
			}
		});
	}*/
} // end Piranha catchFire

function Cow(x, y){
	this.init(x,y);
}
Cow.prototype = {
	init: function(x,y){
		this.pos = new PVector(x,y);
		this.reset();
	},
	reset: function(){
		this.movie = new PIXI.extras.MovieClip(cow_frames);
		this.width = this.movie.width;		
	    this.movie.position.set(this.x, this.y);
	    this.movie.anchor.set(0.5);
	    this.movie.animationSpeed = 0.02;
	    this.movie.play();
	    stage.addChild(this.movie);
	    this.loaded = true;
	},	
	update: function(time){
		var x = this.pos.x;
		var y = this.pos.y;
		this.movie.position.set(x, y);
	},
}

function Bunny(x, y){
	this.init(x, y);
}
Bunny.prototype = {
	init: function(x, y){
		this.pos = new PVector(x,y);
		this.vel = new PVector(0,0);
		this.accel = new PVector(0,0);
		// create a texture from an image path		
		this.sprite = new PIXI.Sprite(bunny_texture);
		this.sprite.anchor.x = 0.5;
		this.sprite.anchor.y = 0.5;
		this.sprite.position.x = x;
		this.sprite.position.y = y;		
		stage.addChild(this.sprite);
	},
	update: function(time){
		this.move(time);
		this.sprite.position.x = this.pos.x;
		this.sprite.position.y = this.pos.y;
		//this.sprite.rotation += 0.1;
	},
	move: function(time){
	    this.vel.add(this.accel);
	    this.pos.add(this.vel);
	    this.accel.mult(0);     
  	},
}; // end Bunny
Chick.prototype = Object.create(Character.prototype);
Chick.prototype.constructor = Character;
function Chick(x, y, container){
	this.init(x, y, container);
}
Chick.prototype.init =  function(x, y, container){
	this.pos = new PVector(x,y, 0);
	this.vel = new PVector(0,0, 0);
	this.accel = new PVector(0,0, 0);
	this.maxspeed = 2*width/1000;
	this.maxforce = 1/50*width/1000;
	// create a texture from an image path	
	this.sprite = new PIXI.extras.MovieClip(chick_frames);
	this.egg_sprite = new PIXI.Sprite(egg_texture);
	this.egg_top_sprite = new PIXI.Sprite(egg_top_texture);
	this.egg_shadow_sprite = new PIXI.Sprite(egg_texture);
	this.egg_shadow_sprite.tint = 0xAA;
	this.egg_shadow_sprite.alpha = 0.5;
	this.egg_shadow_sprite.rotaton = 0.25*PI;
	this.r = dim*0.05;
	this.egg_scale = this.r / this.egg_sprite.width
	this.egg_sprite.scale.set(this.egg_scale);
	this.egg_top_sprite.scale.set(this.egg_scale);
	this.egg_shadow_sprite.scale.set(this.egg_scale)
	this.hatching = false;
	this.hatched = false;
	this.scale =  (this.r) / this.sprite.width;	
	this.sprite.scale.set(this.scale);
	this.z_scale = 1;
	
	this.egg_sprite.position.set(this.x, this.y);
	this.egg_sprite.anchor.set(0.5);
	
	this.egg_top_sprite.position.set(this.x, this.y);
	this.egg_top_sprite.anchor.set(0.5);

	this.egg_shadow_sprite.position.set(this.x, this.y);
	this.egg_shadow_sprite.anchor.set(0.5);

	this.sprite.position.set(this.x, this.y);
	this.sprite.anchor.set(0.5);
	this.sprite.animationSpeed = 0.06;
	this.chick_rot_slope = 1;
	this.container = container;

	this.border = true;
	//container.addChild(this.sprite);
}
Chick.prototype.hatch = function(time){
	//if(this.hatching) return;
	// Begin Hatching
	if(!this.hatching && !this.hatched){
		//this.container.removeChild(this.egg_sprite);
		this.egg_sprite.texture = egg_bot_texture
		this.container.removeChild(this.egg_shadow_sprite);
		//this.container.removeChild(this.egg_sprite);
		this.container.addChild(this.sprite);
		this.container.addChild(this.egg_top_sprite);
		//this.container.addChild(this.egg_sprite);
		this.sprite.play();
		this.hatch_pct = 0;
		this.hatching = true;
	}
	// Hatching, egg crack
	if(this.hatching){
		//console.log('hatching')
		this.hatch_pct += 0.01;
		this.egg_top_sprite.position.x = this.pos.x + this.egg_top_sprite.width*this.hatch_pct;
		this.egg_top_sprite.position.y = this.pos.y;
		this.egg_sprite.position.x = this.pos.x - this.egg_sprite.width*this.hatch_pct
		this.egg_sprite.position.y = this.pos.y;

		this.egg_shadow_sprite.position.x = this.pos.x;
		this.egg_shadow_sprite.position.y = this.pos.y;
		if(this.hatch_pct >= 1){
			this.hatching = false; this.hatched = true;	
			this.container.removeChild(this.egg_sprite);
			this.container.removeChild(this.egg_top_sprite);
		} 
	}
}

Chick.prototype.update = function(time){
		//console.log(path.follow(this));
		
	applyForce.call(this, path.follow(this));
	this.move(time);
	if(this.pos.z > this.sprite.height) this.pos.z = this.sprite.height;
	this.z_scale = 1 + this.pos.z/this.sprite.height;
	// egg dropping, not hatched
	if(!this.hatching && !this.hatched){
		this.egg_sprite.position.x = this.pos.x;
		this.egg_sprite.position.y = this.pos.y - this.pos.z;
		this.egg_sprite.scale.x = this.egg_scale*this.z_scale;
		this.egg_sprite.scale.y = this.egg_scale*this.z_scale;
		this.egg_shadow_sprite.position.x = this.pos.x;
		this.egg_shadow_sprite.position.y = this.pos.y;
		this.egg_shadow_sprite.scale.set(this.egg_scale*(0.9-this.pos.z/this.sprite.height));
	}
	if(this.hatching){
		this.hatch(time);
	}
	
	this.sprite.position.x = this.pos.x;
	this.sprite.position.y = this.pos.y - this.pos.z*this.z_scale;

	
	this.sprite.scale.x = this.scale*this.z_scale;
	this.sprite.scale.y = this.scale*this.z_scale;
	

	if(this.vel.x > 0){ this.sprite.scale.x = Math.abs(this.sprite.scale.x);
	}else{ this.sprite.scale.x = -Math.abs(this.sprite.scale.x);}
	// wriggle
	this.sprite.rotation += PI/12/25 * this.chick_rot_slope;
	if(Math.abs(this.sprite.rotation) > PI/12) this.chick_rot_slope *= -1;


}// end Chick update
Wolf.prototype = Object.create(Character.prototype);
Wolf.prototype.constructor = Character;
function Wolf(x, y, container){
	this.init(x, y, container);
}
Wolf.prototype.init =  function(){
	this.x = [];
	this.y = [];
	this.duration = [];
	this.sprite = new PIXI.Sprite(wolf_frames[0]);
	this.sprite.anchor.set(0.5);
	this.r = dim*0.15;
	this.scale = this.r / this.sprite.width
	this.sprite.scale.set(this.scale);
	//this.reset(x, y, duration);
	//this.container = container;
}
Wolf.prototype.reset = function(x, y, duration){
	this.x = x;
	this.y = y;
	this.duration = duration;
	this.sprite.position.x = x[0];
	this.sprite.position.y = y[0];
	this.time_s = time.t;
	this.index = 0;
	this.len = this.duration.length;
	this.pct = 0;
	this.count = 0;
	this.sprite.texture = wolf_frames[0];
}
Wolf.prototype.addChild = function(container){
	container.addChild(this.sprite);
}
Wolf.prototype.update = function(time){
	/*this.move(time);
	if(this.vel.x > 0){
		//this.sprite = this.sprite_a;
	}*/
	//console.log(this.pct)
	if(this.pct > 1){
		this.index ++;
		if(this.index >= this.len) this.index = 0;
		this.pct = 0;
		this.time_s = time.t;
	} 
	
	this.pct = (time.t - this.time_s) / this.duration[this.index];
	//console.log(this.pct)
	var index2 = (this.index + 1 >= this.len) ? 0 : this.index+1;
	this.vel_x = this.x[this.index] + (this.x[index2] - this.x[this.index])*this.pct - this.sprite.position.x;
	this.vel_y = this.y[this.index] + (this.y[index2] - this.y[this.index])*this.pct - this.sprite.position.y;	
	this.sprite.position.x += this.vel_x;
	this.sprite.position.y += this.vel_y;

	var base_frame = 0;
	if(Math.abs(this.vel_y) >= Math.abs(this.vel_x)){
		if(this.vel_y >= 0) base_frame = 0;
		else base_frame = 4;
	}else{
		if(this.vel_x >= 0) base_frame = 12;
		else base_frame = 8;
	}

	//this.count++;
	var speed = 10;
	this.sprite.texture = wolf_frames[base_frame + Math.floor((this.count++%(4*speed)) / speed)];
}