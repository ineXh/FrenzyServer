function GameUI(){
    this.create();
}
GameUI.prototype = {
    create: function(){
        this.ui = new PIXI.Container();
        console.log('create ui')
        this.text = new PIXI.extras.BitmapText("Start Game" + getRandomInt(5, 15),
          { font: '66px Space Invaders', fill:"black", align: 'center' });
        this.text.position.x = 200;//this.sprite.x - this.sprite.width/10;
        this.text.position.y = 200;//this.sprite.y - this.sprite.height/6;
        this.text.tint =  0xFF0000;//RGBColor(getRandomInt(200, 255), getRandomInt(180, 220), 0);
        this.ui.addChild(this.text);
    },
    init: function(){
        stage0.addChild(this.ui);
    },
    update: function(){
        if(gamestate != GameState.InPlay) return;
       
    }, // end update,    
    onTouchStart: function(event){
        
    },
    onTouchMove: function(){
       
    },
    onTouchEnd: function(){

    }
} // end GameUI

