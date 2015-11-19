function MiniMap(){
    this.create();
}
MiniMap.prototype = {
    create: function(){
        this.map = new PIXI.Container();
        stage0.addChild(this.map);

        this.border_box = new PIXI.Graphics();
        this.border_box.lineStyle(50, 0xFF0000, 1);
        this.border_box.beginFill(0x00FF0B, 0.5);
        this.border_box.drawRect(0, 0, stage_width, stage_height);
        this.map.addChild(this.border_box);

        this.units = new PIXI.Graphics();



        this.updateMap_count = 0;
        this.updateMap_time = 0;

        //this.r = big_dim/5;
        //this.scale = this.r / stage_width;
        this.map.scale.set(this.scale)
    },
    update: function(){
        if(gamestate != GameState.InPlay) return;
        this.updateMap_count++;
        if(this.updateMap_count < this.updateMap_time) return;
        this.updateMap_count = 0;
        var units = this.units;
        units.clear();
        //units.lineStyle(10, 0xff0000, 1);
        game.teams.forEach(function(t){
            units.beginFill(0xFFFF0B, 0.5);
            t.characters.forEach(function(ct){
                ct.forEach(function(c){
                    units.drawRect(c.pos.x, c.pos.y, 10, 10);
                });
            });
            units.endFill();
        })
    } // end update
}
