function GameUI(game){
    this.create(game);
}
GameUI.prototype = {
    create: function(game){
        this.game = game;
        //console.log('create ui')
        this.ui = new PIXI.Container();

        this.character_sprite = new PIXI.Sprite(cow_texture);
        this.character_sprite.scale.set(height*0.03 / this.character_sprite.width);
        this.character_sprite.anchor.x = 0.5;
        this.character_sprite.anchor.y = 0;
        this.character_sprite.position.x = width*0.91;
        this.character_sprite.position.y = height*0.025;
        this.ui.addChild(this.character_sprite);

        this.character_text = new PIXI.extras.BitmapText("12",
          { font: '36px pixel-love',  align: 'left' }); //Space Invaders//fill:"black",//Alpha Taurus Pro
        //Android //Fipps //
        this.character_text.position.x = width*0.935;//this.sprite.x - this.sprite.width/10;
        this.character_text.position.y = height*0.03;//this.sprite.y - this.sprite.height/6;
        this.character_text.tint =  0xFF000077;//RGBColor(getRandomInt(200, 255), getRandomInt(180, 220), 0);
        this.character_text.scale.set(1);
        this.ui.addChild(this.character_text);

        this.coin_sprite = new PIXI.Sprite(coin_texture);
        this.coin_sprite.scale.set(height*0.03 / this.coin_sprite.width);
        this.coin_sprite.anchor.x = 0.5;
        this.coin_sprite.anchor.y = 0;
        this.coin_sprite.position.x = width*0.775;
        this.coin_sprite.position.y = height*0.025;
        this.ui.addChild(this.coin_sprite);

        this.coin_text = new PIXI.extras.BitmapText("12",
          { font: '36px pixel-love',  align: 'left' }); //Space Invaders//fill:"black",//Alpha Taurus Pro
        //Android //Fipps //
        this.coin_text.position.x = width*0.800;//this.sprite.x - this.sprite.width/10;
        this.coin_text.position.y = height*0.03;//this.sprite.y - this.sprite.height/6;
        this.coin_text.tint =  0xFF000077;//RGBColor(getRandomInt(200, 255), getRandomInt(180, 220), 0);
        this.coin_text.scale.set(1);
        this.ui.addChild(this.coin_text);

        this.update_count = 0;
        this.update_time = 10;
    },
    init: function(){
        stage0.addChild(this.ui);
    },
    update: function(){
        if(gamestate != GameState.InPlay) return;
        this.update_count++;
        if(this.update_count < this.update_time) return;
        this.update_count = 0;
        this.character_text.text = '' + game.teams[myteam].characters[0].length + '/'+ game.teams[myteam].max_unit_count;
        this.coin_text.text = '' + game.teams[myteam].coins;
    }, // end update,
    onTouchStart: function(event){

    },
    onTouchMove: function(){

    },
    onTouchEnd: function(){

    }
} // end GameUI

