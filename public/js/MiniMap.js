function MiniMap(){this.create()}MiniMap.prototype={create:function(){this.map=new PIXI.Container,this.border_box=new PIXI.Graphics,this.border_box.lineStyle(dim/50,0,1),this.border_box.beginFill(0,.5),this.border_box.drawRect(0,0,stage_width,stage_height),this.map.addChild(this.border_box),this.units=new PIXI.Graphics,this.map.addChild(this.units),this.map.interactive=!0,this.view=new PIXI.Graphics,this.map.addChild(this.view),this.updateMap_count=0,this.updateMap_time=20,this.r=big_dim/5,this.scale=this.r/stage_width,this.map.scale.set(this.scale)},init:function(){stage0.addChild(this.map)},update:function(){if(gamestate==GameState.InPlay&&(this.updateMap_count++,!(this.updateMap_count<this.updateMap_time))){this.updateMap_count=0,this.update_viewbox();var t=this.units;t.clear(),game.teams.forEach(function(i){t.beginFill(i.color,1),i.characters.forEach(function(i){i.forEach(function(i){t.drawRect(i.pos.x,i.pos.y,big_dim/8,big_dim/8)})}),t.endFill()})}},update_viewbox:function(){this.view.clear(),this.view.lineStyle(dim/80,myteamcolor,1),this.view.drawRect(ScreenPos.left,ScreenPos.top,width,height)},onTouchStart:function(t){this.update_viewbox();var i=MousePos.x/this.map.width*stage_width,e=MousePos.y/this.map.height*stage_height;panTo(i,e)},onTouchMove:function(){var t=MousePos.x/this.map.width*stage_width,i=MousePos.y/this.map.height*stage_height;panTo(t,i)},onTouchEnd:function(){}};