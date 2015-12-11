function GameObjects(){
	this.init();
}
GameObjects.prototype = {
	init: function(){
		PIXI.loader
		.add('assets/cow.png')
		.add('assets/misc.json')
		.add('assets/soldier.json')
        .add('assets/grasses.json')
        .add('assets/cow/1.png')
        .add('assets/cow/2.png')
        .add('assets/cow/3.png')
        .add('assets/cow/4.png')
        .add('assets/cow/5.png')
        .add('assets/coin.png')
        .add('assets/rect.png')
        .add('assets/attack_upgrade_lo.png')
        .add('assets/defense_upgrade_lo.png')
        .add('assets/speed_upgrade_lo.png')
        .add( 'assets/space.fnt')
        .add( 'assets/ataurusp.fnt')
        .add( 'assets/ataurus3d.fnt')
        .add( 'assets/android.fnt')
        .add( 'assets/fipps.fnt')
        .add( 'assets/pixel-love.fnt')
        .load(this.onassetsloaded.bind(this));

	},
	onassetsloaded : function(){
		console.log("onassetsloaded")
		cow_texture = PIXI.Texture.fromImage("assets/cow.png");
        hut_texture  = PIXI.Texture.fromFrame("hut_142.png");
        coin_texture = PIXI.Texture.fromFrame("assets/coin.png");
        rect_texture = PIXI.Texture.fromImage("assets/rect.png");
        attack_upgrade_texture = PIXI.Texture.fromImage("assets/attack_upgrade_lo.png");
        defense_upgrade_texture = PIXI.Texture.fromImage("assets/defense_upgrade_lo.png");
        speed_upgrade_texture = PIXI.Texture.fromImage("assets/speed_upgrade_lo.png");

		arrow_line_texture = PIXI.Texture.fromFrame("arrow_line.png");
		arrow_head_texture = PIXI.Texture.fromFrame("arrow_head.png");

        for(var i = 1; i <= 8; i++){
            cow_front_frames.push(PIXI.Texture.fromImage('assets/cow/' + i + '.png'));
        }
        for(var i = 1; i <= 6; i++){
            cow_front_frames.push(PIXI.Texture.fromImage('assets/cow/a' + i + '.png'));
        }
        for(var i = 1; i <= 8; i++){
            cow_front_frames.push(PIXI.Texture.fromImage('assets/cow/b' + i + '.png'));
        }
        for(var i = 1; i <= 6; i++){
            cow_front_frames.push(PIXI.Texture.fromImage('assets/cow/ba' + i + '.png'));
        }

        characters = new Characters();
        //path = new Path();
        game = new Game();
        stagesetup = new Stagesetup();

        stagelayout = new Stage_Layout();
        var stage_promise = stagelayout.load();
        menu = new Menu();
        communication = new Communications();

        menu.mainmenu.playlogo();
        //startChat();
        particles = new Particles();

		assetsloaded = true;
	},
	update: function(time){

	},
}; // end GameObjects
