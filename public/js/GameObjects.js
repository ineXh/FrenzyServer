function GameObjects(){
	this.init();
}
GameObjects.prototype = {
	init: function(){
		PIXI.loader
		.add('assets/cow.png')
		.add('assets/misc.json')
		.add('assets/soldier.json')
        .load(this.onassetsloaded.bind(this));

	},
	onassetsloaded : function(){
		console.log("onassetsloaded")
		cow_texture = new PIXI.Texture.fromImage("assets/cow.png");
		arrow_line_texture = PIXI.Texture.fromFrame("arrow_line.png");
		arrow_head_texture = PIXI.Texture.fromFrame("arrow_head.png");
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
