var maxDepth = 5;
var maxChildren = 1;
function QuadTree(bound){
    this.maxDepth       = maxDepth;
    this.maxChildren    = maxChildren;
    this.init(bound);
}
QuadTree.prototype = {
    init: function(bound){
        this.root = new QuadNode(bound, 0);
    },
    insert: function(item){
        var root = this.root;
        if(item instanceof Array){
            item.forEach(function(it){
                root.insert(it);
            });
        }else{
            this.root.insert(item);
        }
    }, // end insert
    retrieve: function(item){
        return this.root.retrieve(item).slice(0);
    }, // end retrieve
    clear: function(){
        this.root.clear();
    }
} // end QuadTree
function QuadNode(bound, depth){
    this.maxDepth       = maxDepth;
    this.maxChildren    = maxChildren;
    this.init(bound, depth);
}
QuadNode.prototype = {
    init: function(bound, depth){
        this.bound = bound;
        this.depth = depth;
        this.children = [];
        this.nodes = [];
        this.draw();
    },
    draw: function(){
        this.container = new PIXI.Container();
        var grid = new PIXI.Graphics();
        grid.lineStyle(2, 0x0000FF, 1);
        this.container.x = this.bound.pos.x;
        this.container.y = this.bound.pos.y;
        grid.drawRect(0, 0, this.bound.width, this.bound.height);
        var text = new PIXI.Text("Depth: " + this.depth, {font: '32px Arial', fill: 'black'})
        text.x = 0;
        text.y = 0;
        this.container.addChild(text);
        this.container.addChild(grid);
        stage.addChild(this.container);
    },
    subdivide : function(){
        var depth = this.depth + 1;
        // top left
        this.nodes.push(new QuadNode({pos: new PVector(this.bound.pos.x, 
                                                       this.bound.pos.y),
                                   width : this.bound.width/2,
                                   height: this.bound.height/2}, depth));
        // top right
        this.nodes.push(new QuadNode({pos: new PVector(this.bound.pos.x + this.bound.width/2,
                                                       this.bound.pos.y),
                                   width : this.bound.width/2,
                                   height: this.bound.height/2}, depth));
        // bot left
        this.nodes.push(new QuadNode({pos: new PVector(this.bound.pos.x, 
                                                       this.bound.pos.y + this.bound.height/2),
                                   width : this.bound.width/2,
                                   height: this.bound.height/2}, depth));
        // bot right
        this.nodes.push(new QuadNode({pos: new PVector(this.bound.pos.x + this.bound.width/2,
                                                       this.bound.pos.y + this.bound.height/2),
                                   width : this.bound.width/2,
                                   height: this.bound.height/2}, depth));

    }, // end subdivide
    insert : function(item){
        if(item == undefined) debugger;
        if (this.nodes.length) {
            var locations = this.findlocations(item);
            if(locations.top_left){
                this.nodes[QuadNode.TOP_LEFT].insert(item)
            }
            if(locations.top_right){
                this.nodes[QuadNode.TOP_RIGHT].insert(item)
            }
            if(locations.bot_left){
                this.nodes[QuadNode.BOTTOM_LEFT].insert(item)
            }
            if(locations.bot_right){
                this.nodes[QuadNode.BOTTOM_RIGHT].insert(item)
            }
            return;
        }
        // if this node has no child nodes, then the item is directly added here
        this.children.push(item);
        if((this.depth < this.maxDepth) &&
            (this.children.length > this.maxChildren)){
            this.subdivide();
            var insert = this.insert.bind(this);
            this.children.forEach(function(c){
                insert(c);
            });
            this.children.length = 0;
        }
    }, // end insert
    findlocations : function(item){
        var top_left = this.intersect(item, {pos   : new PVector(this.bound.pos.x, 
                                                                 this.bound.pos.y),
                                             width : this.bound.width/2,
                                             height: this.bound.height/2});
        var top_right = this.intersect(item, {pos   : new PVector(this.bound.pos.x + this.bound.width/2,
                                                                  this.bound.pos.y),
                                             width : this.bound.width/2,
                                             height: this.bound.height/2});
        var bot_left = this.intersect(item, {pos   : new PVector(this.bound.pos.x,
                                                                 this.bound.pos.y + this.bound.height/2),
                                             width : this.bound.width/2,
                                             height: this.bound.height/2});
        var bot_right = this.intersect(item, {pos   : new PVector(this.bound.pos.x + this.bound.width/2,
                                                                  this.bound.pos.y + this.bound.height/2),
                                             width : this.bound.width/2,
                                             height: this.bound.height/2});
        return {top_left: top_left, top_right: top_right, bot_left: bot_left, bot_right: bot_right};
    }, // end findlocation
    intersect : function(item, bound){
        // Assume bound position is its top left corner
        if(bound.anchor == undefined) bound.anchor = {x: 0, y: 0};        
        // is the left side of the item completely on the right of the bound
        var right   = (item.pos.x  - Math.abs(item.width)*(item.anchor.x)) >=
                      (bound.pos.x + Math.abs(bound.width)*(1-bound.anchor.x));
        // is the right side of the item completely on the left of the bound
        var left    = (item.pos.x  + Math.abs(item.width)*(1-item.anchor.x)) <=
                      (bound.pos.x - Math.abs(bound.width)*(bound.anchor.x));
        // is the top side of the item completely on the bottom of the bound
        var bot     = (item.pos.y  - Math.abs(item.height)*(item.anchor.y)) >= 
                      (bound.pos.y + Math.abs(bound.height)*(1-bound.anchor.y));
        // is the bot side of the item completely on top of the bound
        var top     = (item.pos.y  + Math.abs(item.height)*(1-item.anchor.y)) <= 
                      (bound.pos.y - Math.abs(bound.height)*(bound.anchor.y));
        // if any of them were true, the item was not intersecting
        return !( right || left || bot || top);    
    },
    retrieve : function(item){

    }, // end retrieve
    clear: function(){
        this.children.length = 0;
        this.nodes.forEach(function(node){
            node.clear();
        })
        this.nodes.length = 0;
        stage.removeChild(this.container);
    }, // end clear    
} // end QuadNode

QuadNode.TOP_LEFT = 0;
QuadNode.TOP_RIGHT = 1;
QuadNode.BOTTOM_LEFT = 2;
QuadNode.BOTTOM_RIGHT = 3;