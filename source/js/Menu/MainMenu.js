function MainMenu(){
	stage_main_menu = new PIXI.Container();
	stage0.addChild(stage_main_menu);
	this.icons = [];

	this.init();
}
MainMenu.prototype = {
	init: function(){

	},
	initialize: function(){

	},
	restart :function(){
		stage0.addChild(stage_main_menu);
	},
	clean	: function(){
		//console.log('menu clean')
		stage0.removeChild(stage_main_menu);
	},
	update : function(time){
		if(this.done) return;

	},
	onAssetsLoaded : function(){
		icon_logo = new Particle({},
								ParticleType.ICON,
								new PIXI.Sprite(PIXI.Texture.fromFrame("logo.png")));
		icon_play = new Particle({},
								ParticleType.ICON,
								new PIXI.Sprite(PIXI.Texture.fromFrame("play_196.png")));

		icon_multiplay = new Particle({},
								ParticleType.ICON,
								new PIXI.Sprite(PIXI.Texture.fromFrame("icon_multiplayer.png")));

		icon_music = new Particle({},
								ParticleType.ICON,
								new PIXI.Sprite(PIXI.Texture.fromFrame("music_on.png")));
		icon_sound = new Particle({},
								ParticleType.ICON,
								new PIXI.Sprite(PIXI.Texture.fromFrame("sound_on.png")));
		icon_heart = new Particle({},
								ParticleType.ICON,
								new PIXI.Sprite(PIXI.Texture.fromFrame("heart.png")));
		icon_setting = new Particle({},
								ParticleType.ICON,
								new PIXI.Sprite(PIXI.Texture.fromFrame("setting.png")));

		title =  new Particle({},
								ParticleType.ICON,
								new PIXI.Sprite(PIXI.Texture.fromFrame("logo.png")));


	},
	playlogo :function(){
		return new Promise(function(resolve, reject){
			//console.log('playlogo')
			gamestate = GameState.Loading;
			icon_logo.init({
				x: width/2, y: height,
				x_end : [width/2, width/2],
				y_end : [height/2, height/2],
				duration : [100, 100],
				cb_dead : function(){
										resolve();
										gamestate = GameState.MainMenu;
										//console.log('logo dead');
										menu.mainmenu.playtitle();
										//console.log(this.sprite)
									}
			});
		});
	},
	playbutton : function(){
		return new Promise(function(resolve, reject){
			gamestate = GameState.MainMenu;
			icon_play.init({
				does_not_die : true,
				x: width/2- width/5, y: height/2,
				x_end : [width/2- width/5, width/2- width/5],
				y_end : [height/2, height/2],
				rs: width/30,
				re : [width/8, width/8],
				duration : [200,1],
				container : stage_main_menu,
				cb : [function(){//console.log(this)
					//this.sprite.tint = 0x9aaee6;//9aaee65b
								this.sprite.interactive = true;
								this.sprite.on('mousedown'        	, playbuttonpress.bind(menu));
								this.sprite.on('touchstart'       	, playbuttonpress.bind(menu));
								this.sprite.on('mouseup'        	, playbuttonrelease.bind(menu));
								this.sprite.on('touchend'       	, playbuttonrelease.bind(menu));
								this.sprite.on('mouseupoutside'     , playbuttonreleaseout.bind(menu));
								this.sprite.on('touchendoutside'    , playbuttonreleaseout.bind(menu));
								resolve();
								},
								function(){menu.mainmenu.playmultibutton();}]
			});
			menu.mainmenu.icons.push(icon_play);
		});
	},
	playmultibutton : function(){
		return new Promise(function(resolve, reject){
			gamestate = GameState.MainMenu;
			icon_multiplay.init({
				does_not_die : true,
				x: width/2 + width/5, y: height/2,
				x_end : [width/2 + width/5, width/2 + width/5],
				y_end : [height/2, height/2],
				rs: width/30,
				re : [width/8, width/8],
				duration : [200,1],
				container : stage_main_menu,
				cb : [function(){//console.log(this)
					//this.sprite.tint = 0x9aaee6;//9aaee65b
								this.sprite.interactive = true;
								this.sprite.on('mousedown'        	, playmultibuttonpress.bind(menu));
								this.sprite.on('touchstart'       	, playmultibuttonpress.bind(menu));
								this.sprite.on('mouseup'        	, playmultibuttonrelease.bind(menu));
								this.sprite.on('touchend'       	, playmultibuttonrelease.bind(menu));
								this.sprite.on('mouseupoutside'     , playmultibuttonreleaseout.bind(menu));
								this.sprite.on('touchendoutside'    , playmultibuttonreleaseout.bind(menu));

								resolve();
								},
								function(){menu.mainmenu.musicbutton();}]
			});
			menu.mainmenu.icons.push(icon_multiplay);
		});
	}, // end playmultibutton
	playtitle: function(){
		return new Promise(function(resolve, reject){
			//console.log('playtitle start')

			title.init({
				does_not_die : true,
				x: width/2, y: -height/20,
				x_end : [width/2, width/2],
				y_end : [height/4, height/4],
				rs: width/20,
				re : [width/4, width/4],
				duration : [500, 1],
				container : stage_main_menu,
				cb : [function(){//console.log(this)
								//this.sprite.interactive = true;
								//this.sprite.on('mousedown'        , playbuttonpress.bind(menu));
								//this.sprite.on('touchstart'       , playbuttonpress.bind(menu));
								//this.sprite.tint = 0xffd422;
								this.sprite.tint = 0xFFFFFF;

								},
								function(){
									menu.mainmenu.playbutton();
									resolve();}]
			});
			menu.mainmenu.icons.push(title);
			//gameobjects.particles.particles.push(title);
		});
	},
	musicbutton : function(){
		return new Promise(function(resolve, reject){
			//console.log('playbutton start')
			icon_music.init({
				does_not_die : true,
				x: width/2- width/4, y: height*7/8,
				x_end : [width/2- width/4, width/2- width/4],
				y_end : [height*7/8, height*7/8],
				rs: width/40,
				re : [width/20, width/20],
				duration : [200,1],
				container : stage_main_menu,
				cb : [function(){//console.log(this)
								this.sprite.tint = 0xffd422;
								this.sprite.interactive = true;
								this.sprite.on('mousedown'        , musicbuttonpress.bind(menu));
								this.sprite.on('touchstart'       , musicbuttonpress.bind(menu));
								resolve();
								},
								function(){menu.mainmenu.soundbutton();}]
			});
			menu.mainmenu.icons.push(icon_music);
		});
	},
	soundbutton : function(){
		return new Promise(function(resolve, reject){
			//console.log('playbutton start')
			icon_sound.init({
				does_not_die : true,
				x: width/2- width/8, y: height*7/8,
				x_end : [width/2- width/8, width/2- width/8],
				y_end : [height*7/8, height*7/8],
				rs: width/40,
				re : [width/20, width/20],
				duration : [200,1],
				container : stage_main_menu,
				cb : [function(){//console.log(this)
								this.sprite.tint = 0xffd422;
								this.sprite.interactive = true;
								this.sprite.on('mousedown'        , soundbuttonpress.bind(menu));
								this.sprite.on('touchstart'       , soundbuttonpress.bind(menu));
								resolve();
								},
								function(){menu.mainmenu.heartbutton();}]
			});
			menu.mainmenu.icons.push(icon_sound);
		});
	},
	heartbutton : function(){
		return new Promise(function(resolve, reject){
			//console.log('playbutton start')
			icon_heart.init({
				does_not_die : true,
				x: width/2 + width/8, y: height*7/8,
				x_end : [width/2 + width/8, width/2 + width/8],
				y_end : [height*7/8, height*7/8],
				rs: width/40,
				re : [width/20, width/20],
				duration : [200,1],
				container : stage_main_menu,
				cb : [function(){//console.log(this)
								this.sprite.tint = 0xffd422;
								this.sprite.interactive = true;
								this.sprite.on('mousedown'        , heartbuttonpress.bind(menu));
								this.sprite.on('touchstart'       , heartbuttonpress.bind(menu));
								resolve();
								},
								function(){menu.mainmenu.settingbutton();}]
			});
			menu.mainmenu.icons.push(icon_heart);
		});
	}, // end heartbutton
	settingbutton : function(){
		return new Promise(function(resolve, reject){
			//console.log('playbutton start')
			icon_setting.init({
				does_not_die : true,
				x: width/2 + width/4, y: height*7/8,
				x_end : [width/2 + width/4, width/2 + width/4],
				y_end : [height*7/8, height*7/8],
				rs: width/40,
				re : [width/20, width/20],
				duration : [200,1],
				container : stage_main_menu,
				cb : [function(){//console.log(this)
								this.sprite.tint = 0xffd422;
								this.sprite.interactive = true;
								this.sprite.on('mousedown'        , settingbuttonpress.bind(menu));
								this.sprite.on('touchstart'       , settingbuttonpress.bind(menu));
								resolve();
								},
								function(){}]
			});
			menu.mainmenu.icons.push(icon_setting);
		});
	}, // end settingbutton
	scores: function(){

	},
	update: function(time){
		if(gamestate == GameState.Loading){
			icon_logo.update(time);
			if(icon_logo.isDead()){
				if(icon_logo.cb_dead != null) icon_logo.cb_dead();
				icon_logo.clean();
			}
		}
		if(gamestate == GameState.MainMenu){
			this.icons.forEach(function(I){
				I.update(time);
			})
			if(this.chick_init) this.chick_update(time);
		}
		if(gamestate == GameState.StageSelect){
			for(var i = 0; i < this.stage_select_icons.length; i++){
				this.stage_select_icons[i].update(time);
			}
		}

	}, // end update

} // end MainMenu
var heartbuttonpress = function(){
	console.log('heartbuttonpress')
};
var musicbuttonpress = function(){
	console.log('musicbuttonpress')
	//menu.icon_music.sprite.scale
};

var playbuttonpress = function(){
	//console.log('playbuttonpress')
	//playbuttonpressd = true;
	icon_play.does_not_die  = false;
	icon_play.rs = icon_play.re;
	icon_play.re *= 0.75;
	icon_play.pct = 0;
	icon_play.duration = 200;
	icon_play.time_s = time.t;
	//this.pct = (time.t - this.time_s) / this.duration;
	//icon_play.sprite.scale.y *= 0.5;
};
var playbuttonrelease = function(){
	//playbuttonpressd = false;
	//console.log('playbuttonrelease')
	//gamestate = GameState.MainMenu2StageSelect;
	//gamestate = GameState.InPlay;
	menu.mainmenu.clean();
	stage0.addChild(stage);
	stage0.addChild(stage_front);
	gamemode = GameMode.SinglePlayer;
	game.startsingle();
	//menu.clean();
	//icon_play.does_not_die  = false;
};
var playbuttonreleaseout = function(){
	//playbuttonpressd = false;
	var temp = icon_play.rs;
	icon_play.rs = icon_play.re;
	icon_play.re = temp;

	icon_play.pct = 0;
	icon_play.duration = 200;
	icon_play.time_s = time.t;

	//console.log('playbuttonreleaseout')
	//menu.clean();
	//icon_play.does_not_die  = false;
};
var playmultibuttonpress = function(){
	//console.log('playbuttonpress')
	//playbuttonpressd = true;
	icon_multiplay.does_not_die  = false;
	icon_multiplay.rs = icon_multiplay.re;
	icon_multiplay.re *= 0.75;
	icon_multiplay.pct = 0;
	icon_multiplay.duration = 200;
	icon_multiplay.time_s = time.t;
	//this.pct = (time.t - this.time_s) / this.duration;
	//icon_play.sprite.scale.y *= 0.5;
};
var playmultibuttonrelease = function(){
	//playbuttonpressd = false;
	//console.log('playmultibuttonrelease')
	gamestate = GameState.MultiPlayerMenu;
	menu.mainmenu.clean();
	stage0.addChild(stage);
	stage0.addChild(stage_front);
	gamemode = GameMode.MultiPlayer;
	menu.multiplayermenu.init();
	//icon_play.does_not_die  = false;
};
var playmultibuttonreleaseout = function(){
	//playbuttonpressd = false;
	var temp = icon_multiplay.rs;
	icon_multiplay.rs = icon_multiplay.re;
	icon_multiplay.re = temp;

	icon_multiplay.pct = 0;
	icon_multiplay.duration = 200;
	icon_multiplay.time_s = time.t;

	//console.log('playmultibuttonreleaseout')
	//menu.clean();
	//icon_play.does_not_die  = false;
};
var settingbuttonpress = function(){
	console.log('settingbuttonpress')

};
var soundbuttonpress = function(){
	console.log('soundbuttonpress')
	//icon_play.does_not_die  = false;
};
