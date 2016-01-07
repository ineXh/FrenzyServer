//var balls = [];
//var tree;

function GameObjects(){
	this.init();
}
GameObjects.prototype = {
	init: function(){
		PIXI.loader
		.add('assets/cow.png')
		.add('assets/misc.json')
		.add('assets/soldier.json')
        .add('assets/grasses.json')
        .add('assets/cow/1.png')
        .add('assets/cow/2.png')
        .add('assets/cow/3.png')
        .add('assets/cow/4.png')
        .add('assets/cow/5.png')
        .add('assets/coin.png')
        .add('assets/rect.png')
        .add('assets/attack_upgrade_lo.png')
        .add('assets/defense_upgrade_lo.png')
        .add('assets/speed_upgrade_lo.png')
        .add( 'assets/space.fnt')
        .add( 'assets/ataurusp.fnt')
        .add( 'assets/ataurus3d.fnt')
        .add( 'assets/android.fnt')
        .add( 'assets/fipps.fnt')
        .add( 'assets/pixel-love.fnt')
        .load(this.onassetsloaded.bind(this));

	},
	onassetsloaded : function(){
		//console.log("onassetsloaded")
		cow_texture = PIXI.Texture.fromImage("assets/cow.png");
        hut_texture  = PIXI.Texture.fromFrame("hut_142.png");
        coin_texture = PIXI.Texture.fromFrame("assets/coin.png");
        rect_texture = PIXI.Texture.fromImage("assets/rect.png");
        attack_upgrade_texture = PIXI.Texture.fromImage("assets/attack_upgrade_lo.png");
        defense_upgrade_texture = PIXI.Texture.fromImage("assets/defense_upgrade_lo.png");
        speed_upgrade_texture = PIXI.Texture.fromImage("assets/speed_upgrade_lo.png");

		arrow_line_texture = PIXI.Texture.fromFrame("arrow_line.png");
		arrow_head_texture = PIXI.Texture.fromFrame("arrow_head.png");

        for(var i = 1; i <= 8; i++){
            cow_front_frames.push(PIXI.Texture.fromImage('assets/cow/' + i + '.png'));
        }
        for(var i = 1; i <= 6; i++){
            cow_front_frames.push(PIXI.Texture.fromImage('assets/cow/a' + i + '.png'));
        }
        for(var i = 1; i <= 8; i++){
            cow_front_frames.push(PIXI.Texture.fromImage('assets/cow/b' + i + '.png'));
        }
        for(var i = 1; i <= 6; i++){
            cow_front_frames.push(PIXI.Texture.fromImage('assets/cow/ba' + i + '.png'));
        }

        characters = new Characters();
        //path = new Path();
        game = new Game();
        stagesetup = new Stagesetup();

        stagelayout = new Stage_Layout();
        var stage_promise = stagelayout.load();
        menu = new Menu();
        communication = new Communications();

        menu.mainmenu.playlogo();
        //startChat();
        particles = new Particles();
        /*var bounds = {pos: new PVector(0,0),
                    width: width, height: height};//new Rectangle(0,0, quadCanvas.width, quadCanvas.height);
        tree = new QuadTree(bounds);

        stage0.addChild(stage);
        for(var i  = 0; i < 1000; i++){
            var ball = new Ball(getRandomInt(0, width), getRandomInt(0, height),
                width/60, true, cow_texture);
            balls.push(ball);
            tree.insert(ball);
        }*/


		assetsloaded = true;
	},
	update: function(time){
        //checkbutecollisions();
        /*balls.forEach(function(b){
            b.update(time);
        })
        updateTree();
        checkquadcollisions();*/
	},
}; // end GameObjects
var checkquadcollisions = function(){
    var items;
    var count = 0;
    for(var i = 0; i < balls.length; i++){
        var b1 = balls[i];
        items = tree.retrieve(b1);
        if(items == undefined) continue;
        for(var j = 0; j < items.length; j++){
            var b2 = items[j];
            if(b1 == b2) continue;
            b1.collide(b2);
            count++;
        }
    }
    for(var i = 1; i < balls.length; i++){
        var b1 = balls[i];
        b1.sprite.tint = 0xFFFFFF;
    }
    for(var i = 0; i < 1; i++){ // balls.length
        var b1 = balls[i];
        if(items == undefined) continue;
        items = tree.retrieve(b1);
        b1.sprite.tint = 0xFF0000;
        for(var j = 0; j < items.length; j++){
            var b2 = items[j];
            if(b1 == b2) continue;
            //if(b2 == undefined) debugger;
            b2.sprite.tint = 0x00FF00;
        }

        //console.log(items)
    }
    //console.log('count ' + count)
}
var checkbutecollisions = function(){
    for(var i = 0; i < balls.length; i++){
        for(var j = i+1; j < balls.length; j++){
            var b1 = balls[i];
            var b2 = balls[j];
            b1.collide(b2);
        }
    }
}
/*var treecount = 0;
var treetime = 3;
function updateTree(){
    treecount++;
    if(treecount%treetime == 0){
        treecount = 0;
        tree.clear();
        balls.forEach(function(b){
            b.tree_nodes.length = 0;
        })
        tree.insert(balls);
    }

}*/
