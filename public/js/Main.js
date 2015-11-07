var width, height, dim, big_dim;
var stage_width, stage_height;
var scope_width, scope_height;
var center;
var ball;
var renderer;
// Overall Stage
var stage0;
// In game Stage
var stage;
// In game Path
var path_container;


var startTime, lastTime;
var time;
var gamestate;
var gameobjects;
var gameitems;
var menu;
var battle;
var battleUI;
var stagesetup;
var stagelayout;
var stagenum = 1;
var ad_module;
var ground;
var assetsloaded = false;
var path;
var Engine = (function(global) {

	startTime = Date.now();
	width 	= window.innerWidth;
	height 	= window.innerHeight;
	stage_width = width*1;
	stage_height = height*1;
	dim = (width < height) ? width : height;
	big_dim = (width < height) ? height : width;
	scope_width = width*0.25;
	scope_height = height*0.25;

	document.addEventListener("mousedown", onMouseStart, true);	
	document.addEventListener("touchstart", onTouchStart, true);	
	document.addEventListener("touchend", onTouchEnd, true);
	document.addEventListener("touchmove", onTouchMove, true);
	document.addEventListener("backbutton", backButtonTap, true);
	
	renderer = PIXI.autoDetectRenderer(width, height*1.0 ,{backgroundColor : GrassColor2});
	// view is canvas
	document.body.appendChild(renderer.view);
	stage = new PIXI.Container();
	stage0 = new PIXI.Container();
	stage0.addChild(stage)
	path_container = new PIXI.Container();
	stage0.addChild(path_container);
	/*stage1 = new PIXI.Container();
	var box = new PIXI.Graphics();
	box.beginFill(0x00FF);
    box.drawRect(100, 100, 50, 50);
    box.endFill();
    stage1.addChild(box);
    */
    
    //stage0.addChild(stage1)
 	
 	gamestate = GameState.MainMenu;
 	ground = stage_height*1.0;
	/*var graphics = new PIXI.Graphics();
	graphics.lineStyle(2, 0x0000FF, 1);
    graphics.drawRect(-stage_width*0.0, -stage_height*0.0, stage_width*1.0, stage_height*1.0);

   
    stage.addChild(graphics);*/

   
 	menu = new Menu();
 	gameobjects = new GameObjects();
 	gameitems = new GameItems();
 	stagesetup = new Stagesetup();



	animate();
})(this);

function update(){
	 var now = Date.now(),
         dt  = (now - lastTime),
         t   = (now - startTime);
    time = {t:t, dt: dt};
    
    gameobjects.update(time);
    lastTime = now;

    
    if(assetsloaded){
    	menu.update(time);
    }
}

function animate() {
	update();
	
	
    renderer.render(stage0);

	
	requestAnimationFrame( animate );
}
