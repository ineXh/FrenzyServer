function MiniMap(){
    this.create();
}
MiniMap.prototype = {
    create: function(){
        this.map = new PIXI.Container();


        this.border_box = new PIXI.Graphics();
        this.border_box.lineStyle(dim/30, 0x00, 1);
        this.border_box.beginFill(0x000000, 0.5);
        this.border_box.drawRect(0, 0, stage_width, stage_height);
        this.map.addChild(this.border_box);

        this.units = new PIXI.Graphics();
        this.map.addChild(this.units);
        this.map.interactive = true;
        //this.map.on('touchstart'          , this.minimappress.bind(this));
        this.view = new PIXI.Graphics();
        this.map.addChild(this.view);


        this.updateMap_count = 0;
        this.updateMap_time = 10;

        this.map_width = big_dim/5;
        this.scale = this.map_width / stage_width;
        this.map.scale.set(this.scale)
        //console.log(this.map.width)
        this.stage_border_box = new PIXI.Graphics();
        this.stage_border_box.lineStyle(5, 0xFF0000, 1);
        this.stage_border_box.drawRect(0, 0, stage_width, stage_height);
    },
    init: function(){
        stage0.addChild(this.map);
        stage.addChild(this.stage_border_box);
    },
    update: function(){
        if(gamestate != GameState.InPlay) return;
        this.updateMap_count++;
        if(this.updateMap_count < this.updateMap_time) return;
        this.updateMap_count = 0;
        this.update_viewbox();
        var units = this.units;
        units.clear();
        //units.lineStyle(10, 0xff0000, 1);
        game.teams.forEach(function(t){
            units.beginFill(t.color, 1);
            t.characters.forEach(function(ct){
                ct.forEach(function(c){
                    units.drawRect(c.pos.x, c.pos.y, big_dim/8, big_dim/8);
                });
            });
            units.endFill();
        })
    }, // end update,
    update_viewbox:function(){
        this.view.clear();
        //this.view.lineStyle(dim/80, 0xFF0000, 1);
        this.view.lineStyle(dim/30, myteamcolor, 1);

        this.view.drawRect(ScreenPos.left / 1, ScreenPos.top / 1,
                             width / stage_scale, height / stage_scale);

    },
    onTouchStart: function(event){
        //console.log('minimappress')
        //console.log(event)
        //getMouse(event, event.changedTouches[0]);MousePos.x, MousePos.y
        //this.updateMap_count = this.updateMap_time;
        this.update_viewbox();
        //console.log(MousePos)
        var x = MousePos.raw_x / this.map_width * stage_width; // event.data.global.x
        var y = MousePos.raw_y / this.map_width * stage_height; // event.data.global.y
        panTo(x, y);
    },
    onTouchMove: function(){
        var x = MousePos.raw_x / this.map_width * stage_width; // event.data.global.x
        var y = MousePos.raw_y / this.map_width * stage_height; // event.data.global.y
        panTo(x, y);
    },
    onTouchEnd: function(){

    }
} // end MiniMap

