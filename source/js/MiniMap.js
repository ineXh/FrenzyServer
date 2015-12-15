function MiniMap(){
    this.create();
}
MiniMap.prototype = {
    create: function(){
        this.map = new PIXI.Container();


        this.border_box = new PIXI.Graphics();
        this.border_box.lineStyle(dim/50, 0x00, 1);
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
        this.updateMap_time = 20;

        this.r = big_dim/5;
        this.scale = this.r / stage_width;
        this.map.scale.set(this.scale)
        //console.log(this.map.width)
    },
    init: function(){
        stage0.addChild(this.map);
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
                    units.drawRect(c.pos.x, c.pos.y, 100, 100);
                });
            });
            units.endFill();
        })
    }, // end update,
    update_viewbox:function(){
        this.view.clear();
        this.view.lineStyle(dim/80, 0xFF0000, 1);
        this.view.drawRect(ScreenPos.left, ScreenPos.top,
                             width, height);

    },
    onTouchStart: function(event){
        //console.log('minimappress')
        //console.log(event)
        //getMouse(event, event.changedTouches[0]);MousePos.x, MousePos.y
        //this.updateMap_count = this.updateMap_time;
        this.update_viewbox();
        var x = MousePos.x / this.map.width * stage_width; // event.data.global.x
        var y = MousePos.y / this.map.height * stage_height; // event.data.global.y
        panTo(x, y);
    },
    onTouchMove: function(){
        var x = MousePos.x / this.map.width * stage_width; // event.data.global.x
        var y = MousePos.y / this.map.height * stage_height; // event.data.global.y
        panTo(x, y);
    },
    onTouchEnd: function(){

    }
} // end MiniMap

