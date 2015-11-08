function Game(){
    this.init();
}
Game.prototype = {
    init: function(){

    },
    update: function(){

    },
    startgame: function(){
    //stage.width = width;
    //stage.height = height;
    switch(startlocation){
        case StartLocation.NW:
            stage.x = 0;
            stage.y = 0;
            break;
        case StartLocation.NE:
            stage.x = -stage_width + width;
            stage.y = 0;
            break;
        case StartLocation.SW:
            stage.x = 0;
            stage.y = -stage_height + height;
            break;
        case StartLocation.SE:
            stage.x = -stage_width + width;
            stage.y = -stage_height + height;
            break;
    }
    characters.spawn({  x: -stage.x + width/2, y: -stage.y + height/2,
                    type: CharacterType.Cow});

    }
}; // end Game
