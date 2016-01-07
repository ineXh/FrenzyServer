function GameUI(game){
    this.create(game);
}
GameUI.prototype = {
    create: function(game){
        this.game = game;
        //console.log('create ui')
        this.container = new PIXI.Container();

        this.character_sprite = new PIXI.Sprite(cow_texture);
        this.character_sprite.scale.set(big_dim*0.03 / this.character_sprite.width);
        this.character_sprite.anchor.x = 0.5;
        this.character_sprite.anchor.y = 0;
        this.character_sprite.position.x = width*0.82;
        this.character_sprite.position.y = height*0.025;
        this.container.addChild(this.character_sprite);

        this.character_text = new PIXI.extras.BitmapText("12",
          { font: '36px pixel-love',  align: 'left' }); //Space Invaders//fill:"black",//Alpha Taurus Pro
        //Android //Fipps //
        this.character_text.position.x = width*0.845;//this.sprite.x - this.sprite.width/10;
        this.character_text.position.y = height*0.03;//this.sprite.y - this.sprite.height/6;
        this.character_text.tint =  0xFF000077;//RGBColor(getRandomInt(200, 255), getRandomInt(180, 220), 0);
        this.character_text.scale.set(1);
        this.container.addChild(this.character_text);

        this.coin_sprite = new PIXI.Sprite(coin_texture);
        this.coin_sprite.scale.set(big_dim*0.03 / this.coin_sprite.width);
        this.coin_sprite.anchor.x = 0.5;
        this.coin_sprite.anchor.y = 0;
        this.coin_sprite.position.x = width*0.72;
        this.coin_sprite.position.y = height*0.025;
        this.container.addChild(this.coin_sprite);

        this.coin_text = new PIXI.extras.BitmapText("12",
          { font: '36px pixel-love',  align: 'left' }); //Space Invaders//fill:"black",//Alpha Taurus Pro
        //Android //Fipps //
        this.coin_text.position.x = width*0.745;//this.sprite.x - this.sprite.width/10;
        this.coin_text.position.y = height*0.03;//this.sprite.y - this.sprite.height/6;
        this.coin_text.tint =  0xFF000077;//RGBColor(getRandomInt(200, 255), getRandomInt(180, 220), 0);
        this.coin_text.scale.set(1);
        this.container.addChild(this.coin_text);

        this.attack_sprite = new PIXI.Sprite(attack_upgrade_texture);
        this.attack_sprite.scale.set(big_dim*0.03 / this.attack_sprite.width);
        this.attack_sprite.anchor.x = 0.5;
        this.attack_sprite.anchor.y = 0;
        this.attack_sprite.position.x = width*0.5;
        this.attack_sprite.position.y = height*0.025;
        this.container.addChild(this.attack_sprite);

        this.defense_sprite = new PIXI.Sprite(defense_upgrade_texture);
        this.defense_sprite.scale.set(big_dim*0.03 / this.defense_sprite.width);
        this.defense_sprite.anchor.x = 0.5;
        this.defense_sprite.anchor.y = 0;
        this.defense_sprite.position.x = width*0.52;
        this.defense_sprite.position.y = height*0.025;
        this.container.addChild(this.defense_sprite);

        this.speed_sprite = new PIXI.Sprite(speed_upgrade_texture);
        this.speed_sprite.scale.set(big_dim*0.03 / this.speed_sprite.width);
        this.speed_sprite.anchor.x = 0.5;
        this.speed_sprite.anchor.y = 0;
        this.speed_sprite.position.x = width*0.54;
        this.speed_sprite.position.y = height*0.025;
        this.container.addChild(this.speed_sprite);

        this.upgrade_text = new PIXI.extras.BitmapText("12",
          { font: '36px pixel-love',  align: 'left' });
        this.upgrade_text.position.x = width*0.56;
        this.upgrade_text.position.y = height*0.03;
        this.upgrade_text.tint =  0xFF000077;
        this.upgrade_text.scale.set(1);
        this.container.addChild(this.upgrade_text);



        this.update_count = 0;
        this.update_time = 30;
    },
    init: function(){
        stage0.addChild(this.container);
    },
    update: function(){
        if(gamestate != GameState.InPlay) return;
        this.update_count++;
        if(this.update_count < this.update_time) return;
        this.update_count = 0;
        //if(!game.teams[myteam].changed_upgrades) return;
        this.character_text.text = '' + game.teams[myteam].characters[0].length + '/'+ game.teams[myteam].max_unit_count;
        this.coin_text.text = '' + game.teams[myteam].coins;
        this.upgrade_text.text = '' + game.teams[myteam].attack_upgrades + ', '                        + game.teams[myteam].defense_upgrades + ', ' + game.teams[myteam].speed_upgrades;
    }, // end update,
    onTouchStart: function(event){

    },
    onTouchMove: function(){

    },
    onTouchEnd: function(){

    }
} // end GameUI

