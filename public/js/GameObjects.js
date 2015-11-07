function GameObjects(){
	this.init();
}
GameObjects.prototype = {
	init: function(){
		PIXI.loader
		.add('assets/cow.png')
        .load(this.onassetsloaded.bind(this));

	},
	onassetsloaded : function(){
		console.log("onassetsloaded")
		cow_texture = new PIXI.Texture.fromImage("assets/cow.png");


		assetsloaded = true;
	},
	update: function(time){

	},
}; // end GameObjects
