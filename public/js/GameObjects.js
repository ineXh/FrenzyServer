var ball;
var AssetsLoaded = false;
var arrow_head_texture;
var arrow_line_texture;
var arrow_dot_texture;
var stick_texture;
var chick_frames = [];
var wolf_frames = [];
var wolf_frames_a = [];
var wolf_frames_b = [];
var wolf_frames_c = [];
var wolf_frames_d = [];
var chicks = [];
var wolves = [];

var egg_texture;
var egg_top_texture;
var egg_bot_texture;
var title_texture;
var icon1_texture;
var fence_texture;
var hut_texture;
var bgm;
var intro_sound;
function GameObjects(){
	this.init();
}
GameObjects.prototype = {
	init: function(){
		PIXI.loader
		.add('assets/wolf_texture.json')
		.add('assets/grasses.json')
		.add('assets/misc.json')
		//.add('assets/arrow_line.png')
		.add('assets/logo.png')
		.add('assets/icon2.png')
		.add( 'assets/njnaruto.fnt')
		.load(this.onAssetsLoaded.bind(this));	
		sounds.load([
		  "assets/intro.mp3"
		  //"assets/bgm.mp3"
		]);			
		sounds.whenLoaded = sound_setup;
	},	
	onAssetsLoaded : function(){
		console.log("onAssetsLoaded")
		chick_frames.push(PIXI.Texture.fromFrame("chick.png"));
		chick_frames.push(PIXI.Texture.fromFrame("chick2.png"));
		wolf_frames.push(PIXI.Texture.fromFrame("wolf1.png"));
		wolf_frames.push(PIXI.Texture.fromFrame("wolf2.png"));
		wolf_frames.push(PIXI.Texture.fromFrame("wolf3.png"));
		wolf_frames.push(PIXI.Texture.fromFrame("wolf4.png"));

		wolf_frames.push(PIXI.Texture.fromFrame("wolf5.png"));
		wolf_frames.push(PIXI.Texture.fromFrame("wolf6.png"));
		wolf_frames.push(PIXI.Texture.fromFrame("wolf7.png"));
		wolf_frames.push(PIXI.Texture.fromFrame("wolf8.png"));

		wolf_frames.push(PIXI.Texture.fromFrame("wolf9.png"));
		wolf_frames.push(PIXI.Texture.fromFrame("wolf10.png"));
		wolf_frames.push(PIXI.Texture.fromFrame("wolf11.png"));
		wolf_frames.push(PIXI.Texture.fromFrame("wolf12.png"));

		wolf_frames.push(PIXI.Texture.fromFrame("wolf13.png"));
		wolf_frames.push(PIXI.Texture.fromFrame("wolf14.png"));
		wolf_frames.push(PIXI.Texture.fromFrame("wolf15.png"));
		wolf_frames.push(PIXI.Texture.fromFrame("wolf16.png"));

		egg_texture = PIXI.Texture.fromFrame("egg.png");
		egg_top_texture = PIXI.Texture.fromFrame("egg_top.png");
		egg_bot_texture = PIXI.Texture.fromFrame("egg_bot.png");
		arrow_head_texture = PIXI.Texture.fromFrame("arrow_head.png");
		arrow_dot_texture = PIXI.Texture.fromFrame("arrow_dot.png");
		arrow_line_texture = PIXI.Texture.fromFrame("arrow_line.png");
		arrow_head_texture = PIXI.Texture.fromFrame("arrow_head.png");
		icon1_texture =  PIXI.Texture.fromImage("assets/icon2.png");

		fence_texture = PIXI.Texture.fromFrame("fence_b.png");
		hut_texture = PIXI.Texture.fromFrame("hut_142.png");

		gameobjects.particles = new Particles();;
		menu.onAssetsLoaded();
		stagelayout = new Stage_Layout();
		var stage_promise = stagelayout.load();

		path = new Path();
 	//path.addPoint(100, 200);
 	//path.addPoint(200, 200);
 	/*path.addPoint(width-20, height/2);
	path.addPoint(getRandomInt(width/2, width), getRandomInt(0, height));
	path.addPoint(getRandomInt(0, width/2), getRandomInt(0, height));	
	path.addPoint(+20, height/2);*/
	
	//path.drawPath();

		var logo_promise = menu.playlogo();

		/*Promise.all([stage_promise, logo_promise]).then(function(values){
			
			//
stagelayout.place_stage();
			chicks.push(new Chick(20,height/2 + 20));
			chicks.push(new Chick(25,height/2 - 20));
			chicks.push(new Chick(30,height/2 + 20));
		});*/

		for(var i = 0; i < 1; i++) wolves.push(new Wolf());
		

		assetsloaded = true;
	},
	update: function(time){
		if(this.particles != undefined)	this.particles.update(time);		
		chicks.forEach(function(c){
			c.update(time);
		})
		wolves.forEach(function(w){
			w.update(time);
		})
	},
}; // end GameObjects
function sound_setup(){	
  console.log("sounds loaded");
  //Create the sounds
  //bgm = sounds["assets/bgm.mp3"];
  intro_sound = sounds["assets/intro.mp3"]
  intro_sound.loop = false;
  //Make the music loop
  //bgm.loop = true;
  //Set the pan to the left
  
  //Set the music volume
  //bgm.volume = 0.7;  

  /*//Capture the keyboard events
  var a = keyboard(65),
      b = keyboard(66),
      c = keyboard(67),
      d = keyboard(68),
      e = keyboard(69),
      f = keyboard(70);
      g = keyboard(71);
      h = keyboard(72);

     //Play the bounce sound
  f.press = function() { bgm.play() };
  //Fade the music out over 3 seconds
  g.press = function() { 
    bgm.fadeOut(3);
  };
  //Fade the music in over 3 seconds
  h.press = function() { 
    bgm.fadeIn(3);
  };*/
  //intro_sound.playFrom(12);;
}