function GameObjects(){
	this.init();
}
GameObjects.prototype = {
	init: function(){
		PIXI.loader
		.add('assets/cow.png')
		.add('assets/misc.json')
        .load(this.onassetsloaded.bind(this));

	},
	onassetsloaded : function(){
		console.log("onassetsloaded")
		cow_texture = new PIXI.Texture.fromImage("assets/cow.png");
		arrow_line_texture = PIXI.Texture.fromFrame("arrow_line.png");
		arrow_head_texture = PIXI.Texture.fromFrame("arrow_head.png");
        characters = new Characters();
        path = new Path();
        communication = new Communications();

		assetsloaded = true;
	},
	update: function(time){

	},
}; // end GameObjects
