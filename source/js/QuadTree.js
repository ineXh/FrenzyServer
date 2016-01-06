var maxDepth = 5;
var maxChildren = 4;
function QuadTree(bound){
    this.pool = new QuadNodePool();
    this.maxDepth       = maxDepth;
    this.maxChildren    = maxChildren;
    this.init(bound);
}
QuadTree.prototype = {
    init: function(bound){
        this.root = this.pool.borrow();//new QuadNode(bound, 0);
        this.root.init(bound, 0, this.pool);
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
function QuadNode(){
    this.maxDepth       = maxDepth;
    this.maxChildren    = maxChildren;
    //this.init(bound, depth);
}
QuadNode.prototype = {
    init: function(bound, depth, pool){
        this.bound = bound;
        this.depth = depth;
        this.pool = pool;
        this.children = [];
        this.nodes = [];
        //this.draw();
    },
    draw: function(){
        this.container = new PIXI.Container();
        var grid = new PIXI.Graphics();
        grid.lineStyle(2, 0x0000FF, 1);
        this.container.x = this.bound.pos.x;
        this.container.y = this.bound.pos.y;
        grid.drawRect(0, 0, this.bound.width, this.bound.height);
        var text = new PIXI.Text("" + this.depth, {font: '32px Arial', fill: 'black'})
        text.x = 0;
        text.y = 0;
        this.container.addChild(text);
        this.container.addChild(grid);
        stage.addChild(this.container);
    },
    subdivide : function(){
        var depth = this.depth + 1;
        var node;
        // top left
        node = this.pool.borrow();//new QuadNode(bound, 0);
        node.init({pos: new PVector(this.bound.pos.x, 
                                    this.bound.pos.y),
                                   width : this.bound.width/2,
                                   height: this.bound.height/2}, depth, this.pool);

        this.nodes.push(node);
        // top right
        node = this.pool.borrow();
        node.init({pos: new PVector(this.bound.pos.x + this.bound.width/2,
                                    this.bound.pos.y),
                                   width : this.bound.width/2,
                                   height: this.bound.height/2}, depth, this.pool);

        this.nodes.push(node);
        // bot left
        node = this.pool.borrow();
        node.init({pos: new PVector(this.bound.pos.x,
                                    this.bound.pos.y + this.bound.height/2),
                                   width : this.bound.width/2,
                                   height: this.bound.height/2}, depth, this.pool);
        this.nodes.push(node);
        // bot right
        node = this.pool.borrow();
        node.init({pos: new PVector(this.bound.pos.x + this.bound.width/2,
                                    this.bound.pos.y + this.bound.height/2),
                                   width : this.bound.width/2,
                                   height: this.bound.height/2}, depth, this.pool);
        this.nodes.push(node);
    }, // end subdivide
    insert : function(item){
        //if(item == undefined) debugger;
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
        var out = [];
        if (this.nodes.length) {
            var locations = this.findlocations(item);
            if(locations.top_left){
                Array.prototype.push.apply(out, this.nodes[QuadNode.TOP_LEFT].retrieve(item));
                //out.push.apply(this.nodes[QuadNode.TOP_LEFT].retrieve(item));
            }
            if(locations.top_right){
                Array.prototype.push.apply(out, this.nodes[QuadNode.TOP_RIGHT].retrieve(item));
                //out.push.apply(this.nodes[QuadNode.TOP_RIGHT].retrieve(item));
            }
            if(locations.bot_left){
                Array.prototype.push.apply(out, this.nodes[QuadNode.BOTTOM_LEFT].retrieve(item));
                //out.push.apply(this.nodes[QuadNode.BOTTOM_LEFT].retrieve(item));
            }
            if(locations.bot_right){
                Array.prototype.push.apply(out, this.nodes[QuadNode.BOTTOM_RIGHT].retrieve(item));
                //out.push.apply(this.nodes[QuadNode.BOTTOM_RIGHT].retrieve(item));
            }
        }
        Array.prototype.push.apply(out, this.children);
        //out.push.apply(out, this.children);
        return out;
    }, // end retrieve
    clean: function(){
        this.children.length = 0;
        if(this.container != undefined) stage.removeChild(this.container);
    }, // end clean
    clear: function(){
        for (var i = this.nodes.length - 1; i >= 0; i--) {
            var node = this.nodes[i];
            node.clean();
            node.clear();
            this.pool.returnNode(node);
            this.nodes.splice(i,1);
        }        
    }, // end clear    
} // end QuadNode

QuadNode.TOP_LEFT = 0;
QuadNode.TOP_RIGHT = 1;
QuadNode.BOTTOM_LEFT = 2;
QuadNode.BOTTOM_RIGHT = 3;

function QuadNodePool() {
    this.complete = false;
    this.loadPool();
}
QuadNodePool.prototype = {
    loadPool: function(){
        this.createNode();
    },   
    borrow : function(){
        return this.borrowNode.call(this);
    },
    return: function(node){
        return this.returnNode.call(this, node);
    },
    createNode: function(){
        this.nodes = [];
        for(var i = 0; i <= maxDepth; i++){
            this.addNode(Math.pow(4, i));    
        }        
    },
    addNode: function(amount){
        for(var i = 0; i < amount; i++){
            this.nodes.push(new QuadNode());
            //console.log("addNode");
        }
    }, // end addNode
    borrowNode : function(){
        if(this.nodes.length >= 1)   return this.nodes.shift();
        else return null;
    }, // end borrowNode
    returnNode: function(node){
        this.nodes.push(node);
    }, // end returnNode
} // end QuadNodePool
