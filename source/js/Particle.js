function ParticlesPool() {
	this.complete = false;
	this.loadPool();
	this.complete = true;
}
ParticlesPool.prototype = {
	loadPool: function(){
		//this.createChargeFlame();
		//this.createFlame();
		//this.createText();
		//this.createIcon();
        this.createCoin();
	},
	createIcon:function(){
		this.Icons = [];
	},
	borrowIcon : function(){
		if(this.Icons.length >= 1)	return this.Icons.shift();
		else return null;
	},
	returnIcon: function(p){
		this.Icons.push(p);
	},
	createFlame: function(){
		this.flames = [];
		this.addFlameSprites(2);
	},
	addFlameSprites : function(amount) {
	  for (var i = 0; i < amount; i++){
	    var sprite = new PIXI.Sprite(flame_texture);
	    sprite.tint = RGBColor(getRandomInt(230, 255), getRandomInt(100, 200), 0);
	    sprite.anchor.x = 0.5;
		sprite.anchor.y = 0.45;
	    //clr = color(random(200,255),random(100,255),0);
	    var particle = new Particle(null, ParticleType.FLAME, sprite);
	    this.flames.push(particle);
	  }
	},
	borrowFlame : function(){
		//console.log("borrow flame");
		if(this.flames.length >= 1)	return this.flames.shift();
		else return null;
	},
	returnFlame: function(particle){
		//console.log("return flame");
		this.flames.push(particle);
		//console.log("this.flames.length: " + this.flames.length);
	},

    createCoin: function(){
        this.coins = [];
        this.addCoinSprites(5);
    },
    addCoinSprites : function(amount) {
      for (var i = 0; i < amount; i++){
        var sprite = new PIXI.Sprite(coin_texture);
        //sprite.tint = RGBColor(getRandomInt(230, 255), getRandomInt(100, 200), 0);
        //sprite.tint = 0xFFFFFF;
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 0.5;
        //clr = color(random(200,255),random(100,255),0);
        var particle = new Particle(null, ParticleType.COIN, sprite);
        this.coins.push(particle);
      }
    },
    borrowCoin : function(){
        //console.log("borrow coin");
        if(this.coins.length >= 1) return this.coins.shift();
        else return null;
    },
    returnCoin: function(particle){
        //console.log("return flame");
        this.coins.push(particle);
        //console.log("this.coins.length: " + this.coins.length);
    },

	createText: function(){
		this.texts = [];
		this.addText(8);
	},
	addText : function(amount){
		console.log("addText")
		for (var i = 0; i < amount; i++){
			//console.log(ParticleType.TEXT)'64px ' '#ff2211'
			var particle = new Text({ font: '40px Ninja Naruto', fill: "black"},
									 ParticleType.TEXT);
	    	this.texts.push(particle);
		}
	},
	borrowText : function(){
		if(this.texts.length >= 1)	return this.texts.shift();
		else return null;
	},
	returnText: function(particle){
		this.texts.push(particle);
	},
}

function Particles(){
    this.create();

    this.pool = new ParticlesPool();
    this.createLookupTables();
}
Particles.prototype = {
	create: function(){
		// Particles on the stage Currently, Gained when borrowed from the pool
		this.container = new PIXI.Container();
        this.particles = [];
		this.queue_particles = [];
        this.init();
	},
    init: function(){
        stage0.addChild(this.container);
    },
	getLength: function(){
		return this.particles.length;
	},
	update: function(time){
		for (var i = this.particles.length - 1; i >= 0; i--) {
			var p = this.particles[i];
			p.update(time);
			if(p.isDead()){
				if(p.cb_dead != null) p.cb_dead();
				this.clean(p);
				this.particles.splice(i,1);
			}
		}
		this.update_queue(time);
	},
	update_queue: function(time){
		if(this.queue_particles.length < 1) return;
		var p = this.queue_particles[0];
		if(p.isDead()){
			// Take next item in the queue
			if(this.queue_particles.length >= 2){
				this.queue_particles[1].init(this.queue_particles[1].input);
				this.queue_particles[1].time_s = time.t;
				if(this.queue_particles[1].cb != null) this.queue_particles[1].cb();
			}
			if(p.cb_dead != null) p.cb_dead();
			this.clean(p);
			this.queue_particles.splice(0,1);
		}else{
			p.update(time);
		}
	},
	spawn: function(input, type){
		//this.particles.push(new Particle(input));
		//console.log("ay: " + input.ay);
		var particle = this.borrowParticle(type);
		//console.log(particle)
		if(particle != null){
			particle.init(input);
			this.particles.push(particle);
		}
  	},
  	clean: function(particle){
  		//console.log("clean" + particle);
  		particle.clean();
  		this.returnParticle(particle.type, particle);
  	},
  	spawn_queue: function(input, type, num){
		var particle = this.borrowParticle(type);
		if(particle != null){
			if(this.queue_particles.length < 1){
				particle.init(input);
			}else{
				particle.input = input;
			}
			this.queue_particles.push(particle);
		}
  	},
	createLookupTables: function(){
		this.borrowParticleLookup = [];
		this.borrowParticleLookup[ParticleType.FLAME] = this.pool.borrowFlame;
        this.borrowParticleLookup[ParticleType.COIN] = this.pool.borrowCoin;
		this.borrowParticleLookup[ParticleType.TEXT] = this.pool.borrowText;
		this.borrowParticleLookup[ParticleType.ICON] = this.pool.borrowIcon;
		this.returnParticleLookup = [];
		this.returnParticleLookup[ParticleType.FLAME] = this.pool.returnFlame;
        this.returnParticleLookup[ParticleType.COIN] = this.pool.returnCoin;
		this.returnParticleLookup[ParticleType.TEXT] = this.pool.returnText;
		this.returnParticleLookup[ParticleType.ICON] = this.pool.returnIcon;
	},
	borrowParticle : function(particleType){
		return this.borrowParticleLookup[particleType].call(this.pool);
	},
	returnParticle : function(particleType, particle){
	//console.log(this.returnParticleLookup[particleType])
		if(this.returnParticleLookup[particleType] == undefined){
			particle = null;
			return;
		}
		return this.returnParticleLookup[particleType].call(this.pool, particle);
	},
};
//function Particle(x, y, ax, ay,color) {
  //this.init(x, y, ax, ay, color);
function Particle(input, type, sprite) {

  this.create(input, type, sprite);
}
Particle.prototype = {
  create: function(input, type, sprite){
  	this.type = type;
  	this.sprite = sprite;
  },
  init: function (input) {
  	this.input = input;
  	//console.log("particle init");
  	//console.log(input);
  	this.sprite.anchor.x = 0.5;
  	this.sprite.anchor.y = 0.5;
  	if(input.track_ang) this.sprite.rotation = this.input.body.angle;

  	if(input.play){
  		this.sprite.animationSpeed = input.animationSpeed;
  		this.sprite.play();
  	}
    this.radius = Math.random() * width;
    this.oldRadius = this.radius;
    this.particle_init(input);

  },
  particle_init: function(input){

  	this.sprite.x = input.x;
  	this.sprite.y = input.y;
    this.pos = new PVector(input.x, input.y);
    if(input.color != null) this.color = input.color;
  	this.vel = new PVector(0, 0);
    this.accel = new PVector(0, 0);
    if(input.ax != null){	this.accel.x = input.ax;	}
	if(input.ay != null){	this.accel.y = input.ay;	}
	if(input.x_end != null){
		this.x_start = input.x;
		if(input.x_end.length >= 1){
			this.index = 0;
			this.x_end = input.x_end[0];
		}else{
			this.x_end = input.x_end;
		}
	}
	if(input.y_end != null){
		this.y_start = input.y;
		if(input.y_end.length >= 1){
			this.y_end = input.y_end[0];
		}else{
			this.y_end = input.y_end;
		}
	}
	if(input.rs != undefined){
		this.rs = input.rs;
		this.r = this.rs;
		if(input.re.length >= 1){
			this.re = input.re[0];
		}else{
			this.re = input.re;
		}
		if(this.sprite != undefined && !isNaN(this.r)) this.sprite.width = this.rs;
  		if(this.sprite != undefined && !isNaN(this.r)) this.sprite.height = this.rs;
	}
	//console.log(this.rs)
	//console.log(this.re)
	if(input.lifespan_s != null){
		this.lifespan_s = input.lifespan_s;
	}else{
		this.lifespan_s = 255;//Math.floor((Math.random() * 255) + 1);
	}
	if(input.lifespan_d != null){
		this.lifespan_d = input.lifespan_d
	}else{
		this.lifespan_d = 5;
	}
	this.lifespan = this.lifespan_s;

	this.pct = 0;
	if(input.duration != null){
		if(input.duration.length != undefined){
			this.duration = input.duration[0];
		}else{
		 this.duration = input.duration;
		}
	}else{
		this.duration = undefined;
	}
	if(input.time == null)	this.time_s = time.t;
	//console.log(time.t)
	//console.log(this.time_s);
	if(input.cb != null){
		//this.cb = input.cb;
		if(input.cb.length != undefined){
			if(input.cb[0] != null) input.cb[0].call(this);
		}else{
			input.cb.call(this);
		}
	}else{ this.cb = null;}
	if(input.cb_dead != null){
		this.cb_dead = input.cb_dead;
	}else{this.cb_dead = null;}
	if(input.does_not_die != null) this.does_not_die = input.does_not_die;
	//console.log('this.does_not_die' + this.does_not_die)
	if(input.container != undefined){
        this.container = input.container;
		this.container.addChild(this.sprite);
	}else{
        this.container = stage;
		stage.addChild(this.sprite);
	}
  }, // end particle_init
  clean : function(){
  	this.duration = null;
  	this.cb_dead = null;
  	this.lifespan_d = null;
  	this.index = 0;
  	if(this.input.play) this.sprite.stop();
  	this.container.removeChild(this.sprite);
  },
  reset:function(){

  },
  update: function(time){
  	//console.log('particle update')
  	//console.log(this.accel);
	this.vel.add(this.accel);
    this.pos.add(this.vel);
	this.accel.mult(0);


	//console.log("this.lifespan: " + this.lifespan);
	this.sprite.rotation += 0.0;

	if(this.duration != null){
		this.run_queue(time);
	}else{
		this.sprite.alpha = (this.lifespan > 0) ? (this.lifespan)/255 : 0;
		this.lifespan -= this.lifespan_d;
	}

	//console.log(this.lifespan)
	if(this.input.track_pos != undefined){
		this.sprite.x = this.input.track_pos.x;
		this.sprite.y = this.input.track_pos.y;
	}else{
		this.sprite.x = this.pos.x;
		this.sprite.y = this.pos.y;
	}
	if(this.input.track_ang == true){
		//console.log(this.sprite.rotation)
		this.sprite.rotation = this.input.body.angle;
	}



  },
  run_queue: function(time){
  	//console.log('particle run_queue')
  	//console.log(this.time_s)
  	//console.log(this.pct)
  	this.pct = (time.t - this.time_s) / this.duration;
  	//console.log(this.duration)
  	if(this.input.x_end != undefined && this.input.x_end.length != undefined && this.index < this.input.x_end.length-1){
  		if(this.pct > 1){
  			this.pct -= 1;
  			if(this.rs != undefined) this.rs = this.input.re[this.index];
  			if(this.re != undefined) this.re = this.input.re[this.index + 1];
  			//console.log(this.rs)
  			//console.log(this.re)
  			this.x_start = this.input.x_end[this.index];
  			this.y_start = this.input.y_end[this.index];
  			this.x_end = this.input.x_end[this.index+1];
  			this.y_end = this.input.y_end[this.index+1];
  			if(this.input.cb != undefined) if(this.input.cb[this.index+1] != null)
  				this.input.cb[this.index+1].call(this);

  			this.duration = this.input.duration[this.index+1];
  			this.time_s = time.t - this.duration * this.pct;
  			this.index++;
  			//console.log("this.index " + this.index)
  		}
  	}
  	if(this.input.x_end != undefined && this.input.x_end.length != undefined &&  this.index == this.input.x_end.length - 1){
  		//console.log('ended, but not dead')
  		if(this.pct > 1){
	  		this.pct = 1;
	  		this.duration = 1;
	  	}
  	}
  	this.r = this.rs + (this.re - this.rs)*this.pct;
  	if(this.sprite != undefined && !isNaN(this.r)) this.sprite.width = this.r;
  	if(this.sprite != undefined && !isNaN(this.r)) this.sprite.height = this.r;
  	//console.log(this.r)
  	if(this.x_start != null){
  		this.pos.x = this.x_start + (this.x_end - this.x_start)*this.pct;
  	}
  	if(this.y_start != null){
  		this.pos.y = this.y_start + (this.y_end - this.y_start)*this.pct;
  	}
  },
  render: function (ctx) {
  },
  isDead: function(){
  	if(this.does_not_die){
  		return false;
  		console.log('not dead')
  	}
	return (this.lifespan <= 0 || this.pct >= 1);
  },
};
function Text(input, type){
	this.input = input;
	this.type = type;
	//this.sprite = new PIXI.Text("", {font: input.font,
		//this.text = new PIXI.extras.BitmapText("" + getRandomInt(5, 15),
		  //{ font: '64px Ninja Naruto', fill:"black", align: 'center' });

	this.sprite = new PIXI.extras.BitmapText("", {font: input.font,
							  fill: input.fill,
							 align: 'center',
							stroke: '#FF0000',
				   strokeThickness: 3 });
	this.sprite.tint = RGBColor(255,0,0);
	//menu.bitmapFontText.tint =  RGBColor(getRandomInt(200, 255), getRandomInt(180, 220), 0);
	//this.title = new PIXI.Text("Protect the Animals!",  { font: 'bold 60px Arial', fill: '#cc00ff', align: 'center', stroke: '#FFFFFF', strokeThickness: 6 });
	//new PIXI.extras.BitmapText("Save the Ducks! \n oo",  { font: '64px Luna', fill:"blue", align: 'right' });
}
Text.prototype = Object.create(Particle.prototype);
Text.prototype.constructor = Particle;
Text.prototype.init = function(input){
	this.sprite.text = input.text;
	stage.addChild(this.sprite);
  	this.sprite.rotation = input.rotation;
    this.radius = Math.random() * width;
    this.oldRadius = this.radius;
    this.particle_init(input);
    if(this.x_start != null){   this.x_start = this.x_start - this.sprite.width/2;}
    if(this.x_end != null){    	this.x_end = this.x_end - this.sprite.width/2;}
}
