function GameUI(){
    this.create();
}
GameUI.prototype = {
    create: function(){
        this.ui = new PIXI.Container();

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

