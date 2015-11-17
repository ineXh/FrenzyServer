function GameObjects(){
	this.init();
}
GameObjects.prototype = {
	init: function(){
		PIXI.loader
		.add('assets/cow.png')
		.add('assets/misc.json')
		.add('assets/soldier.json')
        .add('assets/cow/1.png')
        .add('assets/cow/2.png')
        .add('assets/cow/3.png')
        .add('assets/cow/4.png')
        .add('assets/cow/5.png')
        .load(this.onassetsloaded.bind(this));

	},
	onassetsloaded : function(){
		console.log("onassetsloaded")
		cow_texture = new PIXI.Texture.fromImage("assets/cow.png");
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
        menu = new Menu();
        communication = new Communications();

        menu.mainmenu.playlogo();
        //startChat();

		assetsloaded = true;
	},
	update: function(time){

	},
}; // end GameObjects
