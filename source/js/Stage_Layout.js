var sprite;
var tile_index;
function Stage_Layout(){
	this.init();
}
Stage_Layout.prototype = {   
  init: function(){
  	this.tiles = [];
  	//this.sprites = [];
  	//this.surfaces = [];
  	//this.stagecontainer = new PIXI.Container();
  	//this.platformcontainers = new PIXI.Container();

  },
  load : function(){
    return this.load_s1();
  },
  place_stage : function(){
    stage.addChild(this.container);

  },
  load_s1: function(){
  	//this.stage_width = s1.width * s1.tilewidth;
  	//stage_width 
  	// tile width = stage width / number of tiles
    var stage_layout = this;
    return new Promise(function(resolve, reject){
      stage_layout.num_tiles_x = s1.width;
      stage_layout.end_x = stage_layout.num_tiles_x;
      stage_layout.num_tiles_y = s1.height;
      stage_layout.tilewidth = stage_width / (stage_layout.num_tiles_x);
      stage_layout.tileheight = stage_height / stage_layout.num_tiles_y;

      console.log("stage_width: " + stage_width)
      console.log("this.tilewidth: " + stage_layout.tilewidth);
      console.log("stage_height: " + stage_height)
      console.log("this.tileheight: " + stage_layout.tileheight);
      var texture;
      for(var i = 0; i < s1.tilesets.length; i++){
        texture = PIXI.Texture.fromFrame(s1.tilesets[i].image);
        stage_layout.tiles.push({texture: texture, id: i+1});  
      }
          
      stage_layout.data = s1.layers[0].data.slice(0);
      //
      stage_layout.place(stage_layout.data);
      console.log('stage loaded')
      resolve();
    });
  	
  	
  },  
  place: function(data){
  	this.container = new PIXI.Container();
    this.container.sprites = [];
  	for(var i = 0; i < this.num_tiles_y; i++){
  		for(var j = 0; j < this.end_x; j++){
  			//var tile_index = this.get_tile_index(data, i, j);
  			this.fill_tile_sprite(data,i,j, this.container);
  		}  			
  	}
	

  	
  }, // end place
  get_tile_index : function(data, i, j){
	  	// add extra column on the right
		if (j == this.num_tiles_x){
			//var tile_index = data[i*this.num_tiles_x+j-1];
			var tile_index = data[i*(this.end_x)+j];
		}else{
			var tile_index = data[i*(this.end_x)+j];
		}
		tile_index -= 1;
		return tile_index;
	},
	set_tile_index: function(data, i, j, value){
		if (j == this.num_tiles_x){
			//data[i*this.num_tiles_x+j-1] = value;
			data[i*(this.end_x)+j] = value;
		}else{
			data[i*(this.end_x)+j] = value;
		}
	},
   
  fill_tile_sprite : function(data, i, j, platformcontainer){
    var tile_index = this.get_tile_index(data, i, j);
    var sprite = new PIXI.Sprite(this.tiles[tile_index].texture);
      sprite.anchor.set(0,0);
      sprite.width = this.tilewidth;
      sprite.height = this.tileheight;
      sprite.x = (j-0.5)*sprite.width*0.979;//this.tilewidth;
      sprite.y = i*sprite.height*0.979;//this.tileheight;
      //sprite.alpha = 0.3;
      platformcontainer.sprites.push(sprite);
      platformcontainer.addChild(sprite);
      
      return sprite;
  }, // end fill_tile_sprite
  
  update : function(){

  },
  bound: function(pos, dist){
    var check = false;
    this.platformcontainers.forEach(function(PC){
      if(PC.surfaces == undefined) return;
      PC.surfaces.forEach(function(s){
        if(s.bound_point(pos, dist)) return check = true;
      });
      if(check) return true;
    });   
    if(check) return true;
    return false;
  }, // end bound
  interact: function(object){
  	this.platformcontainers.forEach(function(PC){
  		PC.surfaces.forEach(function(s){
  			s.interact(object);
  		});
  	});  	
  },
  getRelevantTiles: function(object){
  	var left = (object.x - Math.abs(object.width)*(object.anchor.x));

  }, // end getRelevantTiles

} // end Stage